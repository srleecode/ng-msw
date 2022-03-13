import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ShellComponent, NgSharedComponentsHeaderShellModule } from './shell.component';
import { GLOBAL_MOUNT_OPTIONS } from '@cypress/component-testing';

import { THEME_MOCKS } from '@srleecode/ng-shared/components/header/domain/testing';

export default {
  component: ShellComponent,
  title: 'NgShared/Components/Header/Shell',
  decorators: [
    moduleMetadata({
      imports: [NgSharedComponentsHeaderShellModule, ...GLOBAL_MOUNT_OPTIONS.imports],
    }),
  ],
} as Meta;

const Template: Story<ShellComponent> = (args) => ({
  props: args,
});

export const Default = Template.bind({});
