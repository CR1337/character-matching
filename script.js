let characters = [];
let matching = [];

document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    document.getElementById("addCharacterButton").click();
  }
});

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
}

function addCharacter() {
    const characterName = document.getElementById("characterName").value.trim();

    if (characterName) {
        characters.push(characterName);
        updateCharacterList();
        document.getElementById("characterName").value = "";
    }
}

function clearCharacters() {
    characters = [];
    updateCharacterList();
}

function updateCharacterList() {
    const characterList = document.getElementById("characters");
    characterList.innerHTML = characters.map(character =>
        `<li><button onclick="removeCharacter('${character}')">❌</button> ${character}</li>`
    ).join("");
}

function removeCharacter(character) {
    let index = characters.indexOf(character);
    characters.splice(index, 1);
    updateCharacterList();
}

function downloadCharacters() {
    const data = JSON.stringify(characters, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "knoten.json";
    a.click();
    URL.revokeObjectURL(url);
}

function uploadCharacters() {
    const fileInput = document.getElementById("fileUpload");
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                characters = JSON.parse(e.target.result);
                updateCharacterList();
            } catch (error) {
                alert("Fehler beim Einlesen der Datei.");
            }
        };
        reader.readAsText(file);
    }
}

function generateMatching() {
    if (characters.length < 4) {
        alert("Es muss mindestens vier Charaktere geben, um ein Matching zu erzeugen.");
        return;
    }

    let matchingAmount = document.getElementById("matchingAmount").value;
    const maxMatchingAmount = Math.floor(characters.length / 2) - 1;
    if (matchingAmount > maxMatchingAmount) {
        matchingAmount = maxMatchingAmount;
        alert(`Bei ${characters.length} Charakteren kann es nicht mehr als ${maxMatchingAmount} Matching(s) geben. Die Anzahl der Matchings wurde auf ${maxMatchingAmount} angepasst.`);
    }

    let connections = [];
    for (let i = 0; i < characters.length; i++) {
        connections.push([]);
        for (let j = 0; j < characters.length; j++) {
            if (i == j) continue;
            connections[i].push(j);
        }
    }

    for (let i = 0; i < characters.length; i++) {
        connections[i] = [...connections[i]].sort(() => Math.random() - 0.5)
    }

    for (let k = 0; k < matchingAmount; k++) {
        for (let i = 0; i < characters.length; i++) {
            let s = i;
            let d = connections[i][0];
            connections[i].shift();
            let s_index = connections[d].indexOf(s);
            connections[d].splice(s_index, 1);
            matching.push(`${characters[s]} → ${characters[d]}`);
        }
    }

    document.getElementById("matchingResult").innerHTML = matching.map(pair =>
        `<div>${pair}</div>`
    ).join("");
}

function matchingToClipboard() {
    copyToClipboard(matching.map(pair => `${pair}`).join("\n"));
}
