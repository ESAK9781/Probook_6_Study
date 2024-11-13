var decks = [];
var selectedDeck = {};



function retrieveDecks(deckNum) { // the currently selected deck number
    let ds = localStorage.getItem("decks");

    if (ds) {
        if (JSON.parse(localStorage.getItem("decks")).length == 0) {
            ds = undefined;
        }
    }

    if (ds) {
        decks = JSON.parse(localStorage.getItem("decks"));
    } else {
        decks = JSON.parse(decksJSON);
        console.log("parsing");
    }

    if (ONLY_USE_PRELOADED_DECKS) {
        decks = JSON.parse(decksJSON);
    }

    if (deckNum) {
        selectedDeck = decks[deckNum];
    } else {
        selectedDeck = decks[0];
    }

    if (selectedDeck && allScriptsLoaded) {
        setFlashDeck();
        unflipCard();
        setFlashTitle();
        changeTypeQuiz(selectedDeck);
        resetTestPage();
        // resetTermQuestion(); // for the terminal questions
    }
}

retrieveDecks();

function changeDeck(index) {
    selectedDeck = decks[index];

    if (!selectedDeck) {
        loadDecks(0);
        resetTermQuestion();
        return;
    }

    flashDeckIndex = 0; // for the flash cards
    setFlashDeck();
    unflipCard();
    setFlashTitle();

    loadDecks(index); // for the deck manager page

    changeTypeQuiz(selectedDeck); // for the terminal-based learning function
}



function addDeck(deck) {
    decks.push(deck);
    localStorage.setItem("decks", JSON.stringify(decks));

    loadDecks();

}


// localStorage.clear();
