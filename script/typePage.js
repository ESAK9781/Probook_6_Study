var currentTypeQuiz;
var whiteSpaceChar = "\u00a0";
var tabSpaceChar = whiteSpaceChar + whiteSpaceChar + whiteSpaceChar + whiteSpaceChar + whiteSpaceChar;

// Terminal handling
function logInTerminal(text, isIncorrect, isCommand) {
    if (isIncorrect == undefined) {
        isIncorrect = false;
    }

    if (isCommand == undefined) {function shuffle(array) { // shuffles array, implementing changes on the original copy of the array
        let currentIndex = array.length;
    
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
    
            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
    
            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
    
        return array;
    }
        isCommand = false;
    }

    let ent = document.createElement("div");
    ent.className = "webtermEntry";
    if (isIncorrect) {
        ent.className += " error";
    } else if (isCommand) {
        ent.className += " command";
    }

    // ent.innerText = (document.getElementById("webtermLog").children.length + 1) + " | " + text;
    ent.innerText = text;

    document.getElementById("webtermLog").appendChild(ent);

    // scroll to the bottom of the terminal
    document.getElementById("webtermLog").scrollTop = document.getElementById("webtermLog").scrollHeight
}

function clearTerminal() {
    document.getElementById("webtermLog").innerHTML = "";
}




/*

{
    "t": "Deck One",
    "qs": [
        {
            "q": "Question 1",
            "a": "Answer 1"
        },
        {
            "q": "Question 2",
            "a": "Answer 2"
        },
        {
            "q": "Question 3",
            "a": "Answer 3"
        },
        {
            "q": "Question 4",
            "a": "Answer 4"
        }
    ]
}

*/



class learningSession {
    constructor(deck) {
        this.deck = deck;
        this.unknownDeck = [];


        for (let i = 0; i < this.deck.qs.length; i++) {
            if (this.deck.qs[i].imageQuestion) continue;
            this.unknownDeck.push(this.deck.qs[i]);
        }

        this.unknownDeck = shuffle(this.unknownDeck);

        this.familiarDeck = [];
        this.knownDeck = [];

        // as questions are answered correctly a certain number of times, they will be advanced to 
        // more known decks


        this.currentQuestionLevel = undefined;
        this.currentQuestion = undefined;

        this.questionNumber = 0;
        this.pastQuestionCorrectAnswer = "";
    }

    getNextQuestion() {

        // check if the deck has been completed
        if (this.unknownDeck.length + this.familiarDeck.length == 0) return false;

        this.questionNumber++;

        // Ensure a significant number of familiar questions to prevent repeat questions;
        // Because only seven items can be in short term memory. This forces long term memory.
        if ((this.familiarDeck.length < 8) && (this.unknownDeck.length)) { 
            this.currentQuestionLevel = 0; // 0 corresponds to unknown
            this.currentQuestion = this.unknownDeck.shift();
            return this.currentQuestion.q;
        }

        if ((this.unknownDeck.length) && (Math.random() > 0.5)) { // give it a fifty percent chance
            this.currentQuestionLevel = 0; // 1 corresponds to familiar
            this.currentQuestion = this.unknownDeck.shift();
            return this.currentQuestion.q;
        }

        this.currentQuestionLevel = 1;
        this.currentQuestion = this.familiarDeck.shift();
        return this.currentQuestion.q;
    }

    checkAnswer(answer) {
        let wasCorrect = false;

        // The answer is correct
        if (answer.toLowerCase() == this.currentQuestion.a.toLowerCase()) {
            this.currentQuestionLevel += 1;
            wasCorrect = true;
        } else {
            this.currentQuestionLevel -= 1;
            if (this.currentQuestionLevel < 0) {
                this.currentQuestionLevel = 0;
            }
        }

        // replace the question back into its new deck
        switch(this.currentQuestionLevel) {
            case 0:
                this.unknownDeck.push(this.currentQuestion);
                break;
            case 1:
                this.familiarDeck.push(this.currentQuestion);
                break;
            case 2:
                this.knownDeck.push(this.currentQuestion);
                break;
        }

        // shuffle the decks to avoid predicteable question ordering
        this.unknownDeck = shuffle(this.unknownDeck);
        this.familiarDeck = shuffle(this.familiarDeck);

        this.pastQuestionCorrectAnswer = this.currentQuestion.a;

        return wasCorrect;
    }
}


function askNextQuestion() {
    if (!currentTypeQuiz) return;

    let question = currentTypeQuiz.getNextQuestion();
    if (question == false) {
        logInTerminal("Session complete!")
        return;
    }
    logInTerminal(currentTypeQuiz.questionNumber + ". " + question);
}

function terminalInputHandler() {
    let txt = document.getElementById("webtermInp").value;
    document.getElementById("webtermInp").value = "";


    if (txt == "help") {
        logInTerminal(txt, false, true);
        logInTerminal(tabSpaceChar + "[help]  : display the list of commands", false, true);
        logInTerminal(tabSpaceChar + "[cls]   : clear the terminal screen", false, true);
        logInTerminal(tabSpaceChar + "[reset] : reset the current study session", false, true);
        logInTerminal(tabSpaceChar + "[rept]  : repeat the last question", false, true);
        return;
    } else if (txt == "cls") {
        clearTerminal();
        return;
    } else if (txt == "reset") {
        if (!selectedDeck) {
            logInTerminal(txt, false, true);
            logInTerminal(tabSpaceChar + "Please select a deck first.", true);
            return;
        }

        logInTerminal(txt, false, true);
        changeTypeQuiz(selectedDeck);
        return;
    } else if (txt == "rept") {
        if (!currentTypeQuiz) {
            logInTerminal(txt, false, true);
            logInTerminal(tabSpaceChar + "There is no learn session in progress", true);
            return;
        }

        logInTerminal(txt, false, true);
        logInTerminal(tabSpaceChar + currentTypeQuiz.questionNumber + ". " + 
            currentTypeQuiz.currentQuestion.q, false, true);
        return;
    }

    if (txt.length == 0) return;

    if (!currentTypeQuiz) return;

    let wasCorrect = currentTypeQuiz.checkAnswer(txt);
    if (wasCorrect) {
        logInTerminal(tabSpaceChar + "\"" + txt + "\" is Correct!");
    } else {
        logInTerminal(tabSpaceChar + "\"" + txt + "\" is Incorrect", true);
        logInTerminal(tabSpaceChar + "Try \"" + currentTypeQuiz.pastQuestionCorrectAnswer + "\" next time.")
    }

    askNextQuestion();
}

function changeTypeQuiz(deck) {
    if (!deck) return;

    clearTerminal();
    logInTerminal("Learning: " + deck.t.toUpperCase());
    logInTerminal("");

    currentTypeQuiz = new learningSession(deck);
    askNextQuestion();
}



document.getElementById("webtermInp").onkeyup = (ev) => {
    if (ev.code == "Enter") {
        terminalInputHandler();
    }
};


