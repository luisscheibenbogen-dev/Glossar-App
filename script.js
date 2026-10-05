const sheetURL =
  "https://docs.google.com/spreadsheets/d/1ZVg2Pi6hWLDqu0arILF5QJzbwREFmcCxYfHxSOksar0/gviz/tq?tqx=out:csv&gid=0";

const glossar = document.getElementById("glossar");
const suche = document.getElementById("suche");

let begriffe = [];

// Daten aus Google Sheets laden
async function datenLaden() {
    try {
        const response = await fetch(sheetURL);
        const text = await response.text();

        begriffe = csvVerarbeiten(text);

        anzeigen(begriffe);

    } catch (fehler) {
        console.error("Fehler beim Laden:", fehler);

        glossar.innerHTML =
            "<p>Die Glossardaten konnten nicht geladen werden.</p>";
    }
}

// CSV-Daten verarbeiten
function csvVerarbeiten(text) {

    const zeilen = text.trim().split("\n");

    // Erste Zeile = Überschriften, deshalb slice(1)
    return zeilen.slice(1).map(zeile => {

        const spalten = zeile.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);

        if (!spalten) return null;

        const sauber = spalten.map(wert =>
            wert.replace(/^"|"$/g, "").replace(/""/g, '"')
        );

        return {
            name: sauber[0] || "",
            definition: sauber[1] || "",
            kategorie: sauber[2] || ""
        };
    }).filter(Boolean);
}

// Begriffe anzeigen
function anzeigen(liste) {

    glossar.innerHTML = "";

    liste.forEach(begriff => {

        const element = document.createElement("div");

        element.className = "begriff";

        element.innerHTML = `
            <h2>${begriff.name}</h2>
            <p>${begriff.definition}</p>
            <small>Kategorie: ${begriff.kategorie}</small>
        `;

        glossar.appendChild(element);
    });
}

// Suchfunktion
suche.addEventListener("input", function() {

    const suchtext = suche.value.toLowerCase();

    const ergebnis = begriffe.filter(begriff =>
        begriff.name.toLowerCase().includes(suchtext) ||
        begriff.definition.toLowerCase().includes(suchtext) ||
        begriff.kategorie.toLowerCase().includes(suchtext)
    );

    anzeigen(ergebnis);
});

// Beim Start Daten laden
datenLaden();
