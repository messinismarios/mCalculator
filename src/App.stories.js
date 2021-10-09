// src/components/Button.stories.js
import React from 'react';

import './index.scss';
import App from './App';

export default {
  title: 'Calculator/App',
  component: App,
};

const Template = (args) => <App {...args} />;

export const Calculator = Template.bind({});
Calculator.args = {
  label: 'App',
};
