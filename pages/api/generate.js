import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const kiddoNationality = req.body.kiddo || '';
  if (kiddoNationality.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid nationality",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(kiddoNationality),
      temperature: 0.6,
      stop: ["Kid:", "Names:"],
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(kiddo) {
  const capitalizedKiddo =
      kiddo[0].toUpperCase() + kiddo.slice(1).toLowerCase();
  return `Suggest three trending names for a kid depending on nationality and gender.

Kid: Kazakh, Boy
Names: Azamat, Ansar, Sayat
Kid: Kazakh, Girl
Names: Anelya, Nurzhahan, Aigul
Kid: Israeli, Boy
Names: Aaron, German, Yosef
Kid: Israeli, Girl
Names: Fatma, Ayshe, Hatijah
Kid: ${capitalizedKiddo}
Names:`;
}
