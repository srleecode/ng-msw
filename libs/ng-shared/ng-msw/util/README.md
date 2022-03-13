# @srleecode/ng-msw

# Purpose

Mock service worker is a great tool. However, while using it I have encountered two main issues

- It is verbose. The majority of the mocks I use are simple json responses. This would require the below code in mock service worker

```
 rest.get('/users/:userId', (req, res, ctx) =>
   res(
     ctx.json({
       id: userId,
       firstName: 'John',
       lastName: 'Maverick',
     }),
   )
 ),
```

- It is async. This means if you want to reuse the same mocks in jest unit tests the tests will be more complicated.

# Solution

- `mswDecorator` and `initialize`. These can be used to start the mock service worker with a set of mocks that will be returned. This is to be used in the storybook tests.
- `HttpMockModule`. This loads a Angular interceptor that returns the mocks as observables. Using HttpMockModule makes it easy to use the mocks in jest tests with services.
- Both approaches consume `HttpMock` objects. This allows you to use the same mocks in the storybook tests and the jest service tests. The rest mock service worker example above can be written like this with a `HttpMock` object.

```
{
  url: '/users/:userId',
  response: {
    id: userId,
    firstName: 'John',
    lastName: 'Maverick',
  }
}
```

# Install

- Ensure you have msw setup, i.e. follow https://mswjs.io/docs/getting-started/install
- install the npm package
  `npm install @srleecode/ng-msw --save-dev`
  or
  `yarn add @srleecode/ng-msw --dev`
- add code to start mock service worker with the decorator to load the mocks in storybook .preview.js

```ts
import { initialize } from '@srleecode/ng-msw';

initialize();
export const decorators = [mswDecorator];
```

- Create mock objects

```ts
import { HttpMock, MswRequestHandler } from '@srleecode/ng-msw';

export const MOCKS: (HttpMock | MswRequestHandler)[] = [
  {
    url: '/users/:userId',
    response: {
      id: userId,
      firstName: 'John',
      lastName: 'Maverick',
    },
  },
];
```

- if in storybook add the mocks using a parameter. This paramter can be provided in the Meta which would apply it to all stories in the file, in the preview.js file which would apply it all stories or it can be provided in each story. For example:

```ts
export default {
  component: TestComponent,
  title: 'NgShared/MswMocks/Util',
  decorators: [
    moduleMetadata({
      imports: [TestModule, HttpClientModule, MswModule.forRoot(MOCKS)],
    }),
  ],
  parameters: {
    msw: MOCKS,
  },
} as Meta;
```

If in jest, add the `HttpMockModule`. For example,

```ts
TestBed.configureTestingModule({
  imports: [HttpClientModule, HttpMockModule.forRoot(mocks)],
});
```

# Using Msw directly

Some use cases might not currently be covered using the currently develop functionality. To overcome this you can use normal msw requests in the mocks. Note that these will be ignored when testing in jest with the HttpMockModule, but they will work in storybook with the MswModule.

```ts
import { HttpMock, MswRequestHandler } from '@srleecode/ng-msw';

export const MOCKS: (HttpMock | MswRequestHandler)[] = [
  rest.get('endpoint', (req, res, ctx) =>
    res(
      ctx.json({
        data: 'endpoint',
      })
    )
  ),
];
```

If there is a use case you would like to be supported using the `HttpMock` objects please raise an issue or feel free to raise a pull request.
