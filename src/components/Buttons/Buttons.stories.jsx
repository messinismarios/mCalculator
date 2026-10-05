import { fn } from 'storybook/test';

import Buttons from './Buttons.jsx';

export default {
    title: 'Calculator/Buttons',
    component: Buttons,
    args: { onPress: fn() },
    decorators: [(Story) => <div className="calculator"><Story /></div>],
};

export const Default = {};
