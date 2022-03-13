import { HttpMock } from '@srleecode/ng-msw';

export const THEME_MOCKS: HttpMock[] = [
  {
    url: 'user/theme',
    response: {
      lightTheme: true,
    },
  },
  {
    url: 'user/theme',
    method: 'POST',
    response: {},
  },
];
