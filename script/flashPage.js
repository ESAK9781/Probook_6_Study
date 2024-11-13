

class flashTimer {
    constructor(time) {
        this.ms = time * 1000;
        this.time = time;
        this.done = true;
    }

    start() {
        if (!this.done) return false;
        this.done = false;
        this.prom = new Promise((res, rej) => {
            setTimeout(() => {
                res();
            }, this.ms);
        });

        this.prom.then((val) => {
            this.done = true;
        });
    }
}








var flash1 = document.getElementById("flashOne");
var flash2 = document.getElementById("flashTwo");
var flash3 = document.getElementById("flashThree");
var flash4 = document.getElementById("flashFour");

var flashCards = [flash1, flash2, flash3, flash4];

for (let i = 0; i < flashCards.length; i++) {
    flashCards[i].onclick = (ev) => {
        flipCard();
    }
}

var flashClassNames = ["firstFlash", "secondFlash", "thirdFlash", "fourthFlash"];

var flashTime = new flashTimer(0.3);


for (let i = 0; i < flashCards.length; i++) {
    flashCards[i].className = "flashPanel " + flashClassNames[i];
}

var flashDeckIndex = 0;


function flipCard() {
    let crd = document.getElementsByClassName("flashPanel secondFlash")[0];
    for (let i = 0; i < crd.children.length; i++) {
        crd.children[i].classList.toggle("flipped");
    }
}

function unflipCard() {
    let crd = document.getElementsByClassName("flashPanel secondFlash")[0];
    for (let i = 0; i < crd.children.length; i++) {
        crd.children[i].classList.toggle("flipped", false);
    }
}

function setCard(card, question) {
    
    if (question.imageQuestion) {
        let panel = card.children[1]
        panel.innerHTML = "<img src=\"" + question.q + 
            "\" alt=\"Error Loading Image\">";
        panel.classList.toggle("imageHolder", true)
    } else {
        card.children[1].innerHTML = "";
        card.children[1].innerText = question.q;
        card.children[1].classList.toggle("imageHolder", false)
    }
    card.children[2].innerText = question.a;
}

function setFlashDeck() {
    function modDeck(n) {
        return (n + 2 * selectedDeck.qs.length) % selectedDeck.qs.length;
    }

    setCard(flashCards[0], selectedDeck.qs[modDeck(flashDeckIndex - 1)]);
    setCard(flashCards[1], selectedDeck.qs[modDeck(flashDeckIndex)]);
    setCard(flashCards[2], selectedDeck.qs[modDeck(flashDeckIndex + 1)]);
    setCard(flashCards[3], selectedDeck.qs[modDeck(flashDeckIndex + 2)]);

}


function setFlashTitle() {
    document.getElementById("flashTitle").innerText = "\"" + selectedDeck.t + "\" Flash Cards";
}

// setFlashDeck();
// setFlashTitle();

document.addEventListener("keydown", (ev) => {
    if (selectedTab == "flashPage") {
        if ((ev.key == " ") || (ev.key == "ArrowUp") || (ev.key == "ArrowDown")) {
            flipCard();
        } else if ((ev.key == "ArrowLeft") && (flashTime.done)) {
            unflipCard();
            flashCards = [flashCards[3], flashCards[0], flashCards[1], flashCards[2]];
            for (let i = 0; i < flashCards.length; i++) {
                flashCards[i].className = "flashPanel " + flashClassNames[i];
            }
            flashDeckIndex--;

            setFlashDeck();

            flashTime.start();
        } else if ((ev.key == "ArrowRight") && (flashTime.done)) {
            unflipCard();
            flashCards = [flashCards[1], flashCards[2], flashCards[3], flashCards[0]];
            for (let i = 0; i < flashCards.length; i++) {
                flashCards[i].className = "flashPanel " + flashClassNames[i];
            }
            flashDeckIndex++;

            setFlashDeck();

            flashTime.start();
        }
    }
});