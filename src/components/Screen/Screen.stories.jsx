import Screen from './Screen.jsx';

export default {
    title: 'Calculator/Screen',
    component: Screen,
    decorators: [(Story) => <div className="calculator"><Story /></div>],
};

export const Empty = {
    args: { expression: '0', history: '', error: null },
};

export const WithHistory = {
    args: { expression: '102', history: '3 × (12 + 22) =', error: null },
};

export const WithError = {
    args: { expression: '5 ÷ 0', history: '', error: 'Cannot divide by zero' },
};
