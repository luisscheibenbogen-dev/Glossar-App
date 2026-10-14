const sheetURL =
  "https://docs.google.com/spreadsheets/d/1ZVg2Pi6hWLDqu0arILF5QJzbwREFmcCxYfHxSOksar0/gviz/tq?tqx=out:csv&gid=0";

const glossar = document.getElementById("glossar");
const suche = document.getElementById("suche");

let begriffe = [];

// Daten aus Google Sheets laden
async function datenLaden() {
    try {
        const response = await fetch(sheetURL + "&_=" + Date.now(), {
  cache: "no-store"
});
        const text = await response.text();

        begriffe = csvVerarbeiten(text);

        glossarFiltern();

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

// Suchfunktion und Kategorie-Filter
// Suchfunktion und Kategorie-Filter
const kategorieFilter = document.getElementById("kategorieFilter");
const kategorieSuche = document.getElementById("kategorieSuche");

// Alle Kategorien speichern
const alleKategorien = Array.from(kategorieFilter.options).map(option => ({
    value: option.value,
    text: option.textContent
}));

// Kategorien durchsuchen
kategorieSuche.addEventListener("input", function() {
    const suchtext = kategorieSuche.value.toLowerCase().trim();

    kategorieFilter.innerHTML = "";

    const treffer = alleKategorien.filter(kategorie =>
        kategorie.value !== "" &&
        kategorie.text.toLowerCase().includes(suchtext)
    );

    // Option "Alle Kategorien" hinzufügen
    const alleOption = document.createElement("option");
    alleOption.value = "";
    alleOption.textContent = "Alle Kategorien";
    kategorieFilter.appendChild(alleOption);

    // Passende Kategorien hinzufügen
    treffer.forEach(kategorie => {
        const option = document.createElement("option");
        option.value = kategorie.value;
        option.textContent = kategorie.text;
        kategorieFilter.appendChild(option);
    });

    // Bei genau einem Treffer automatisch auswählen
    if (suchtext !== "" && treffer.length === 1) {
        kategorieFilter.value = treffer[0].value;
    } else {
        kategorieFilter.value = "";
    }

    glossarFiltern();
});
function glossarFiltern() {
    const suchtext = suche.value.toLowerCase().trim();
    const ausgewaehlteKategorie = kategorieFilter.value;

    const ergebnis = begriffe.filter(begriff => {
        const passtZurSuche =
            begriff.name.toLowerCase().includes(suchtext) ||
            begriff.definition.toLowerCase().includes(suchtext) ||
            begriff.kategorie.toLowerCase().includes(suchtext);

        const passtZurKategorie =
    ausgewaehlteKategorie === "" ||
    begriff.kategorie.trim().toLowerCase() ===
    ausgewaehlteKategorie.toLowerCase();
        return passtZurSuche && passtZurKategorie;
    });

    anzeigen(ergebnis);
}

suche.addEventListener("input", glossarFiltern);
kategorieFilter.addEventListener("change", glossarFiltern);

// Beim Start Daten laden
datenLaden();
// Neue Begriffe in Google Sheets speichern

const scriptURL =
  "https://script.google.com/macros/s/AKfycbzCvfhJ0Vbb0PO4IqphQc1y7M73WeCOrqTgg5f7fBqCqyKBjdeNL6jLxbAxdREn4HJv1Q/exec";

const formular = document.getElementById("begriffForm");

formular.addEventListener("submit", async function(event) {
  event.preventDefault();

  const begriff = document.getElementById("neuerBegriff").value.trim();
  const erklaerung = document.getElementById("neueErklaerung").value.trim();
  const meldung = document.getElementById("meldung");

  const daten = new URLSearchParams();
  daten.append("begriff", begriff);
  daten.append("erklaerung", erklaerung);
  const kategorie = document.getElementById("neueKategorie").value;
daten.append("kategorie", kategorie);
  meldung.textContent = "Wird gespeichert …";

  try {
    await fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",
      body: daten
    });

   meldung.textContent =
  "Anfrage gesendet! Der Begriff wird gleich neu geladen.";

formular.reset();

// Glossar nach dem Speichern mehrmals aktualisieren
let versuche = 0;

const aktualisierung = setInterval(async function() {
  versuche++;

  await datenLaden();

  if (versuche >= 10) {
    clearInterval(aktualisierung);
  }
}, 3000);
  } catch (fehler) {
    meldung.textContent =
      "Fehler beim Senden. Bitte erneut versuchen.";
  }
});
