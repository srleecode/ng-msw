# @srleecode/ng-msw

This adds functionality for:

- Mock service worker in storybook
- Mocking endpoints in Angular tests

## HttpMock

Mock responses are configured using `HttpMock` objects. These same objects are used to mock out the responses in storybook and the Angular tests.

```ts
// T = type of resposne
// R = request body type
export interface HttpMock<T = unknown, R = DefaultRequestBody> {
  url: string; // url to response a mock response for

  method?: MethodType; // restricts the mcoking to only one method type of the following: 'GET' | 'POST' | 'PUT' | 'DELETE'
  status?: number; // status to return in mcoked response
  delay?: number; // delay time until the mocked response is returned
  once?: boolean; // mock the response only once
  response?: T; // the response to return as the mocked response
  responseFn?: (req: RestRequest<R, PathParams>) => T; // a function to call to generated the mocked response. Only response or responseFn should be used, not both
}
```

## Storybook

Add the mswDecorator in the storybook preview.js file

```ts
import { initialize, mswDecorator } from '@srleecode/ng-msw';

initialize();

export const decorators = [mswDecorator];
```

In the relevant story add the msw parameter with your `HttpMock` objects.

```ts
export default {
  ...
  parameters: {
    msw: MOCKS, // array of HttpMock objects
  },
} as Meta;
```

## Angular tests

In the angular tests import the `HttpMockModule` and pass in an array of `HttpMock` objects.

```ts
import { HttpMockModule } from '@srleecode/ng-msw';
...
TestBed.configureTestingModule({
    imports: [HttpMockModule.forRoot(THEME_MOCKS)],
});
```

## Notes

Be careful with overlapping urls. For example, if you have mocked out "/api/test" and "/api/test/12345" and you hit the url "/api/test/12345". It will hit the first url and return the mocked response for that even though you might be expecting the second url. To avoid issues with overlapping urls be careful with them and have the more specific urls earlier in your array of `HttpMock` objects. When a call is made, it will go through the `HttpMock` objects and return the mocked response only for the first one that matches the called url.
