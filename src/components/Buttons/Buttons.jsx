const BUTTON_ROWS = [
    [
        { value: '(', label: '(', ariaLabel: 'Open parenthesis', variant: 'secondary' },
        { value: ')', label: ')', ariaLabel: 'Close parenthesis', variant: 'secondary' },
        { value: 'clear', label: 'C', ariaLabel: 'Clear', variant: 'secondary' },
        { value: 'backspace', label: '←', ariaLabel: 'Backspace', variant: 'secondary' },
    ],
    [
        { value: '7', label: '7' },
        { value: '8', label: '8' },
        { value: '9', label: '9' },
        { value: '/', label: '÷', ariaLabel: 'Divide', variant: 'secondary' },
    ],
    [
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
        { value: '*', label: '×', ariaLabel: 'Multiply', variant: 'secondary' },
    ],
    [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '+', label: '+', ariaLabel: 'Plus', variant: 'secondary' },
    ],
    [
        { value: '.', label: '.', ariaLabel: 'Decimal point', variant: 'secondary' },
        { value: '0', label: '0' },
        { value: '-', label: '−', ariaLabel: 'Minus', variant: 'secondary' },
        { value: 'evaluate', label: '=', ariaLabel: 'Equals', variant: 'accent' },
    ],
];

function Buttons({ onPress }) {
    return (
        <div className="buttons">
            {BUTTON_ROWS.flat().map(({ value, label, ariaLabel, variant }) => (
                <button
                    key={value}
                    type="button"
                    className={variant ? `button button--${variant}` : 'button'}
                    aria-label={ariaLabel}
                    onClick={() => onPress(value)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

export default Buttons;
