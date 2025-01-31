class ScientificCalculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.history = [];
        this.mode = 'basic';
        this.angleMode = 'deg';
        this.base = 'DEC';
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.querySelectorAll('.mode-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.setMode(button.dataset.mode);
            });
        });

        document.querySelectorAll('.base-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.setBase(button.dataset.base);
            });
        });

        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.dataset.number);
            });
        });

        document.querySelectorAll('[data-operation]').forEach(button => {
            button.addEventListener('click', () => {
                this.chooseOperation(button.dataset.operation);
            });
        });

        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                switch(action) {
                    case 'clear':
                        this.clear();
                        break;
                    case 'delete':
                        this.delete();
                        break;
                    case 'percentage':
                        this.percentage();
                        break;
                    case 'sqrt':
                        this.sqrt();
                        break;
                    case 'compute':
                        this.compute();
                        break;
                    case 'power2':
                        this.power2();
                        break;
                    case 'power3':
                        this.power3();
                        break;
                    case 'powerY':
                        this.powerY();
                        break;
                    case 'factorial':
                        this.factorial();
                        break;
                    case 'sin':
                        this.sin();
                        break;
                    case 'cos':
                        this.cos();
                        break;
                    case 'tan':
                        this.tan();
                        break;
                    case 'ln':
                        this.ln();
                        break;
                    case 'log':
                        this.log();
                        break;
                    case 'exp':
                        this.exp();
                        break;
                    case 'pi':
                        this.pi();
                        break;
                    case 'e':
                        this.e();
                        break;
                    case 'rad':
                        this.rad();
                        break;
                    case 'deg':
                        this.deg();
                        break;
                    case 'inverse':
                        this.inverse();
                        break;
                    case 'clearHistory':
                        this.clearHistory();
                        break;
                }
            });
        });
    }

    setMode(mode) {
        this.mode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

        const scientificPad = document.querySelector('.scientific-pad');
        const baseSelector = document.querySelector('.base-selector');

        scientificPad.style.display = mode === 'scientific' ? 'grid' : 'none';
        baseSelector.style.display = mode === 'programmer' ? 'flex' : 'none';

        if (mode === 'programmer') {
            this.currentOperand = Math.floor(parseFloat(this.currentOperand)).toString();
        }
        this.updateDisplay();
    }

    setBase(base) {
        const currentNum = this.getCurrentBaseValue();
        this.base = base;
        
        document.querySelectorAll('.base-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-base="${base}"]`).classList.add('active');
        
        this.currentOperand = this.convertToBase(currentNum, base);
        this.updateDisplay();
    }

    getCurrentBaseValue() {
        let decimal;
        switch(this.base) {
            case 'HEX':
                decimal = parseInt(this.currentOperand, 16);
                break;
            case 'OCT':
                decimal = parseInt(this.currentOperand, 8);
                break;
            case 'BIN':
                decimal = parseInt(this.currentOperand, 2);
                break;
            default: // DEC
                decimal = parseInt(this.currentOperand, 10);
        }
        return isNaN(decimal) ? 0 : decimal;
    }

    convertToBase(decimal, base) {
        switch(base) {
            case 'HEX':
                return decimal.toString(16).toUpperCase();
            case 'OCT':
                return decimal.toString(8);
            case 'BIN':
                return decimal.toString(2);
            default: // DEC
                return decimal.toString(10);
        }
    }

    clear() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.mode === 'programmer') {
            if (this.base !== 'DEC' && number === '.') return;
            const valid = this.validateBaseInput(number);
            if (!valid) return;
        }

        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number;
        }
        this.updateDisplay();
    }

    validateBaseInput(number) {
        switch(this.base) {
            case 'BIN':
                return /[0-1]/.test(number);
            case 'OCT':
                return /[0-7]/.test(number);
            case 'HEX':
                return /[0-9A-Fa-f]/.test(number);
            default: // DEC
                return /[0-9.]/.test(number);
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.updateDisplay();
    }

    compute() {
        let computation;
        let prev, current;
        
        if (this.mode === 'programmer') {
            prev = this.getCurrentBaseValue();
            current = this.getCurrentBaseValue();
        } else {
            prev = parseFloat(this.previousOperand);
            current = parseFloat(this.currentOperand);
        }

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }

        if (this.mode === 'programmer') {
            computation = Math.floor(computation);
            this.currentOperand = this.convertToBase(computation, this.base);
        } else {
            this.currentOperand = computation.toString();
        }

        const expression = `${this.previousOperand} ${this.operation} ${this.currentOperand}`;
        this.addToHistory(expression, this.currentOperand);
        
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    power2() {
        const num = parseFloat(this.currentOperand);
        const result = Math.pow(num, 2);
        this.addToHistory(`${num}²`, result);
        this.currentOperand = result.toString();
        this.updateDisplay();
    }

    power3() {
        const num = parseFloat(this.currentOperand);
        const result = Math.pow(num, 3);
        this.addToHistory(`${num}³`, result);
        this.currentOperand = result.toString();
        this.updateDisplay();
    }

    powerY() {
        this.chooseOperation('^');
    }

    sqrt() {
        const num = parseFloat(this.currentOperand);
        if (num < 0) {
            this.currentOperand = 'Error';
        } else {
            const result = Math.sqrt(num);
            this.addToHistory(`√${num}`, result);
            this.currentOperand = result.toString();
        }
        this.updateDisplay();
    }

    percentage() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
        this.updateDisplay();
    }

    factorial() {
        const n = parseInt(this.currentOperand);
        if (n < 0) return;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        this.addToHistory(`${n}!`, result);
        this.currentOperand = result.toString();
        this.updateDisplay();
    }

    // Trigonometric functions
    sin() {
        const num = this.angleMode === 'deg' ? 
            parseFloat(this.currentOperand) * Math.PI / 180 : 
            parseFloat(this.currentOperand);
        const result = Math.sin(num);
        this.addToHistory(`sin(${this.currentOperand})`, result);
        this.currentOperand = result.toString();
        this.updateDisplay();
    }

    cos() {
        const num = this.angleMode === 'deg' ? 
            parseFloat(this.currentOperand) * Math.PI / 180 : 
            parseFloat(this.currentOperand);
        const result = Math.cos(num);
        this.addToHistory(`cos(${this.currentOperand})`, result);
        this.currentOperand = result.toString();
        this.updateDisplay();
    }

    tan() {
        const num = this.angleMode === 'deg' ? 
            parseFloat(this.currentOperand) * Math.PI / 180 : 
            parseFloat(this.currentOperand);
        const result = Math.tan(num);
        this.addToHistory(`tan(${this.currentOperand})`, result);
        this.currentOperand = result.toString();
        this.updateDisplay();
    }

    ln() {
        const result = Math.log(parseFloat(this.currentOperand));
        this.addToHistory(`ln(${this.currentOperand})`, result);
        this.currentOperand = result.toString();
        this.updateDisplay();
    }

    log() {
        const result = Math.log10(parseFloat(this.currentOperand));
        this.addToHistory(`log(${this.currentOperand})`, result);
        this.currentOperand = result.toString();
        this.updateDisplay();
    }

    exp() {
        const result = Math.exp(parseFloat(this.currentOperand));
        this.addToHistory(`e^${this.currentOperand}`, result);
        this.currentOperand = result.toString();
        this.updateDisplay();
    }

    pi() {
        this.currentOperand = Math.PI.toString();
        this.updateDisplay();
    }

    e() {
        this.currentOperand = Math.E.toString();
        this.updateDisplay();
    }

    rad() {
        this.angleMode = 'rad';
        document.querySelector('[data-action="rad"]').classList.add('active');
        document.querySelector('[data-action="deg"]').classList.remove('active');
    }

    deg() {
        this.angleMode = 'deg';
        document.querySelector('[data-action="deg"]').classList.add('active');
        document.querySelector('[data-action="rad"]').classList.remove('active');
    }

    inverse() {
        const result = 1 / parseFloat(this.currentOperand);
        this.addToHistory(`1/${this.currentOperand}`, result);
        this.currentOperand = result.toString();
        this.updateDisplay();
    }

    addToHistory(expression, result) {
        this.history.unshift({ expression, result });
        this.updateHistory();
    }

    clearHistory() {
        this.history = [];
        this.updateHistory();
    }

    updateHistory() {
        const historyContent = document.querySelector('.history-content');
        historyContent.innerHTML = '';
        
        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">${item.result}</div>
            `;
            historyItem.addEventListener('click', () => {
                this.currentOperand = item.result.toString();
                this.updateDisplay();
            });
            historyContent.appendChild(historyItem);
        });
    }

    updateDisplay() {
        let displayNum = this.currentOperand;
        if (this.mode === 'programmer' && this.base !== 'DEC') {
            const num = this.getCurrentBaseValue();
            displayNum = this.convertToBase(num, this.base);
        }
        document.querySelector('.current-operand').textContent = displayNum;
        document.querySelector('.previous-operand').textContent = 
            this.operation ? `${this.previousOperand} ${this.operation}` : '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new ScientificCalculator();
});
