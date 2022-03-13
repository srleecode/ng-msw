import { HeaderStoreService } from './header-store.service';
import { TestBed } from '@angular/core/testing';
import { HttpMockModule } from '@srleecode/ng-shared/ng-msw/util';
import { THEME_MOCKS } from '@srleecode/ng-shared/components/header/domain/testing';
import { HttpClientModule } from '@angular/common/http';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

describe('HeaderStoreService', () => {
  let service: HeaderStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpMockModule.forRoot(THEME_MOCKS)],
      providers: [HeaderStoreService],
    });
    service = TestBed.inject(HeaderStoreService);
  });

  describe('loadTheme', () => {
    it('shoud load theme from api', () => {
      service.loadTheme();
      const observerSpy = subscribeSpyTo(service.lightTheme$);
      expect(observerSpy.getLastValue()).toEqual(true);
    });
  });
});
