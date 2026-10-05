import { useEffect, useRef } from 'react';

function Screen({ expression, history, error }) {
    const valueRef = useRef(null);

    // Keep the end of long expressions in view as they grow.
    useEffect(() => {
        valueRef.current.scrollLeft = valueRef.current.scrollWidth;
    }, [expression]);

    return (
        <div className={error ? 'screen screen--error' : 'screen'}>
            <div className="screen__error" role="alert">{error}</div>
            <div className="screen__history">{history}</div>
            <output className="screen__value" ref={valueRef} aria-live="polite">{expression}</output>
        </div>
    );
}

export default Screen;
