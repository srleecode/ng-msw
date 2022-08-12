import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpMockModule } from './http-mock.module';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { forkJoin, map } from 'rxjs';
import { HttpMock } from '../models/http-mock.model';

const url = 'endpoint';
const body = {
  data: 'test',
};
describe('msw mocks', () => {
  let httpClient: HttpClient;

  const setupMocks = (mocks: HttpMock[]) => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpMockModule.forRoot(mocks)],
    });
    httpClient = TestBed.inject(HttpClient);
  };

  it('should mock response for endpoint', () => {
    setupMocks([{ url, response: { ...body } }]);
    const observerSpy = subscribeSpyTo(httpClient.get(url));
    expect(observerSpy.getLastValue()).toEqual(body);
  });
  it('should return response for given method type', () => {
    setupMocks([{ url, method: 'POST', response: { ...body } }]);
    const observerSpy = subscribeSpyTo(httpClient.post(url, {}));
    expect(observerSpy.getLastValue()).toEqual(body);
  });
  it('should return response for both method types when given two responses with different method types', () => {
    setupMocks([
      { url, method: 'GET', response: { ...body } },
      { url, method: 'POST', response: { ...body } },
    ]);
    const observerSpy = subscribeSpyTo(forkJoin([httpClient.get(url, {}), httpClient.post(url, {})]));
    expect(observerSpy.getLastValue()).toEqual([body, body]);
  });
  it('should mock response once and use next mock response after first has occured when once is true', () => {
    const secondBody = { data: 'test-2' };
    setupMocks([
      { url, once: true, response: { ...body } },
      { url, response: { ...secondBody } },
    ]);
    const observerSpy = subscribeSpyTo(forkJoin([httpClient.get(url, {}), httpClient.post(url, {})]));
    expect(observerSpy.getLastValue()).toEqual([body, secondBody]);
  });
  it('should return respone with given status', () => {
    const status = 204;
    setupMocks([{ url, status, response: { ...body } }]);
    const observerSpy = subscribeSpyTo(httpClient.get(url, { observe: 'response' }).pipe(map((rsp) => rsp.status)));
    expect(observerSpy.getLastValue()).toEqual(status);
  });
  it('should return respone with given delay', fakeAsync(() => {
    setupMocks([{ url, delay: 200, response: { ...body } }]);
    const observerSpy = subscribeSpyTo(httpClient.get(url));
    tick(200);
    expect(observerSpy.getLastValue()).toEqual(body);
  }));
  it('should read params from request when generating response with function', () => {
    const params = new HttpParams({
      fromObject: {
        param: 'test',
      },
    });

    setupMocks([
      {
        url,
        responseFn: (req) => ({
          data: req.params['param'],
        }),
      },
    ]);
    const observerSpy = subscribeSpyTo(httpClient.get(url, { params }));
    expect(observerSpy.getLastValue()).toEqual({
      data: ['test'],
    });
  });
  it('should read headers from request when generating response with function', () => {
    const headers = new HttpHeaders({
      test: 'test',
    });
    setupMocks([
      {
        url,
        responseFn: (req) => ({
          data: req.headers.get('test'),
        }),
      },
    ]);
    const observerSpy = subscribeSpyTo(httpClient.get(url, { headers }));
    expect(observerSpy.getLastValue()).toEqual({
      data: 'test',
    });
  });
  it('should read body from request when generating response with function', () => {
    setupMocks([
      {
        url,
        responseFn: (req) => req.body,
      },
    ]);
    const observerSpy = subscribeSpyTo(httpClient.post(url, body));
    expect(observerSpy.getLastValue()).toEqual(body);
  });
  it('should apply to all method types when a method type is not provided', () => {
    setupMocks([{ url, response: { ...body } }]);
    const observerSpy = subscribeSpyTo(httpClient.post(url, {}));
    expect(observerSpy.getLastValue()).toEqual(body);
  });
  it('should match url that includes query parameters', () => {
    const queryParamUrl = 'endpoint?start=0&limit=10';
    setupMocks([{ url: queryParamUrl, response: { ...body } }]);
    const observerSpy = subscribeSpyTo(httpClient.post(queryParamUrl, {}));
    expect(observerSpy.getLastValue()).toEqual(body);
  });
});
