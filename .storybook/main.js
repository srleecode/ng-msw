module.exports = {
  stories: ['../libs/**/*.stories.mdx', '../libs/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  features: {
    interactionsDebugger: true,
  },
  core: { builder: 'webpack5' },
};
