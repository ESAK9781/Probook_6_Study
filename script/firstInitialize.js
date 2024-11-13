// The sole purpose of this script is to initialize certain essential variables and funtions necessary
// for the rest of the startup process

var allScriptsLoaded = false;
const ONLY_USE_PRELOADED_DECKS = true;

function shuffle(array) { // shuffles array, implementing changes on the original copy of the array
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