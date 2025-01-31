document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const history = document.getElementById('history');
    const buttons = document.querySelectorAll('.btn');
    let currentExpression = '';
    let calculationHistory = [];

    // Button click handler
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.dataset.value;
            
            if (value === '=') {
                try {
                    const result = evaluateExpression(currentExpression);
                    calculationHistory.push(`${currentExpression} = ${result}`);
                    updateHistory();
                    currentExpression = result.toString();
                    display.value = currentExpression;
                } catch (error) {
                    display.value = 'Error';
                    currentExpression = '';
                }
            } else if (value === 'C') {
                currentExpression = '';
                display.value = '';
            } else if (value === '√') {
                currentExpression += 'sqrt(';
                display.value = currentExpression;
            } else if (value === 'π') {
                currentExpression += Math.PI;
                display.value = currentExpression;
            } else if (value === '^') {
                currentExpression += '**';
                display.value = currentExpression;
            } else {
                currentExpression += value;
                display.value = currentExpression;
            }
        });
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        
        if (/[0-9.]/.test(key)) {
            currentExpression += key;
            display.value = currentExpression;
        } else if ('+-*/%'.includes(key)) {
            currentExpression += key;
            display.value = currentExpression;
        } else if (key === 'Enter') {
            e.preventDefault();
            document.getElementById('equals').click();
        } else if (key === 'Escape') {
            currentExpression = '';
            display.value = '';
        } else if (key === 'Backspace') {
            currentExpression = currentExpression.slice(0, -1);
            display.value = currentExpression;
        } else if (key === '(' || key === ')') {
            currentExpression += key;
            display.value = currentExpression;
        }
    });

    // Evaluate mathematical expressions safely
    function evaluateExpression(expr) {
        expr = expr.replace(/sqrt\(/g, 'Math.sqrt(')
                  .replace(/sin\(/g, 'Math.sin(')
                  .replace(/cos\(/g, 'Math.cos(')
                  .replace(/tan\(/g, 'Math.tan(')
                  .replace(/log\(/g, 'Math.log10(')
                  .replace(/π/g, Math.PI.toString());
        
        try {
            const result = new Function(`return ${expr}`)();
            if (isNaN(result) || !isFinite(result)) throw new Error();
            return result;
        } catch (error) {
            throw new Error('Invalid expression');
        }
    }

    // Update calculation history
    function updateHistory() {
        history.textContent = calculationHistory.slice(-3).join(' \u23CE ');
    }
});
