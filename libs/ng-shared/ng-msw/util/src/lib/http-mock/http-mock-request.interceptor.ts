import { Inject, Injectable, Optional } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { interval, map, Observable, of } from 'rxjs';
import { delayWhen } from 'rxjs/operators';
import { HTTP_MOCK_CONFIG } from './http-mock.module';
import { DefaultRequestBody, PathParams, RestRequest } from 'msw';
import { Headers } from 'headers-polyfill';
import { HttpMock } from '../models/http-mock.model';
import { MethodType } from '../models/method-type.model';
import { MswRequestHandler } from '../models/msw-request-handler.type';

@Injectable()
export class HttpMockRequestInterceptor implements HttpInterceptor {
  private doneMocks = new Set<number>();
  constructor(@Optional() @Inject(HTTP_MOCK_CONFIG) private config: HttpMock[]) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    for (const [i, httpMock] of (this.config || []).filter((mock) => this.isHttpMock(mock)).entries()) {
      const regExp = new RegExp(httpMock.url, 'i');
      if (this.isMatchingMethodType(request, httpMock) && regExp.exec(request.url) && !this.doneMocks.has(i)) {
        return this.getMockedResponse(request, httpMock, i);
      }
    }
    return next.handle(request);
  }

  private isHttpMock(handler: HttpMock | MswRequestHandler): handler is HttpMock {
    return !!(handler as HttpMock)?.url;
  }

  private isMatchingMethodType(request: HttpRequest<unknown>, httpMock: HttpMock): boolean {
    return !httpMock.method || (request.method as MethodType) === httpMock.method;
  }

  private getMockedResponse(
    request: HttpRequest<unknown>,
    httpMock: HttpMock,
    httpMockIndex: number
  ): Observable<HttpResponse<unknown>> {
    const status = httpMock.status ?? 200;
    const delay = httpMock.delay ?? 0;
    const response = httpMock.response ?? httpMock.responseFn(this.getMswRequest(request, httpMockIndex));
    const isError = status.toString().startsWith('4') || status.toString().startsWith('5');
    if (httpMock.once) {
      this.doneMocks.add(httpMockIndex);
    }

    return of({}).pipe(
      delayWhen(() => (delay ? interval(delay) : of(undefined))),
      map(() => {
        if (isError) {
          throw new HttpErrorResponse({
            status,
            error: new Error(JSON.stringify(response)),
          });
        }
        return new HttpResponse({
          status,
          body: response,
        });
      })
    );
  }

  private getMswHeaders(request: HttpRequest<unknown>): Headers {
    const headers: Record<string, string[]> = {};
    request.headers.keys().forEach((key) => (headers[key] = request.headers.getAll(key)));
    return new Headers(headers);
  }

  private getMswParams(request: HttpRequest<unknown>): PathParams {
    const params: Record<string, string | ReadonlyArray<string>> = {};
    request.params.keys().forEach((key) => (params[key] = request.params.getAll(key)));
    return params;
  }

  private getMswRequest(
    request: HttpRequest<unknown>,
    httpMockIndex: number
  ): RestRequest<DefaultRequestBody, PathParams> {
    return {
      id: httpMockIndex.toString(),
      url: undefined,
      method: request.method,
      headers: this.getMswHeaders(request),
      cookies: undefined,
      mode: undefined,
      keepalive: undefined,
      cache: undefined,
      destination: undefined,
      integrity: undefined,
      credentials: undefined,
      redirect: undefined,
      referrer: undefined,
      referrerPolicy: undefined,
      body: request.body,
      bodyUsed: !!request.body,
      params: this.getMswParams(request),
    };
  }
}
