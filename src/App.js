import React, { Component } from 'react';

import Screen from "./components/Screen";
import Buttons from "./components/Buttons";
import mCalculate from "./util/mCalculate.js";

class App extends Component {

    constructor(){

        super();
        this.state = {
            error: false,
            result: false,
            screen: "",
            story: ""
        }

    }

    displayCalc(string) {

        if (string === '') {

            return "0";

        }

        return string.replace("( ", "(").replace(" )", ")");

    }

    isOperator(char) {

        const operators = ["(", ")", "-", "+", "/", "*"];

        if (operators.includes(char)) {

            return true;

        }

        return false;

    }

    onClick = button => {

        if (button === "=") {

            this.calculate()

        }

        else if (button === "C") {

            this.reset()

        }

        else if (button === "B") {

            this.backspace()

        }

        else {

            if (this.isOperator(button)) {

                if (this.state.screen.length === 0) {

                    this.setState({
                        result: false,
                        screen: this.state.screen + button.toString()
                    });

                } else {

                    this.setState({
                        result: false,
                        screen: this.state.screen + " " + button.toString()
                    });

                }

            } else {

                if (this.isOperator(this.state.screen[this.state.screen.length - 1])) {

                    this.setState({
                        result: false,
                        screen: this.state.screen + " " + button.toString()
                    });

                } else {

                    if (this.state.result) {

                        this.setState({
                            result: false,
                            screen: button.toString()
                        });

                    } else {

                        this.setState({
                            result: false,
                            screen: this.state.screen + button.toString()
                        });

                    }

                }

            }

        }

    };

    calculate = () => {

        try {

            let string = mCalculate.util.calc(this.state.screen);

            if (isNaN(string)) {

                throw new Error();

            } else {

                this.setState({
                    result: true,
                    screen: string.toString(),
                    story: this.state.screen
                });

            }

        } catch (e) {

            this.setState({
                error: true,
                result: true,
                screen: ""
            });

        }

    };

    reset = () => {

        this.setState({
            result: false,
            story: "",
            screen: ""
        });

    };

    backspace = () => {

        if (this.state.screen[this.state.screen.length - 1] === ' ') {

            this.setState({
                result: false,
                screen: this.state.screen.slice(0, -3)
            });

        } else if (this.isOperator(this.state.screen[this.state.screen.length - 1])) {

            this.setState({
                result: false,
                screen: this.state.screen.slice(0, -2)
            });

        } else {

            this.setState({
                result: false,
                screen: this.state.screen.slice(0, -1)
            });

        }

    };

    render() {

        let value = this.displayCalc(this.state.screen);
        let story = this.state.story;
        let classname = "screen";

        if (this.state.error) {

            classname = "screen error";

        }

        return (
            <div className="calculator">
                <Screen screen={value} story={story} classname={classname}/>
                <Buttons onClick={this.onClick}/>
            </div>
        );

    }

}

export default App;
