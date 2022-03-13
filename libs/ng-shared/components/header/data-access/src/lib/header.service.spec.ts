import { HttpClient } from '@angular/common/http';
import { ThemeService } from './theme.service';
import { instance, mock } from 'ts-mockito';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { of } from 'rxjs';

const mockHttpClient = mock(HttpClient);

describe('ThemeService', () => {
  let service: ThemeService;
  let httpClient: HttpClient;

  beforeEach(() => {
    jest.clearAllMocks();
    httpClient = instance(mockHttpClient);
    service = new ThemeService(httpClient);
    jest.spyOn(httpClient, 'get').mockReturnValue(of({}));
    jest.spyOn(httpClient, 'post').mockReturnValue(of({}));
  });
  describe('save', () => {
    it('shoud call correct endpoint', () => {
      const observerSpy = subscribeSpyTo(service.save$(true));
      observerSpy.onComplete(() => {
        expect(httpClient.post).toHaveBeenCalledWith('user/theme', { isLightTheme: true });
      });
    });
  });
  describe('load', () => {
    it('shoud call correct endpoint', () => {
      const observerSpy = subscribeSpyTo(service.load$());
      observerSpy.onComplete(() => {
        expect(httpClient.get).toHaveBeenCalledWith('user/theme');
      });
    });
  });
});
