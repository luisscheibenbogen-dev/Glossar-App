const begriffe = [
    {
        name: "HTML",
        definition: "HTML bestimmt den Inhalt und die Struktur einer Webseite."
    },
    {
        name: "CSS",
        definition: "CSS bestimmt das Aussehen und Design einer Webseite."
    },
    {
        name: "JavaScript",
        definition: "JavaScript ermöglicht interaktive Funktionen auf Webseiten."
    },
    {
        name: "GitHub",
        definition: "GitHub ist eine Plattform zur Verwaltung und Veröffentlichung von Programmcode."
    }
];

const glossar = document.getElementById("glossar");
const suche = document.getElementById("suche");

function anzeigen(liste) {

    glossar.innerHTML = "";

    liste.forEach(begriff => {

        const element = document.createElement("div");

        element.className = "begriff";

        element.innerHTML = `
            <h2>${begriff.name}</h2>
            <p>${begriff.definition}</p>
        `;

        glossar.appendChild(element);
    });
}

anzeigen(begriffe);

suche.addEventListener("input", function() {

    const suchtext = suche.value.toLowerCase();

    const ergebnis = begriffe.filter(begriff =>
        begriff.name.toLowerCase().includes(suchtext) ||
        begriff.definition.toLowerCase().includes(suchtext)
    );

    anzeigen(ergebnis);
});
