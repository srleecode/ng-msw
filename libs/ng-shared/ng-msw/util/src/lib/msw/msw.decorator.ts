import type { DecoratorFunction, StoryContext } from '@storybook/addons';
import { HttpMock } from '../models/http-mock.model';
import { MswRequestHandler } from '../models/msw-request-handler.type';
import { addHandlers, resetHandlers } from './msw';

type DecoratorParameters = {
  msw?: (HttpMock | MswRequestHandler)[];
};

interface DecoratorContext extends StoryContext {
  parameters: StoryContext['parameters'] & DecoratorParameters;
}

export const mswDecorator: DecoratorFunction = (storyFn, context: DecoratorContext) => {
  const {
    parameters: { msw },
  } = context;

  resetHandlers();
  addHandlers(...msw);

  return storyFn();
};
