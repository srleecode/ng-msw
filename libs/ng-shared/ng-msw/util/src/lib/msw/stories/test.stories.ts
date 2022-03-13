import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { GLOBAL_MOUNT_OPTIONS } from '@cypress/component-testing';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { MOCKS } from '@srleecode/ng-shared/ng-msw/domain/testing';
import { TestComponent, TestModule } from './test.component';
import { HttpClientModule } from '@angular/common/http';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export default {
  component: TestComponent,
  title: 'NgShared/MswMocks/Util',
  decorators: [
    moduleMetadata({
      imports: [TestModule, HttpClientModule, ...GLOBAL_MOUNT_OPTIONS.imports],
    }),
  ],
  parameters: {
    msw: MOCKS,
  },
} as Meta;

const Template: Story<TestComponent> = (args) => ({
  props: args,
});

const Default = Template.bind({});

export const SingleEndPoint = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    userEvent.click(canvas.getByLabelText(/Endpoint one button/i));
    const items = await canvas.findAllByRole('listitem');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toBe('endpoint-one');
  },
};

export const MswConfig = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    userEvent.click(canvas.getByLabelText(/Endpoint two button/i));
    const items = await canvas.findAllByRole('listitem');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toBe('endpoint-two');
  },
};

export const MethodType = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    userEvent.click(canvas.getByLabelText(/Endpoint three button/i));
    const items = await canvas.findAllByRole('listitem');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toBe('endpoint-three');
  },
};

export const SameUrlDifferentMethods = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    userEvent.click(canvas.getByLabelText(/Endpoint four button/i));
    const items = await canvas.findAllByRole('listitem');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toBe('endpoint-four');
    expect(items[1].textContent).toBe('endpoint-four');
  },
};

export const Status = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    userEvent.click(canvas.getByLabelText(/Endpoint five button/i));
    const items = await canvas.findAllByRole('listitem');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toBe('caught error');
  },
};

export const RespondingOnlyOnce = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    userEvent.click(canvas.getByLabelText(/Endpoint six button/i));
    await canvas.findByText('response 1');
    await canvas.findByText('response 2');
  },
};

export const Delay = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    userEvent.click(canvas.getByLabelText(/Endpoint seven button/i));
    expect(await canvas.queryByText('endpoint-seven')).toBeNull();
    await canvas.findByText('endpoint-seven', undefined, { timeout: 1000 });
  },
};

export const ResponseFromFunction = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    userEvent.click(canvas.getByLabelText(/Endpoint eight button/i));
    const items = await canvas.findAllByRole('listitem');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toBe('endpoint-eight-test');
  },
};
