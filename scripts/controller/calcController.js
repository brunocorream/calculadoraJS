class CalcController {
    constructor() {
        this._lastOperator = "";
        this._lastNumber = "";
        
        this._operation = [];
        this._locale = "pt-BR"; // O idioma de Data e hora que será usado (não ficar repetindo o código) = atributo
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.addOperation();
        this.initkeyboard();
    }

    pasteFromClipboard(){
        document.addEventListener('paste', e =>{
            let text = e.clipboardData.getData('Text'); // O Text é do próprio JS para informar que é um TEXTO e não imagem ou outra coisa embora possa receber números. 

            console.log(text);
        })
    }

    copyToClipboard(){

        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();
    }

    initialize() {
        this.setDisplayDateTime(); // invocando o método de aparecer data e hora na inicialização

        let interval = setInterval(() => {
            //setInterval é uma função do JS para repetir determinada função/método durante o tempo estabelecido em milisegundos.

            this.setDisplayDateTime(); // Chama novamete o método da data e hora, para dar efeito de contagem dos segundos no display
        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();
    }

    initkeyboard() {
        document.addEventListener("keyup", e => {
            switch (e.key) {
                case "Escape":
                    this.clearAll();
                    break;
                case "Backspace":
                    this.clearEntry();
                    break;
                case "+":
                case "-":
                case "*":
                case "/":
                case "%":
                    this.addOperation(e.key);
                    break;
                case ".":
                case ",":
                    this.addDot(".");
                    break;
                case "Enter":
                case "=":
                    this.calc();
                    break;
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    this.addOperation(parseInt(e.key));
                    break;
            }
        });
    }

    setDisplayDateTime() {
        this.displayDate = this._currentDate.toLocaleTimeString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this._currentDate.toLocaleTimeString(this._locale);
    }

    addEventListenerAll(element, events, fn) {
        events.split(" ").forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }
    clearAll() {
        this._operation = [];
        this._lastNumber = [];
        this._lastOperator = [];
        this.setLastNumberToDisplay();
    }
    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value) {
        return ["+", "-", "*", "%", "/"].indexOf(value) > -1;
    }

    pushOperation(value) {
        this._operation.push(value);

        if (this._operation.length > 3) {
            this.calc();
        }
    }

    getResult() {
        return eval(this._operation.join(""));
    }

    calc() {
        let last = "";

        this._lastOperator = this.getlastItem();

        if (this._operation.length < 3) {
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3) {
            last = this._operation.pop();
            this._lastNumber = this.getResult();
        } else if (this._operation.length == 3) {
            this._lastNumber = this.getlastItem(false);
        }

        let result = this.getResult();

        if (last == "%") {
            result /= 100;
            this._operation = [result, last];
        } else {
            this._operation = [result];

            if (last) {
                this._operation.push(last);
            }
        }

        this.setLastNumberToDisplay();
    }

    getlastItem(isOperator = true) {
        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {
            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }

        if (!lastItem) {
            lastItem = isOperator ? this._lastOperator : this.lastNumber;
        }
        return lastItem;
    }

    setLastNumberToDisplay() {
        let lastNumber = this.getlastItem(false);

        if (!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;
    }

    addOperation(value) {
        if (isNaN(this.getLastOperation())) {
            //Entradas de String
            if (this.isOperator(value)) {
                this.setLastOperation(value);
            } else if (isNaN(value)) {
                //Outras possibilidades
            } else {
                this.pushOperation(value);
                this, this.setLastNumberToDisplay();
            }
        } else {
            if (this.isOperator(value)) {
                this.pushOperation(value);
            } else {
                //Entradas de Number
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                // Atualizar display
                this.setLastNumberToDisplay();
            }
        }
    }

    addDot() {
        let lastOperation = this.getLastOperation();

        if (
            typeof lastOperation === "string" &&
            lastOperation.split("").indexOf(".") > -1
        )
            return;

        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation("0.");
        } else {
            this.setLastOperation(lastOperation.toString() + ".");
        }

        this.setLastNumberToDisplay();
    }

    execBtn(value) {
        switch (value) {
            case "ac":
                this.clearAll();
                break;
            case "ce":
                this.clearEntry();
                break;
            case "soma":
                this.addOperation("+");
                break;
            case "subtracao":
                this.addOperation("-");
                break;
            case "divisao":
                this.addOperation("/");
                break;
            case "multiplicacao":
                this.addOperation("*");
                break;
            case "porcento":
                this.addOperation("%");
                break;
            case "ponto":
                this.addDot(".");
                break;
            case "igual":
                this.calc();

                break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.addOperation(parseInt(value));
                break;
            
            case 'c':
                if (e.ctrlKey) this.copyToClipboard();
                break;
        }
    }

    initButtonsEvents() {
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, "click drag", e => {
                let textBtn = btn.className.baseVal.replace("btn-", "");
                this.execBtn(textBtn);
            });
        });
    }

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        return (this._timeEl.innerHTML = value);
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        return (this._dateEl.innerHTML = value);
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value;
    }
}
