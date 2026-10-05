## :warning: WARNING!

The below is a weekend project and is **NOT meant for production use**.

# Introduction

This project consists of two things, a Javascript Calculation utility **[mCalculate]** and a Calculator built in React **[mCalculator]** (to serve as the UI of the calculation utility).

You can access and use the latest mCalculator release from [mc.messinismarios.com](https://mc.messinismarios.com)

### [mCalculate]

Using the mCalculate utility is straightforward. You only need to import the module,

    import { calculate, CalculationError } from "./util/mCalculate.js";

and then call it:

    let result = calculate(calculation);

The input is a string, and spaces are optional. For example:

* `calculate("2 + 2")` returns `4`,
* `calculate("3*(12+22)")` returns `102`,
* `calculate("-2.5 / (1 - 3)")` returns `1.25`.

If the input is invalid (e.g. `"5 / 0"` or `"(2 + 3"`), mCalculate throws a `CalculationError` describing the problem.

### [mCalculator]

The mCalculator includes all operations a simple calculator would have, including addition "+", subtraction "-", multiplication "x", and division "÷". Users also have the ability to use parentheses "(", ")", and decimals ".".

As with any other calculator, the "=" button will perform the calculation (!), and the "C" button will Clear everything on the screen (Result, History, and Errors). Lastly, the "←" button acts as a backspace when typing a number/operator.

You can run mCalculator using `npm install` and `npm run dev` after cloning the repository (requires Node.js 20.19+ or 22.12+), or create a production build in `dist/` with `npm run build`.

## Tasks

- [x] Calculation Utility
- [x] React UI
- [ ] Documentation
- [x] QOL Improvements[^1]
- [ ] Additional Operations (%, sin/cos, etc.)
- [ ] Test & Improve Performance
- [ ] Automated Validation Tests
- [ ] (?) Result Text Size Based on Width of Calculation

## Closing

This project serves as a presentation of how I decided to tackle a math calculation algorithm. Even though there were a lot of algorithms out there on calculations, I did not find any of them useful and I decided to simulate how my mind tackles a given math operation. It was a very fun project, and I would highly suggest you partake in a similar one if given the opportunity and time. That being said, I would again advise not using mCalculate on a production scope **for now**.

If you find an issue on either utility and wish to submit it, feel free to do so by opening an [issue](https://github.com/messinismarios/mCalculator/issues). Thank you for taking the time!

[^1]: a) Inputting a parenthesis should remove the previous result if any. b) Inputting an operator after another should change the initial operator instead of adding a second one c) Keyboard support
