// - Variabili globali
const fullDisplay = document.getElementById('full-display');
const middleDisplay = document.querySelector('.display#middle');
const mainDisplay = document.querySelector('.display#bottom');

const clearBtn = document.getElementById('oprCe');

let equation = [];

let lastBtnPressed;
let equationSolved = false;

// - Event Listeners
const numbers = document.querySelectorAll('.number');
numbers.forEach(num => {
    num.addEventListener('click', handleNum);
});

const operators = document.querySelectorAll('.operator');
operators.forEach(operator => {
    operator.addEventListener('click', handleOperator);
})

window.addEventListener('keydown', function (e) {
    // elimina caso dello spazio perché sennò Number(' ') == 0
    if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].indexOf(Number(e.key)) > -1 && e.code != 'Space') {
        handleNum(e.key);
    } else if (['+', '-', '*', '/', '.', 'Enter', 'Backspace', "o"].indexOf(e.key) > -1) {
        handleOperator(e.key);
    }
});

// - Funzioni
function handleNum(e) {

    let numberPressed;
    (e instanceof Event) ? numberPressed = e.target.textContent : numberPressed = e;

    if (lastBtnPressed == 'operator' || mainDisplay.textContent == '0') {
        mainDisplay.textContent = numberPressed;
    } else {
        mainDisplay.textContent += numberPressed;

        // per evitare l'overflow dei numeri (se supera la larghezza display, ignora l'ultimo numero)
        if (getComputedStyle(mainDisplay).width != '348px') {
            let auxArr = Array.from(mainDisplay.textContent);
            auxArr.pop();
            mainDisplay.textContent = auxArr.join('');
        }
    }
    lastBtnPressed = 'number';
    clearBtn.textContent = 'C';

    //avvisa di accendere lo schermo se non è stato fatto
    if (!fullDisplay.classList.contains("on")) {
        alert("Start the calculator first!");
    }

}

function handleOperator(e) {
    let btnElement;
    (e instanceof Event) ? btnElement = e.target : btnElement = document.querySelector(`button[data-key='${e}']`);

    switch (btnElement.id) {
        case 'oprPlus':
            pushToEquation(btnElement.textContent, 'add');
            break;

        case 'oprMinus':
            pushToEquation(btnElement.textContent, 'subtract');
            break;

        case 'oprMult':
            pushToEquation(btnElement.textContent, 'multiply');
            break;

        case 'oprDiv':
            pushToEquation(btnElement.textContent, 'divide');
            break;

        case 'oprSqroot':
            mainDisplay.textContent = op.sqroot(Number(mainDisplay.textContent));
            lastBtnPressed = 'operator';
            break;

        case 'oprEqual':
            if (!equationSolved) {
                solveEquation();
            }

            lastBtnPressed = 'operator';
            break;

        case 'oprCe':
            if (clearBtn.textContent == 'CE') {
                equation = [];
                middleDisplay.textContent = ''
            }

            mainDisplay.textContent = ""
            clearBtn.textContent = 'CE';
            break;

        case 'oprDot':
            if (mainDisplay.textContent.indexOf('.') == -1) {
                mainDisplay.textContent += '.';
            }
            break;

        case 'oprPlusMinus':
            mainDisplay.textContent = op.minplus(Number(mainDisplay.textContent));
            break;

        case 'oprOn':
            mainDisplay.textContent = "Hello World!";
            setTimeout(function () {
                mainDisplay.textContent = "";
            }, 800);
            fullDisplay.classList.add("on");
            break;

        default:
            console.warn('Ricontrolla il codice!')
            break;
    }

    //avvisa di accendere lo schermo se non è stato fatto
    if (!fullDisplay.classList.contains("on")) {
        alert("Start the calculator first!");
    }
}


function pushToEquation(oprString, oprFunc) {
    // Se nessun numero è selezionato ignora gli operatori
    if (mainDisplay.textContent === "" || mainDisplay.textContent === ".") { return }

    // Controlla se l'ultima operazione è stata completata
    if (equationSolved) {
        middleDisplay.textContent = mainDisplay.textContent + ' ' + oprString;
        equationSolved = false
    } else {
        middleDisplay.textContent += ' ' + mainDisplay.textContent + ' ' + oprString;
    }

    equation.push(Number(mainDisplay.textContent));
    equation.push(oprFunc);

    lastBtnPressed = 'operator';
}


function solveEquation() {
    middleDisplay.textContent += ' ' + mainDisplay.textContent;
    equation.push(Number(mainDisplay.textContent));


    let highPrioOperations = equation.filter(el => el == 'divide' || el == 'multiply');
    let lowPrioOperations = equation.filter(el => el == 'add' || el == 'subtract');
    let orderedOperations = highPrioOperations.concat(lowPrioOperations);


    // Iterare l'operazione finché non viene completata, risolvendo le operazioni in ordine algebrico
    while (equation.length > 1) {
        let aux = equation.indexOf(orderedOperations[0]);

        let partial = op[orderedOperations[0]](equation[aux - 1], equation[aux + 1]);

        equation.splice(aux - 1, 3, partial);

        orderedOperations.shift();
    }

    // Se numero troppo alto forza la notazione scientifica
    if (equation[0].toString().length > 13 || equation[0].toString().indexOf('e') != -1) {
        equation[0] = equation[0].toExponential(3);
    }

    equationSolved = true;
    mainDisplay.textContent = equation.shift(); // shift() per pulire l'array equation
}

// operazioni principali
const op = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b,
    sqroot: (a) => Math.sqrt(a),
    minplus: (a) => -a,
};