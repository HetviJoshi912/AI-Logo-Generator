const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

app.post("/generate-logo", async (req, res) => {

    try {

        const {

            brandName,
            description,
            industry,
            audience

        } = req.body;

        if (
            !brandName ||
            !description ||
            !industry ||
            !audience
        ) {

            return res.status(400).json({

                error: "Please fill all fields."

            });

        }

        const prompt = `

You are a professional logo designer.

Generate EXACTLY THREE completely different logo concepts.

Brand Name:
${brandName}

Brand Description:
${description}

Industry:
${industry}

Target Audience:
${audience}

Return ONLY valid JSON.

The JSON must look EXACTLY like this:

{
  "concepts":[
    {
      "name":"",
      "rationale":"",
      "symbol":"",
      "colors":"",
      "typography":"",
      "svg":"<svg>...</svg>"
    },
    {
      "name":"",
      "rationale":"",
      "symbol":"",
      "colors":"",
      "typography":"",
      "svg":"<svg>...</svg>"
    },
    {
      "name":"",
      "rationale":"",
      "symbol":"",
      "colors":"",
      "typography":"",
      "svg":"<svg>...</svg>"
    }
  ]
}

Rules:

1. Return ONLY JSON.

2. Do NOT use markdown.

3. Do NOT use triple backticks.

4. SVG must be valid.

5. SVG width 300.

6. SVG height 300.

7. Use simple geometric SVG shapes.

`;

        const result = await model.generateContent(prompt);

        const response = result.response.text();

        let data;
         try {

            data = JSON.parse(response);

        } catch (error) {

            console.log("Invalid JSON from Gemini");

            return res.status(500).json({

                error: "Gemini returned an invalid response."

            });

        }

        res.json(data);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            error: "Failed to generate logo."

        });

    }

});

app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});