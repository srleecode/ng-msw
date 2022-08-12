import { rest } from 'msw';
import { HttpMock, MswRequestHandler } from '@srleecode/ng-msw';

export interface MockResponse {
  data: string;
}

export const MOCKS: (HttpMock | MswRequestHandler)[] = [
  {
    url: 'endpoint-one',
    response: {
      data: 'endpoint-one',
    },
  },
  rest.get('endpoint-two', (req, res, ctx) =>
    res(
      ctx.json({
        data: 'endpoint-two',
      })
    )
  ),
  {
    url: 'endpoint-three',
    method: 'POST',
    response: {
      data: 'endpoint-three',
    },
  },
  {
    url: 'endpoint-four',
    method: 'POST',
    response: {
      data: 'endpoint-four',
    },
  },
  {
    url: 'endpoint-four',
    method: 'PUT',
    response: {
      data: 'endpoint-four',
    },
  },
  {
    url: 'endpoint-five',
    status: 500,
    response: {
      data: 'endpoint-five',
    },
  },
  {
    url: 'endpoint-six',
    once: true,
    response: {
      data: 'response 1',
    },
  },
  {
    url: 'endpoint-six',
    response: {
      data: 'response 2',
    },
  },
  {
    url: 'endpoint-seven',
    delay: 500,
    response: {
      data: 'endpoint-seven',
    },
  },
  {
    url: 'endpoint-eight/:userId',
    responseFn: (req) => ({
      data: 'endpoint-eight-' + req.params.userId,
    }),
  },
  {
    url: 'endpoint-nine',
    response: {
      data: 'endpoint-nine',
    },
  },
  {
    url: 'endpoint-ten?start=0&limit=10',
    response: {
      data: 'endpoint-ten',
    },
  },
];
