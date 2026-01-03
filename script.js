class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.readyForNewInput = false;
    }

    delete() {
        if (this.currentOperand === 'Error') {
            this.clear();
            return;
        }
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (this.readyForNewInput) {
            this.currentOperand = '';
            this.readyForNewInput = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (number === 'pi') number = Math.PI;
        if (number === 'e') number = Math.E;

        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    computeScientific(func) {
        let current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        let result;
        switch (func) {
            case 'sin':
                result = Math.sin(current);
                break;
            case 'cos':
                result = Math.cos(current);
                break;
            case 'tan':
                result = Math.tan(current);
                break;
            case 'sqrt':
                if (current < 0) {
                    this.currentOperand = 'Error';
                    return;
                }
                result = Math.sqrt(current);
                break;
            case 'cbrt':
                result = Math.cbrt(current);
                break;
            case 'log':
                result = Math.log10(current);
                break;
            case 'ln':
                result = Math.log(current);
                break;
            case 'abs':
                result = Math.abs(current);
                break;
            case 'inv':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    return;
                }
                result = 1 / current;
                break;
            case 'exp':
                result = Math.exp(current);
                break;
            case '!':
                result = this.factorial(current);
                break;
            default:
                return;
        }
        this.currentOperand = result;
        this.operation = undefined;
        this.previousOperand = '';
        this.readyForNewInput = true;
    }

    factorial(n) {
        if (n < 0) return "Error";
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++)
            result = result * i;
        return result;
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = "Error"; // Updated error handling
                    this.operation = undefined;
                    this.previousOperand = '';
                    this.readyForNewInput = true;
                    return;
                }
                computation = prev / current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.readyForNewInput = true; // After equals, next number starts new
    }

    getDisplayNumber(number) {
        if (number === 'Error') return number;
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText =
            this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const scientificButtons = document.querySelectorAll('[data-science]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const scientificToggle = document.getElementById('scientific-toggle');
const scientificPanel = document.getElementById('scientific-panel');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Toggle Scientific Panel
scientificToggle.addEventListener('click', () => {
    scientificPanel.classList.toggle('hidden');
    scientificToggle.classList.toggle('active');
});

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

scientificButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.science;
        if (action === '^') {
            calculator.chooseOperation('^');
        } else if (action === 'pi') {
            calculator.appendNumber(Math.PI);
        } else if (action === 'e') {
            calculator.appendNumber(Math.E);
        } else {
            calculator.computeScientific(action);
        }
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
});

// Root Simplifier Logic
const simplifyBtn = document.getElementById('simplify-btn');
const rootInput = document.getElementById('root-input');
const rootResult = document.getElementById('root-result');

function simplifyRoot(n) {
    if (n < 0) return "Undefined";
    if (n === 0) return "0";

    let inside = n;
    let outside = 1;
    let d = 2;

    while (d * d <= inside) {
        if (inside % (d * d) === 0) {
            inside = inside / (d * d);
            outside = outside * d;
        } else {
            d++;
        }
    }

    if (inside === 1) return `${outside}`;
    if (outside === 1) return `√${inside}`;
    return `${outside}√${inside}`;
}

simplifyBtn.addEventListener('click', () => {
    const val = parseInt(rootInput.value);
    if (isNaN(val)) {
        rootResult.innerText = "Invalid Input";
    } else if (val < 0) {
        rootResult.innerText = "Must be ≥ 0";
    } else {
        rootResult.innerText = simplifyRoot(val);
    }
});

// Prevent typing negative numbers
rootInput.addEventListener('input', () => {
    if (rootInput.value < 0) {
        rootInput.value = Math.abs(rootInput.value);
    }
});

