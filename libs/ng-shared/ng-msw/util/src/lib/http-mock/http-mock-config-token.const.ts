import { InjectionToken } from '@angular/core';
import { HttpMock } from '../models/http-mock.model';

export const HTTP_MOCK_CONFIG = new InjectionToken<HttpMock[]>('HTTP_MOCK_CONFIG');
