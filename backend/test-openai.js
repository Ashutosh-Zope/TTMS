require('dotenv').config();
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function testOpenAI() {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello, who are you?" }],
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ OpenAI Test Response:");
    console.log(response.data.choices[0].message.content);
  } catch (error) {
    console.error("❗ Error testing OpenAI:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Error message:", error.message);
    }
  }
}

testOpenAI();