document.addEventListener('keydown', function (event) {
    // START: Fix for keyboard typing in input fields
    if (document.activeElement.tagName === "INPUT") return;
    // END: Fix for keyboard typing in input fields

    let patternForNumbers = /[0-9]/g;
    let patternForOperators = /[+\-*\/]/g;
    if (event.key.match(patternForNumbers)) {
        event.preventDefault();
        calculator.appendNumber(event.key);
        calculator.updateDisplay();
    }
    if (event.key === '.') {
        event.preventDefault();
        calculator.appendNumber(event.key);
        calculator.updateDisplay();
    }
    if (event.key.match(patternForOperators) || event.key === "Enter" || event.key === "^") {
        event.preventDefault();
        if (event.key === "Enter") {
            calculator.compute();
            calculator.updateDisplay();
        } else {
            let op = event.key;
            if (op === '/') op = '÷';
            calculator.chooseOperation(op);
            calculator.updateDisplay();
        }
    }
    if (event.key === "Backspace") {
        event.preventDefault();
        calculator.delete();
        calculator.updateDisplay();
    }
    if (event.key === "Escape") {
        event.preventDefault();
        calculator.clear();
        calculator.updateDisplay();
    }
});

// Linear Equation Solver Logic
const solveBtn = document.getElementById('solve-btn');
const equationInput = document.getElementById('equation-input');
const solverResult = document.getElementById('solver-result');
const solverSteps = document.getElementById('solver-steps');
const solverResultsContainer = document.getElementById('solver-results-container');

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function toFraction(numerator, denominator) {
    if (denominator === 0) return "Undefined";
    if (numerator === 0) return "0";

    // Handle signs
    let sign = Math.sign(numerator) * Math.sign(denominator);
    let num = Math.abs(numerator);
    let den = Math.abs(denominator);

    let common = gcd(num, den);
    num = num / common;
    den = den / common;

    if (den === 1) return (sign * num).toString();
    return `${sign === -1 ? '-' : ''}${num}/${den}`;
}

function parseEquation(eq) {
    // Remove spaces
    eq = eq.replace(/\s+/g, '');

    let operator = null;
    if (eq.includes('<=')) operator = '<=';
    else if (eq.includes('>=')) operator = '>=';
    else if (eq.includes('<')) operator = '<';
    else if (eq.includes('>')) operator = '>';
    else if (eq.includes('=')) operator = '=';

    if (!operator) return null;

    let parts = eq.split(operator);
    if (parts.length !== 2) return null;
    return { lhs: parts[0], rhs: parts[1], op: operator };
}

function parseExpression(expr) {
    // Returns { x: coefficient, c: constant }
    // Add + before - to handle splitting easier, but careful with start
    let formatted = expr.replace(/-/g, '+-');
    if (formatted.startsWith('+-')) formatted = formatted.substring(1); // if starts with negative

    let terms = formatted.split('+').filter(t => t.length > 0);
    let x_coeff = 0;
    let constant = 0;

    terms.forEach(term => {
        if (term.includes('x')) {
            let coeffStr = term.replace('x', '');
            if (coeffStr === '' || coeffStr === '+') x_coeff += 1;
            else if (coeffStr === '-') x_coeff -= 1;
            else x_coeff += parseFloat(coeffStr);
        } else {
            constant += parseFloat(term);
        }
    });

    return { x: x_coeff, c: constant };
}

