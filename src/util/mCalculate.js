export default class mCalculate {

    static util = mCalculate.instance || new mCalculate()

    iLoveJavascript(number) {

        const decimalPlaces = 2;
        return number.toFixed(decimalPlaces) / 1;

    }

    calculateBlock(block) {

        let charArray = block.split(" ");
        let done, safeCount, minIndex, mulIndex, divIndex, divProce, pluProce;
        const safeCountMax = 1000;

        if (charArray.length === 1) {

            return block;

        }

        done = false;
        safeCount = 0;
        while (!done) {

            if (safeCount++ && safeCount > safeCountMax) {

                throw new Error();

            }

            let mulIndex = charArray.indexOf("*");
            let divIndex = charArray.indexOf("/");

            if (mulIndex >= 0 || divIndex >= 0) {

                if (mulIndex >= 0) {

                    if (divIndex >= 0 && divIndex < mulIndex) {

                        minIndex = divIndex;
                        divProce = true;

                    } else {

                        minIndex = mulIndex;
                        divProce = false;

                    }

                } else {

                    minIndex = divIndex;
                    divProce = true;

                }

                if (divProce) {

                    if (charArray[minIndex + 1] === "0") {

                        throw new Error();

                    }

                    charArray.splice(minIndex - 1, 3, parseFloat(charArray[minIndex - 1]) / parseFloat(charArray[minIndex + 1]));

                } else {

                    charArray.splice(minIndex - 1, 3, parseFloat(charArray[minIndex - 1]) * parseFloat(charArray[minIndex + 1]));

                }

            } else {

                done = true;

            }

        }

        done = false;
        safeCount = 0;
        while (!done) {

            if (safeCount++ && safeCount > safeCountMax) {

                throw new Error();

            }

            let minIndex = charArray.indexOf("-");
            let pluIndex = charArray.indexOf("+");

            if (minIndex >= 0 || pluIndex >= 0) {

                if (minIndex >= 0) {

                    if (pluIndex >= 0 && pluIndex < minIndex) {

                        minIndex = pluIndex;
                        pluProce = true;

                    } else {

                        minIndex = minIndex;
                        pluProce = false;

                    }

                } else {

                    minIndex = pluIndex;
                    pluProce = true;

                }

                if (pluProce) {

                    charArray.splice(minIndex - 1, 3, parseFloat(charArray[minIndex - 1]) + parseFloat(charArray[minIndex + 1]));

                } else {

                    charArray.splice(minIndex - 1, 3, parseFloat(charArray[minIndex - 1]) - parseFloat(charArray[minIndex + 1]));

                }


            } else {

                done = true;

            }

        }

        return this.iLoveJavascript(charArray[0]);

    }

    calc(string) {

        let charArray = string.split(" ");
        let done, safeCount, minIndex, maxIndex, newBlock;
        const safeCountMax = 1000;

        if (charArray.length === 1) {

            return string;

        }

        done = false;
        safeCount = 0;
        while (!done) {

            if (safeCount++ && safeCount > safeCountMax) {

                throw new Error();

            }

            let minIndex = charArray.indexOf("(");
            if (minIndex >= 0) {

                if ((minIndex === charArray.length - 1) || (charArray.indexOf(")") < minIndex)) {

                    throw new Error();

                }

                minIndex++;

                for (var i = minIndex + 1; i < charArray.length; i++) {

                    maxIndex = i;

                    if (charArray[i] === '(') {

                        minIndex = i;

                    }

                    if (charArray[i] === ')') {

                        break;

                    }

                }

                newBlock = charArray.slice(minIndex, maxIndex).join(" ");
                charArray.splice(minIndex - 1, (maxIndex - minIndex) + 2, this.calculateBlock(newBlock));

            } else {

                done = true;

            }

        }

        return this.calculateBlock(charArray.join(" "));

    }

}
