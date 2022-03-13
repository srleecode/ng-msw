import { RequestHandler, MockedRequest, DefaultRequestBody } from 'msw';
import { RequestHandlerDefaultInfo } from 'msw/lib/types/handlers/RequestHandler';

export type MswRequestHandler = RequestHandler<
  RequestHandlerDefaultInfo,
  MockedRequest<DefaultRequestBody>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  MockedRequest<DefaultRequestBody>
>;
