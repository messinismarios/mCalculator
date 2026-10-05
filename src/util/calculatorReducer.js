import { calculate, CalculationError } from './mCalculate.js';

/**
 * Calculator state. The expression is kept as a list of tokens
 * (e.g. ['12', '*', '(', '3', '+', '4', ')']) so editing works on whole numbers/operators.
 */
export const initialState = {
    tokens: [],
    history: '',
    error: null,
    showingResult: false,
};

const OPERATORS = ['+', '-', '*', '/'];
const DISPLAY_SYMBOLS = { '*': '×', '/': '÷', '-': '−' };

const isNumber = (token) => /[\d.]/.test(token ?? '');
const isOperator = (token) => OPERATORS.includes(token);
const endsOperand = (token) => isNumber(token) || token === ')';
const countOf = (tokens, value) => tokens.filter((token) => token === value).length;

/** A "-" at the start, after "(" or after another operator is a negative sign, not a subtraction. */
const isNegativeSign = (tokens, index) =>
    tokens[index] === '-' && (index === 0 || tokens[index - 1] === '(' || isOperator(tokens[index - 1]));

function appendDigit(tokens, digit) {
    const last = tokens.at(-1);

    if (isNumber(last)) {
        tokens[tokens.length - 1] = last === '0' ? digit : last + digit;
    } else {
        if (last === ')') {
            tokens.push('*');
        }
        tokens.push(digit);
    }
}

function appendDecimalPoint(tokens) {
    const last = tokens.at(-1);

    if (isNumber(last)) {
        if (!/[.e]/i.test(last)) {
            tokens[tokens.length - 1] = last + '.';
        }
    } else {
        if (last === ')') {
            tokens.push('*');
        }
        tokens.push('0.');
    }
}

function appendOpenParenthesis(tokens) {
    if (endsOperand(tokens.at(-1))) {
        tokens.push('*');
    }
    tokens.push('(');
}

function appendCloseParenthesis(tokens) {
    if (endsOperand(tokens.at(-1)) && countOf(tokens, '(') > countOf(tokens, ')')) {
        tokens.push(')');
    }
}

function appendOperator(tokens, operator) {
    const last = tokens.at(-1);

    if (endsOperand(last)) {
        tokens.push(operator);
    } else if (operator === '-') {
        // Allow a negative sign after "(", "*" or "/"; "+ -" collapses to "-".
        if (last === '+') {
            tokens[tokens.length - 1] = '-';
        } else if (last !== '-') {
            tokens.push('-');
        }
    } else if (isOperator(last)) {
        // Pressing another operator replaces the previous one(s), e.g. "2 * -" then "+" gives "2 +".
        while (isOperator(tokens.at(-1))) {
            tokens.pop();
        }
        if (endsOperand(tokens.at(-1))) {
            tokens.push(operator);
        }
    }
}

function input(state, value) {
    // After a result, operators continue from it; anything else starts a new calculation.
    const tokens = state.showingResult && !isOperator(value) ? [] : [...state.tokens];

    if (/^\d$/.test(value)) {
        appendDigit(tokens, value);
    } else if (value === '.') {
        appendDecimalPoint(tokens);
    } else if (value === '(') {
        appendOpenParenthesis(tokens);
    } else if (value === ')') {
        appendCloseParenthesis(tokens);
    } else if (isOperator(value)) {
        appendOperator(tokens, value);
    }

    return { ...state, tokens, error: null, showingResult: false };
}

function backspace(state) {
    if (state.showingResult) {
        return { ...state, tokens: [], error: null, showingResult: false };
    }

    const tokens = [...state.tokens];
    const last = tokens.pop();

    if (isNumber(last) && last.length > 1) {
        tokens.push(last.slice(0, -1));
    }

    return { ...state, tokens, error: null };
}

function evaluate(state) {
    if (state.tokens.length === 0 || state.showingResult) {
        return state;
    }

    try {
        const result = calculate(state.tokens.join(' '));

        return {
            tokens: [String(result)],
            history: `${formatExpression(state.tokens)} =`,
            error: null,
            showingResult: true,
        };
    } catch (error) {
        if (error instanceof CalculationError) {
            return { ...state, error: error.message };
        }
        throw error;
    }
}

export function calculatorReducer(state, action) {
    switch (action.type) {
        case 'input':
            return input(state, action.value);
        case 'backspace':
            return backspace(state);
        case 'clear':
            return initialState;
        case 'evaluate':
            return evaluate(state);
        default:
            throw new Error(`Unknown action "${action.type}"`);
    }
}

/** Formats tokens for display, e.g. ['2', '*', '(', '-', '3', ')'] -> "2 × (−3)". */
export function formatExpression(tokens) {
    if (tokens.length === 0) {
        return '0';
    }

    return tokens
        .map((token, index) => {
            const symbol = DISPLAY_SYMBOLS[token] ?? token.replace(/^-/, '−');
            const attachToPrevious = index === 0 || tokens[index - 1] === '(' || token === ')' || isNegativeSign(tokens, index - 1);

            return attachToPrevious ? symbol : ` ${symbol}`;
        })
        .join('');
}
