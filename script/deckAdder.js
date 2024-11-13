

deckAdderForm = {
    inputs: {
        wordsplit: document.getElementById("deckAdderWordSeparator"),
        linesplit: document.getElementById("deckAdderLineSeparator"),
        deck: document.getElementById("deckAdderCardInput"),
        title: document.getElementById("deckAdderTitleInput")
    },
    panel: document.getElementById("deckAdder"),
    cancelButton: document.getElementById("deckAdderCancel"),
    submitButton: document.getElementById("deckAdderSubmit"),
    openButton: document.getElementById("toggleDeckAdder"),
    clearButton: document.getElementById("clearAllDecks")
};

deckAdderForm.openButton.onclick = () => {
    deckAdderForm.panel.classList.toggle("active");
};

deckAdderForm.cancelButton.onclick = () => {
    deckAdderForm.panel.classList.toggle("active");

    for (let inp in deckAdderForm.inputs) {
        deckAdderForm.inputs[inp].value = "";
    }
};

deckAdderForm.submitButton.onclick = () => {
    deckAdderForm.panel.classList.toggle("active");

    let title = deckAdderForm.inputs.title.value;
    let qsplit = deckAdderForm.inputs.deck.value.split(
        (deckAdderForm.inputs.linesplit.value.length == 0) ? "\n" : deckAdderForm.inputs.linesplit.value);

    let wsplit = deckAdderForm.inputs.wordsplit.value;
    if (wsplit.length == 0) wsplit = ":";

    let fqs = [];
    for (let i = 0; i < qsplit.length; i++) {
        let spl = qsplit[i].split(wsplit);
        fqs.push({
            "q": spl[0].trim(),
            "a": spl[1].trim()
        });
    }

    let ndeck = {
        "t": title,
        "qs": fqs
    };

    for (let inp in deckAdderForm.inputs) {
        deckAdderForm.inputs[inp].value = "";
    }

    addDeck(ndeck);
};

deckAdderForm.clearButton.onclick = () => {
    if (confirm("Confirm deletion of all decks?")) {
        localStorage.setItem("decks", "[]");
        loadDecks();
    }
};

