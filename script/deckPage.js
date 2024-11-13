


function loadDecks(deckNum) { // the index of the currently selected deck
    retrieveDecks(deckNum);
    
    let cont = document.getElementById("deckListBody")
    cont.innerHTML = "";

    for (let i = 0; i < decks.length; i++) {
        cont.innerHTML += `
        <div class="deckResult">
            <div class="deckListTitle">
                <p>${decks[i].t}</p>
            </div>
            <div class="deckListSize">
                <p>${decks[i].qs.length}</p>
            </div>
            <div class="deckListSelection">
                <p>${(decks[i] == selectedDeck) ? "&#x2713" : ""}</p>
            </div>
        </div>`;
    }
    
    for (let i = 0; i < cont.children.length; i++) {
        cont.children[i].onclick = (ev) => {
            changeDeck(i);
        };
    }
}

loadDecks();