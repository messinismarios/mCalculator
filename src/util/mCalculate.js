/**
 * mCalculate: evaluates basic arithmetic expressions (+ - * / and parentheses).
 *
 * The algorithm mirrors how the expression would be solved by hand:
 *   1. Split the input into tokens and validate its structure.
 *   2. Repeatedly solve the innermost pair of parentheses, replacing it with its value.
 *   3. Solve the remaining flat expression: * and / first, then + and -, left to right.
 */

const SIGNIFICANT_DIGITS = 12;

const NUMBER_PATTERN = /^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i;
const OPERATORS = new Set(['+', '-', '*', '/']);
const OPERATOR_ALIASES = { 'x': '*', '×': '*', '÷': '/', '−': '-' };

export class CalculationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CalculationError';
    }
}

const isOperand = (token) => token.type === 'number' || token.type === '(';

/**
 * Converts the input string into tokens. Whitespace is optional.
 * A minus sign in operand position (start, after an operator or "(") is unary:
 * it is folded into the following number, or marks the following group as negated.
 */
function tokenize(expression) {
    const tokens = [];
    let negate = false;
    let i = 0;

    while (i < expression.length) {
        const char = OPERATOR_ALIASES[expression[i]] ?? expression[i];

        if (/\s/.test(char)) {
            i++;
            continue;
        }

        const previous = tokens[tokens.length - 1];
        const expectingOperand = !previous || previous.type === 'operator' || previous.type === '(';

        if (char === '-' && expectingOperand) {
            if (negate) {
                throw new CalculationError('Unexpected "-"');
            }
            negate = true;
            i++;
            continue;
        }

        const number = expression.slice(i).match(NUMBER_PATTERN);

        if (number) {
            const value = Number(number[0]);
            tokens.push({ type: 'number', value: negate ? -value : value });
            negate = false;
            i += number[0].length;
        } else if (char === '(') {
            tokens.push({ type: '(', negate });
            negate = false;
            i++;
        } else if (char === ')') {
            tokens.push({ type: ')' });
            i++;
        } else if (OPERATORS.has(char)) {
            tokens.push({ type: 'operator', value: char });
            i++;
        } else {
            throw new CalculationError(`Unexpected character "${expression[i]}"`);
        }

        if (negate) {
            throw new CalculationError('Unexpected "-"');
        }
    }

    if (negate) {
        throw new CalculationError('Expression is incomplete');
    }

    return tokens;
}

/**
 * Ensures operands and operators alternate and parentheses are balanced,
 * so the solving steps can assume a well-formed expression.
 */
function validate(tokens) {
    let depth = 0;
    let expectingOperand = true;

    if (tokens.length === 0) {
        throw new CalculationError('Expression is empty');
    }

    for (const token of tokens) {
        if (expectingOperand !== isOperand(token)) {
            throw new CalculationError(expectingOperand ? 'Missing number' : 'Missing operator');
        }

        if (token.type === '(') {
            depth++;
        } else if (token.type === ')') {
            depth--;
            if (depth < 0) {
                throw new CalculationError('Unmatched ")"');
            }
        }

        // An operand (number or ")") must be followed by an operator or ")".
        expectingOperand = token.type === 'operator' || token.type === '(';
    }

    if (expectingOperand) {
        throw new CalculationError('Expression is incomplete');
    }

    if (depth > 0) {
        throw new CalculationError('Unmatched "("');
    }
}

function applyOperator(left, operator, right) {
    switch (operator) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/':
            if (right === 0) {
                throw new CalculationError('Cannot divide by zero');
            }
            return left / right;
        default:
            throw new CalculationError(`Unknown operator "${operator}"`);
    }
}

/**
 * Solves one precedence level of a flat (parentheses-free) expression in place,
 * left to right. E.g. with ['*', '/']: [2, +, 3, *, 4, /, 2] -> [2, +, 6].
 */
function reduceOperators(items, operators) {
    let i = 1;

    while (i < items.length) {
        if (operators.includes(items[i])) {
            items.splice(i - 1, 3, applyOperator(items[i - 1], items[i], items[i + 1]));
        } else {
            i += 2;
        }
    }
}

/** Solves a flat expression of alternating numbers and operator strings. */
function solveFlat(items) {
    reduceOperators(items, ['*', '/']);
    reduceOperators(items, ['+', '-']);
    return items[0];
}

/**
 * Calculates the result of an arithmetic expression.
 *
 * @param {string} expression e.g. "3 * (12 + 22)" or "-2.5/(1-3)"
 * @returns {number} the result, rounded to 12 significant digits to hide floating point noise
 * @throws {CalculationError} if the expression is malformed or divides by zero
 */
export function calculate(expression) {
    const tokens = tokenize(expression);
    validate(tokens);

    // Solve the innermost parentheses first, replacing each group with its value.
    let open;
    while ((open = tokens.findLastIndex((token) => token.type === '(')) !== -1) {
        const close = tokens.findIndex((token, index) => index > open && token.type === ')');
        const group = tokens.slice(open + 1, close).map((token) => token.value);
        const value = solveFlat(group);

        tokens.splice(open, close - open + 1, { type: 'number', value: tokens[open].negate ? -value : value });
    }

    const result = solveFlat(tokens.map((token) => token.value));

    if (!Number.isFinite(result)) {
        throw new CalculationError('Result is out of range');
    }

    // Normalize -0 to 0 and round away errors like 0.1 + 0.2 = 0.30000000000000004.
    return Number(result.toPrecision(SIGNIFICANT_DIGITS)) || 0;
}
