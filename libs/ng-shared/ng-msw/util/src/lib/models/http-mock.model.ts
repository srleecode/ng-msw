import { DefaultRequestBody, PathParams, RestRequest } from 'msw';
import { MethodType } from './method-type.model';

export interface HttpMock<T = unknown, R = DefaultRequestBody> {
  url: string;
  method?: MethodType;
  status?: number;
  delay?: number;
  once?: boolean;
  response?: T;
  responseFn?: (req: RestRequest<R, PathParams>) => T;
}
