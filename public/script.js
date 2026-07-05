const form = document.getElementById("logoForm");
const results = document.getElementById("results");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    results.innerHTML = `
        <div class="card">
            <h2>Generating Logo Concepts...</h2>
            <p>Please wait a few seconds.</p>
        </div>
    `;

    const brandName = document.getElementById("brandName").value.trim();
    const description = document.getElementById("description").value.trim();
    const industry = document.getElementById("industry").value.trim();
    const audience = document.getElementById("audience").value.trim();

    try {

        const response = await fetch("/generate-logo", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                brandName,
                description,
                industry,
                audience

            })

        });

        const data = await response.json();

        if (!response.ok) {

            results.innerHTML = `
                <div class="card">
                    <h2>Error</h2>
                    <p>${data.error}</p>
                </div>
            `;

            return;

        }

        displayConcepts(data.concepts);

    }

    catch (error) {

        console.error(error);

        results.innerHTML = `
            <div class="card">
                <h2>Error</h2>
                <p>Unable to connect to server.</p>
            </div>
        `;

    }

});

function displayConcepts(concepts) {

    results.innerHTML = "";

    concepts.forEach((concept, index) => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `

            <h2>Logo Concept ${index + 1}</h2>

            <h3>${concept.name}</h3>

            <h3>Design Rationale</h3>

            <p>${concept.rationale}</p>

            <h3>Symbol Meaning</h3>

            <p>${concept.symbol}</p>

            <h3>Color Recommendation</h3>

            <p>${concept.colors}</p>

            <h3>Typography</h3>

            <p>${concept.typography}</p>

            <h3>SVG Preview</h3>

            <div class="svg-container">

                ${concept.svg}

            </div>

            <button class="downloadBtn">

                Download SVG

            </button>

        `;

        const button = card.querySelector(".downloadBtn");

        button.addEventListener("click", () => {

            downloadSVG(

                concept.svg,

                concept.name.replace(/\s+/g, "_") + ".svg"

            );

        });

        results.appendChild(card);

    });

}

function downloadSVG(svgContent, fileName) {

    const blob = new Blob(

        [svgContent],

        {

            type: "image/svg+xml"

        }

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = fileName;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

}