function solveLinear(eq) {
    let steps = [];
    let parts = parseEquation(eq);
    if (!parts) return { result: "Invalid Format", steps: [] };

    let op = parts.op;
    steps.push(`Original Equation: ${parts.lhs} ${op} ${parts.rhs}`);

    let left = parseExpression(parts.lhs);
    let right = parseExpression(parts.rhs);

    steps.push(`Parsed Left: ${left.x}x + ${left.c}`);
    steps.push(`Parsed Right: ${right.x}x + ${right.c}`);

    // Move x to left, constants to right
    // Expression: left.x*x + left.c [op] right.x*x + right.c
    //             (left.x - right.x)x [op] (right.c - left.c)

    let finalX = left.x - right.x;
    let finalC = right.c - left.c;

    steps.push(`Move terms: (${left.x}x - ${right.x}x) ${op} (${right.c} - ${left.c})`);
    steps.push(`Simplify: ${finalX}x ${op} ${finalC}`);

    if (finalX === 0) {
        // e.g. 0 < 5 (True) or 0 > 5 (False)
        let isTrue;
        switch (op) {
            case '=': isTrue = (0 === finalC); break; // Technically 0x = C -> 0 = C
            case '<': isTrue = (0 < finalC); break;
            case '>': isTrue = (0 > finalC); break;
            case '<=': isTrue = (0 <= finalC); break;
            case '>=': isTrue = (0 >= finalC); break;
        }

        if (op === '=') {
            if (finalC === 0) return { result: "Infinite Solutions", steps: steps };
            else return { result: "No Solution", steps: steps };
        } else {
            if (isTrue) return { result: "Always True (Infinite Solutions)", steps: steps };
            else return { result: "False (No Solution)", steps: steps };
        }
    }

    let resultFraction = toFraction(finalC, finalX);

    // If dividing by negative, flip operator
    if (finalX < 0 && op !== '=') {
        let oldOp = op;
        if (op === '<') op = '>';
        else if (op === '>') op = '<';
        else if (op === '<=') op = '>=';
        else if (op === '>=') op = '<=';
        steps.push(`Divide by negative (${finalX}), flip sign: ${oldOp} -> ${op}`);
    }

    steps.push(`Divide by coefficient: x ${op} ${finalC} / ${finalX}`);

    // Formatting the final answer
    // For inequalities, we usually keep it as x > ...
    // toFraction handles the reduction and sign of the fraction itself.
    // If we divided by negative, formal math says: -2x < 4 -> x > 4/-2 -> x > -2.
    // toFraction(4, -2) returns "-2/1" or "-2".

    let answer = `x ${op} ${resultFraction}`;
    steps.push(`Final Answer: ${answer}`);

    return { result: answer, steps: steps };
}

solveBtn.addEventListener('click', () => {
    const eq = equationInput.value;
    if (!eq) {
        solverResultsContainer.classList.add('hidden');
        return;
    }

    const solution = solveLinear(eq);
    solverResult.innerText = solution.result;

    solverSteps.innerHTML = '';
    if (solution.steps.length > 0) {
        solution.steps.forEach(step => {
            const div = document.createElement('div');
            div.classList.add('step-item');
            div.innerText = step;
            solverSteps.appendChild(div);
        });
        solverSteps.classList.remove('hidden');
    } else {
        solverSteps.classList.add('hidden');
    }
    solverResultsContainer.classList.remove('hidden');
});

// Tab Switching Logic
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.tools-card');
        const targetTab = btn.dataset.tab;

        // Remove active from buttons in this card
        card.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Hide all contents in this card
        card.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        // Show target
        card.querySelector(`#${targetTab}`).classList.add('active');
    });
});

// PGCD Logic
const pgcdBtn = document.getElementById('pgcd-btn');
const pgcdA = document.getElementById('pgcd-a');
const pgcdB = document.getElementById('pgcd-b');
const pgcdResult = document.getElementById('pgcd-result');
const pgcdSteps = document.getElementById('pgcd-steps');

pgcdBtn.addEventListener('click', () => {
    let a = parseInt(pgcdA.value);
    let b = parseInt(pgcdB.value);
    if (isNaN(a) || isNaN(b) || a < 0 || b < 0) {
        pgcdResult.innerText = "Invalid Input";
        return;
    }

    let steps = [];
    let r;
    // Euclidean algorithm steps
    // Step: a = b * q + r
    let x = Math.max(a, b);
    let y = Math.min(a, b);

    if (y === 0) {
        pgcdResult.innerText = x;
        pgcdSteps.innerText = `${x} = ${y} * 0 + ${x}`;
        return;
    }

    while (y !== 0) {
        r = x % y;
        let q = Math.floor(x / y);
        steps.push(`${x} = ${y} × ${q} + ${r}`);
        x = y;
        y = r;
    }

    pgcdResult.innerText = `PGCD = ${x}`;

    pgcdSteps.innerHTML = '';
    steps.forEach(step => {
        const div = document.createElement('div');
        div.classList.add('step-item');
        div.innerText = step;
        pgcdSteps.appendChild(div);
    });
    pgcdSteps.classList.remove('hidden');
});

