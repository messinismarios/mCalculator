import { useEffect, useReducer } from 'react';

import Buttons from './components/Buttons';
import Screen from './components/Screen';
import { calculatorReducer, formatExpression, initialState } from './util/calculatorReducer.js';

const COMMANDS = {
    clear: { type: 'clear' },
    backspace: { type: 'backspace' },
    evaluate: { type: 'evaluate' },
};

const KEY_BINDINGS = {
    'Enter': 'evaluate',
    '=': 'evaluate',
    'Backspace': 'backspace',
    'Escape': 'clear',
    'Delete': 'clear',
    'x': '*',
    ',': '.',
};

const INPUT_KEYS = /^[\d.()+\-*/]$/;

const toAction = (value) => COMMANDS[value] ?? { type: 'input', value };

function App() {
    const [state, dispatch] = useReducer(calculatorReducer, initialState);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey || event.metaKey || event.altKey) {
                return;
            }

            const value = KEY_BINDINGS[event.key] ?? (INPUT_KEYS.test(event.key) ? event.key : null);

            if (value) {
                // Also stops Enter from clicking a focused button and "/" from opening quick find.
                event.preventDefault();
                dispatch(toAction(value));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <main className="calculator">
            <Screen expression={formatExpression(state.tokens)} history={state.history} error={state.error} />
            <Buttons onPress={(value) => dispatch(toAction(value))} />
        </main>
    );
}

export default App;
