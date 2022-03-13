import {
  DefaultRequestBody,
  rest,
  PathParams,
  RestRequest,
  RestContext,
  ResponseTransformer,
  SetupWorkerApi,
  setupWorker,
} from 'msw';
import { ResponseResolver } from 'msw/lib/types/handlers/RequestHandler';
import { isNodeProcess } from 'is-node-process';
import { HttpMock } from '../models/http-mock.model';
import { MswRequestHandler } from '../models/msw-request-handler.type';

let api: SetupWorkerApi;
const IS_BROWSER = !isNodeProcess();

const isHttpMock = (handler: HttpMock | MswRequestHandler): handler is HttpMock => !!(handler as HttpMock)?.url;
const getSlashPrefixedUrl = (url: string) => (url.startsWith('/') ? url : `/${url}`);

export const getWorker = (): SetupWorkerApi => api;

export const initialize = (options?: Parameters<SetupWorkerApi['start']>[0]): SetupWorkerApi => {
  if (IS_BROWSER) {
    const worker = setupWorker();
    worker.start(options);
    api = worker;
  } else {
    throw new Error('MswModule is not supported in node use the HttpMockModule instead');
  }
  return api;
};

const addHttpMockSettings =
  (httpMock: HttpMock): ResponseTransformer<unknown, unknown> =>
  (res) => {
    const { status, delay, once } = httpMock;
    res.status = status ?? 200;
    if (delay) {
      res.delay = delay;
    }
    if (once) {
      res.once = once;
    }
    return res;
  };

export const resetHandlers = () => {
  const worker = getWorker();
  worker.resetHandlers();
};

export const addHandlers = (...handlers: (HttpMock | MswRequestHandler)[]): void => {
  const worker = getWorker();
  const processedHandlers: MswRequestHandler[] = [];
  handlers.forEach((handler) => {
    if (isHttpMock(handler)) {
      processedHandlers.push(getRestHandlers(handler.url, handler));
    } else {
      processedHandlers.push(handler);
    }
  });
  worker.use(...processedHandlers);
};

const getRestHandlers = (mocksUrl: string, mock: HttpMock): MswRequestHandler => {
  const url = getSlashPrefixedUrl(mocksUrl);
  const responseResolver: ResponseResolver<RestRequest<never, PathParams>, RestContext, DefaultRequestBody> = (
    req,
    res,
    ctx
  ) => {
    const response = mock.response ?? mock.responseFn(req);
    return res(addHttpMockSettings(mock), ctx.json(response));
  };
  const method = mock.method ?? 'GET';
  switch (method) {
    case 'GET':
      return rest.get(url, responseResolver);
    case 'POST':
      return rest.post(url, responseResolver);
    case 'PUT':
      return rest.put(url, responseResolver);
    case 'DELETE':
      return rest.delete(url, responseResolver);
  }
};