// Fraction Logic
const fracBtn = document.getElementById('frac-btn');
const fracNum = document.getElementById('frac-num');
const fracDen = document.getElementById('frac-den');
const fracResult = document.getElementById('frac-result');

fracBtn.addEventListener('click', () => {
    let num = parseInt(fracNum.value);
    let den = parseInt(fracDen.value);
    if (isNaN(num) || isNaN(den)) {
        fracResult.innerText = "Invalid";
        return;
    }
    fracResult.innerText = toFraction(num, den);
});

// Sci Not Logic
const scinotBtn = document.getElementById('scinot-btn');
const scinotInput = document.getElementById('scinot-input');
const scinotResult = document.getElementById('scinot-result');

scinotBtn.addEventListener('click', () => {
    let val = parseFloat(scinotInput.value);
    if (isNaN(val)) {
        scinotResult.innerText = "Invalid";
        return;
    }
    // toExponential returns string like "5e+2"
    let exp = val.toExponential();
    // Format to "a x 10^n"
    let parts = exp.split('e');
    let base = parts[0];
    let power = parseInt(parts[1]); // removes + sign if present

    scinotResult.innerText = `${base} × 10^${power}`;
});

// Pythagoras Logic
const pythBtn = document.getElementById('pyth-btn');
const pythMode = document.getElementById('pyth-mode');
const pythA = document.getElementById('pyth-a');
const pythB = document.getElementById('pyth-b');
const pythResult = document.getElementById('pyth-result');

pythBtn.addEventListener('click', () => {
    let a = parseFloat(pythA.value);
    let b = parseFloat(pythB.value);
    let mode = pythMode.value;

    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
        pythResult.innerText = "Invalid (Must be > 0)";
        return;
    }

    if (mode === "hypotenuse") {
        // c = sqrt(a^2 + b^2)
        let c = Math.sqrt(a * a + b * b);
        pythResult.innerText = c % 1 === 0 ? c : c.toFixed(2);
    } else {
        // Find side: a = sqrt(c^2 - b^2) (assuming inputs are hyp and side)
        // If finding side, inputs should be Hypotenuse and Leg.
        // Let's assume input A is Hypotenuse for simplicity or strictly enforce a > b
        // Actually UI says Side A, Side B. If finding side, one input is Hypotenuse.
        // Let's reinterpret inputs based on mode:
        // Mode Hyp: Input Legs A & B.
        // Mode Side: Input Hypotenuse & Leg.
        // Let's clarify via placeholder updates?
        let hyp = Math.max(a, b);
        let leg = Math.min(a, b);

        let side = Math.sqrt(hyp * hyp - leg * leg);
        pythResult.innerText = side % 1 === 0 ? side : side.toFixed(2);
    }
});

// Update Pythagoras Placeholders based on mode
pythMode.addEventListener('change', () => {
    if (pythMode.value === 'hypotenuse') {
        pythA.placeholder = "Side A";
        pythB.placeholder = "Side B";
    } else {
        pythA.placeholder = "Hypotenuse";
        pythB.placeholder = "Side";
    }
});

// Thales Logic
const thalesBtn = document.getElementById('thales-btn');
const thalesA = document.getElementById('thales-a');
const thalesB = document.getElementById('thales-b');
const thalesC = document.getElementById('thales-c');
const thalesResult = document.getElementById('thales-result');

thalesBtn.addEventListener('click', () => {
    // A/B = C/x  => x = (B*C)/A
    let a = parseFloat(thalesA.value);
    let b = parseFloat(thalesB.value);
    let c = parseFloat(thalesC.value);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        thalesResult.innerText = "Invalid";
        return;
    }
    if (a === 0) {
        thalesResult.innerText = "Error (Div by 0)";
        return;
    }

    let x = (b * c) / a;
    thalesResult.innerText = x % 1 === 0 ? x : x.toFixed(2);
});
// Mobile Sidebar Logic
const menuBtn = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const sidebar = document.getElementById('sidebar');

if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
    });

    if (menuClose) {
        menuClose.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    // Close when clicking outside of the sidebar
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuBtn.contains(e.target) && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });
}
