function add(a, b) {
    let result = Math.trunc(a + b);
    while (("" + result).length > 7) {
        result /= 10;
        result = Math.trunc(result);
    }
    console.log("Result of " + a + " + " + b + ": " + result);
    return "0".repeat(7 - ("" + result).length) + result;
}
function subtract(a, b) {
    let result = Math.abs(Math.trunc(a - b));
    while (("" + result).length > 7) {
        result /= 10;
        result = Math.trunc(result);
    }
    console.log("Result of |" + a + " - " + b + "|: " + result);
    return "0".repeat(7 - ("" + result).length) + result;
}
function multiply(a, b) {
    let result = Math.trunc(a * b);
    while (("" + result).length > 7) {
        result /= 10;
        result = Math.trunc(result);
    }
    console.log("Result of " + a + " * " + b + ": " + result);
    return "0".repeat(7 - ("" + result).length) + result;
}
function divide(a, b) {
    let result = Math.trunc(a / b);
    console.log("Result of " + a + " / " + b + ": " + result);
    return "0".repeat(7 - ("" + result).length) + result;
}
function divideByZero() {
    let entireCalc = document.querySelector("body");
    let div = document.createElement("img");
    let div2 = document.createElement("h1");
    div.src = "explosion.avif";
    div.height = "333.5";
    div2.textContent = "idot";
    entireCalc.replaceChildren();
    entireCalc.appendChild(div);
    entireCalc.appendChild(div2);
}
function expire() {
    let entireCalc = document.querySelector("body");
    let div = document.createElement("h1");
    div.textContent = "Trial Expired";
    entireCalc.replaceChildren();
    entireCalc.appendChild(div);
}
function throwError(text){
    alert("Error: " + text);
}
function operate(o1, o, o2) {
    let sqrt = false; let sqrt2 = false;
    let e = false; let e2 = false;
    let pi = false; let pi2 = false;
    for (let i = 0; i < o1.length; i++){
        if (o1[i] === "√2") {
            if (i != 0) {
                throwError("You can only put the square root operator at the very beginning of a number.");
                return "0000000";
            }
            sqrt = true;
            o1[i] = "2";
        }
        if (o2[i] === "√2") {
            if (i != 0) {
                throwError("You can only put the square root operator at the very beginning of a number.");
                return "0000000";
            }
            sqrt2 = true;
            o2[i] = "2";
        }
        if (o1[i] === "e" || o1[i] === "π") {
            if (i != o1.length - 1){
                throwError("You can only put mathematical symbols at the very end of a number.");
                return "0000000";
            }
            if (o1[i] === "e") e = true; 
            if (o1[i] === "π") pi = true;
        }
        if (o2[i] === "e" || o2[i] === "π") {
            if (i != o1.length - 1) {
                throwError("You can only put mathematical symbols at the very end of a number.");
                return "0000000";
            }
            if (o2[i] === "e") e2 = true;
            if (o2[i] === "π") pi2 = true;
        }
    }
    if (e) o1.splice(o1.length - 1, 1);
    if (e2) o2.splice(o1.length - 1, 1);
    if (pi) o1.splice(o1.length - 1, 1);
    if (pi2) o2.splice(o1.length - 1, 1);
    if (o1.length < 7) o1.unshift("0");
    if (o2.length < 7) o2.unshift("0");
    console.log(o1 + " " + o2);
    o1 = Number(o1.join(""));
    o2 = Number(o2.join(""));
    if (sqrt) o1 = Math.sqrt(o1); 
    if (sqrt2) o2 = Math.sqrt(o2);
    if (e) o1 *= Math.E;
    if (e2) o2 *= Math.E;
    if (pi) o1 *= Math.PI;
    if (pi2) o2 *= Math.PI;
    switch (o) {
        case " : ":
            if (o2 == 0) return divideByZero();
            return divide(o1, o2);
            break;
        case " + ":
            return add(o1, o2);
            break;
        case " - ":
            return subtract(o1, o2);
            break;
        case " x ":
            return multiply(o1, o2);
            break;
        case " /0 ":
            return divideByZero();
    }
}
let operand1 = ["0", "0", "0", "0", "0", "0", "0"];
let operator = " : ";
let operand2 = ["0", "0", "0", "0", "0", "0", "0"];
let numberPointer = 0;
let display = document.querySelector(".numbers");
let trial = 0;
function operandNumber(text){
    if (numberPointer < 7) {
        operand1[numberPointer] = text;
    } else {
        operand2[numberPointer - 7] = text;
    }
    numberPointer++;
    if (numberPointer == 14) numberPointer = 0;
    display.textContent = operand1.join("") + operator + operand2.join("");
}
function changeOperator(text){
    if (text === "=") {
        trial++;
        if (trial == 10) {
            expire();
        } else {
            operand2 = operate(operand1, operator, operand2).split("");
            display.textContent = operand1.join("") + operator + operand2.join("");
        }
        return;
    }
    operator = " " + text + " ";
    display.textContent = operand1.join("") + operator + operand2.join("");
}
const buttons = document.querySelectorAll(".set button");
buttons.forEach(button => {
    button.addEventListener("click", () => {
        operandNumber(button.textContent);
    })
});
const operations = document.querySelectorAll(".operations button");
operations.forEach(button => {
    button.addEventListener("click", () => {
        changeOperator(button.textContent);
    })
})


