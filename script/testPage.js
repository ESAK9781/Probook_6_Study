var currentTest = false;
var testDoc = document.getElementById("testDocument");
var startTestModal = document.getElementById("takeTestModal");
var testResultsDoc = document.getElementById("testResults");

function genMCQuestion(question, questions, qnumber) {
    let questionString = question.q;

    let choices = [];
    choices.push(question.a);

    questions = shuffle(questions);
    let addedChoices = 0;
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].a != question.a) {
            choices.push(questions[i].a);
            addedChoices++;
        }

        if (addedChoices >= 3) {
            break;
        }
    }

    choices = shuffle(choices);

    let MCQuestion = document.createElement("div");
    MCQuestion.className = "mcTestQuestion";

    let questionText = document.createElement("p");
    questionText.innerText = qnumber + ". " + questionString;
    questionText.className = "mcqText";

    let questionChoiceBox = document.createElement("div");
    questionChoiceBox.className = "mcqChoices";

    let correctAnswer = false;

    let choiceElements = [];
    for (let i = 0; i < choices.length; i++) {
        let txt = "";
        switch (i) {
            case 0:
                txt += "A) ";
                break;
            case 1:
                txt += "B) ";
                break;
            case 2:
                txt += "C) ";
                break;
            case 3:
                txt += "D) ";
                break;
        }

        txt += choices[i];
        if (choices[i] == question.a) correctAnswer = i;

        let choiceEl = document.createElement("div");
        choiceEl.className = "mcqChoice";
        choiceEl.innerText = txt;

        choiceElements.push(choiceEl);
        questionChoiceBox.appendChild(choiceEl);
    }

    for (let i = 0; i < choiceElements.length; i++) {
        choiceElements[i].onclick = () => {
            for (let i = 0; i < choiceElements.length; i++) {
                choiceElements[i].className = "mcqChoice";
            }

            choiceElements[i].className += " selected";
        }
    }

    MCQuestion.appendChild(questionText);
    MCQuestion.appendChild(questionChoiceBox);


    return {
        qType: "mcq",
        element: MCQuestion,
        choices: choiceElements,
        correctAnswer: correctAnswer,
        card: question
    };
}

function genFRQuestion(question, qnumber) {
    let FRQuestion = document.createElement("div");
    FRQuestion.className = "frTestQuestion";

    let frqText = qnumber + ". " + question.q;
    let frqLabelEl = document.createElement("div");
    frqLabelEl.innerText = frqText;

    frqLabelEl.className = "frQuestionText";

    let frqInp = document.createElement("input");
    frqInp.type = "text";
    frqInp.placeholder = "Unanswered";
    frqInp.className = "frQuestionInp";

    FRQuestion.appendChild(frqLabelEl);
    FRQuestion.appendChild(frqInp);

    return {
        qType: "frq",
        element: FRQuestion,
        input: frqInp,
        correctAnswer: question.a,
        card: question
    };
}

function match_allowDrop(ev) {
    ev.preventDefault();
}

function match_drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function match_drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");

    if (ev.target.className == "matchOptionElement") {
        ev.target.parentNode.appendChild(document.getElementById(data));
        return;
    }

    ev.target.appendChild(document.getElementById(data));
}

function genMatchQuestion(questions, startQNumber) {
    let questionElements = [];
    let optionElements = [];

    let matchQuestion = document.createElement("div");
    matchQuestion.className = "matchQuestion";
    questions = shuffle(questions);

    let correctAnswers = [];

    for (let i = 0; i < questions.length; i++) {
        let ql = document.createElement("div");
        ql.className = "matchQuestionCell";
        ql.innerText = (startQNumber + i) + ". " + questions[i].q;

        let op = document.createElement("div");
        op.className = "matchOptionElement";
        op.id = "matchOptionElement_" + (startQNumber + i);
        op.innerText = questions[i].a;
        op.draggable = true;
        op.ondragstart = match_drag;


        correctAnswers.push(questions[i].a);

        questionElements.push(ql);
        optionElements.push(op);
    }

    optionElements = shuffle(optionElements);

    let questionRows = document.createElement("div");
    questionRows.className = "matchRowBox";


    let answerInputs = [];

    for (let i = 0; i < questionElements.length; i++) {
        let row = document.createElement("div");
        row.className = "matchRow";

        let aCol = document.createElement("div");

        aCol.className = "matchAnswerCell";
        aCol.ondrop = match_drop;
        aCol.ondragover = match_allowDrop;

        row.appendChild(questionElements[i]);
        row.appendChild(aCol);

        questionRows.appendChild(row);
        answerInputs.push(aCol);
    }

    let optionBox = document.createElement("div");
    optionBox.className = "matchOptionBox";
    optionBox.ondrop = match_drop;
    optionBox.ondragover = match_allowDrop;

    for (let i = 0; i < optionElements.length; i++) {
        optionBox.appendChild(optionElements[i]);
        optionElements[i].ondrop = () => {};
        optionElements[i].ondragover = () => {};
    }

    matchQuestion.appendChild(questionRows);
    matchQuestion.appendChild(optionBox);


    return {
        qType: "match",
        element: matchQuestion,
        correctAnswers: correctAnswers,
        answerInputs: answerInputs,
        cards: questions
    };

    // drag and drop with https://www.w3schools.com/html/html5_draganddrop.asp
}

function generateTest(deck) {
    let test = {
        title: {},
        bank: [],
        subm: {}
    };

    let title = deck.t;
    let titleEl = document.createElement("h1");
    titleEl.id = "testTitle";
    titleEl.innerText = title;
    test.title = titleEl;


    let qs = deck.qs;
    qs = shuffle(qs);

    let questions = [];

    let mcQuestions = [];
    let frQuestions = [];
    let matchQuestions = [];

    for (let i = 0; i < qs.length; i++) {
        let val = Math.random();
        if (val < 0.33) {
            mcQuestions.push(qs[i]);
        } else if (val < 0.5) {
            frQuestions.push(qs[i]);
        } else {
            matchQuestions.push(qs[i]);
        }
    }

    let qNum = 1;
    for (let i = 0; i < mcQuestions.length; i++) {
        questions.push(genMCQuestion(mcQuestions[i], qs, qNum));
        qNum++;
    }

    for (let i = 0; i < frQuestions.length; i++) {
        questions.push(genFRQuestion(frQuestions[i], qNum));
        qNum++;
    }

    let necessaryMatches = Math.floor(matchQuestions.length / 5);
    let qPerMatch = matchQuestions.length / necessaryMatches;
    for (let i = 0; i < necessaryMatches; i++) {
        let qsForMatch = [];

        // if this is the last match question
        if (i + 1 >= necessaryMatches) {
            qsForMatch = matchQuestions;
        } else {
            for (let i = 0; i < qPerMatch; i++) {
                qsForMatch.push(matchQuestions.shift());
            }
        }

        questions.push(genMatchQuestion(qsForMatch, qNum));
        qNum += qsForMatch.length;
    }

    test.bank = questions;

    let subm = document.createElement("button");
    subm.innerText = "Submit";
    subm.id = "testSubmit";
    subm.onclick = submitTest;
    test.subm = subm;

    return test;
}

function submitTest() {
    let points = 0;
    let totalPoints = 0;
    let unknownWords = [];


    for (let i = 0; i < currentTest.bank.length; i++) {
        let q = currentTest.bank[i];
        if (q.qType == "mcq") {
            let selected = -1;
            for (let i = 0; i < q.choices.length; i++) {
                if (q.choices[i].classList.contains("selected")) {
                    selected = i;
                    break;
                }
            }

            if (selected == q.correctAnswer) {
                points++;
            } else {
                unknownWords.push(q.card);
            }

            totalPoints++;
        } else if (q.qType == "frq") {
            if (q.input.value.toUpperCase() == q.correctAnswer.toUpperCase()) {
                points++;
            } else {
                unknownWords.push(q.card);
            }

            totalPoints++;
        } else if (q.qType == "match") {
            for (let i = 0; i < q.answerInputs.length; i++) {
                if (q.answerInputs[i].innerText == q.correctAnswers[i]) {
                    points++;
                } else {
                    unknownWords.push(q.cards[i]);
                }

                totalPoints++;
            }
        }
    }

    displayScore(points, totalPoints, unknownWords);
}

function displayScore(points, totalPoints, incorrectWords) {
    testDoc.className = "hidden";
    startTestModal.className = "hidden";
    testResultsDoc.className = "";

    scoreBar = document.getElementById("testResultBarIndicator");
    scoreBar.style.width = `${Math.floor((points / totalPoints) * 80)}%`;
    
    function createMissedTable(missed) {
        let table = document.createElement("table");
        table.className = "missedTable";
        let head = document.createElement("tr");
        let headers = ["Question", "Answer"];
        for (let i = 0; i < headers.length; i++) {
            h = headers[i];
            h_element = document.createElement("th");
            h_element.innerText = h;
            head.appendChild(h_element);
        }
        table.appendChild(head);

        for (let i = 0; i < missed.length; i++) {
            let row_el = document.createElement("tr");
            let inc_word = incorrectWords[i];
            let row = [inc_word.q, inc_word.a];
            for (let j = 0; j < row.length; j++) {
                let r_div = document.createElement("td");
                r_div.innerText = row[j];
                r_div.appendChild(document.createElement("br"));
                row_el.appendChild(r_div);
            }

            table.appendChild(row_el);
        }

        return table;
    }

    missed_q_div = document.getElementById("testResultsMissedQuestions");
    missed_q_div.innerHTML = "";
    missed_q_div.appendChild(createMissedTable(incorrectWords));
}

function resetTestPage() {
    startTestModal.className = "";
    testDoc.className = "hidden";
    testResultsDoc.className = "hidden";
}

function startTest() {
    if (!selectedDeck) return;

    startTestModal.className = "hidden";
    testDoc.className = "";
    testResultsDoc.className = "hidden";


    currentTest = generateTest(selectedDeck);
    testDoc.innerHTML = "";

    testDoc.appendChild(currentTest.title);
    for (let i = 0; i < currentTest.bank.length; i++) {
        testDoc.appendChild(currentTest.bank[i].element);
    }

    testDoc.appendChild(currentTest.subm);
}

document.getElementById("takeTestButton").onclick = startTest;
document.getElementById("retakeTestButton").onclick = startTest;
