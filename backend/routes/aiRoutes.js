// backend/routes/aiRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 🔵 Route 1 — General Ask AI (Already exists, keep this)
router.post('/ask-ai', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiMessage = response.data.choices[0].message.content;
    res.json({ reply: aiMessage });

  } catch (error) {
    console.error("❗ Error communicating with OpenAI:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Error message:", error.message);
    }
    res.status(500).json({ error: "Failed to get response from AI" });
  }
});

// 🟣 Route 2 — New AI Insights Route
router.post('/ai-insights', async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  try {
    const insightsPrompt = `
You are an expert ticket reviewer. Given the following ticket details, suggest:

- A better title
- A better description
- 2 action suggestions if applicable.

Ticket Title: ${title}
Ticket Description: ${description}

Reply clearly, structured, and helpful.
`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: insightsPrompt }],
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiSuggestions = response.data.choices[0].message.content;
    res.json({ insights: aiSuggestions });

  } catch (error) {
    console.error("❗ Error communicating with OpenAI (Insights):");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Error message:", error.message);
    }
    res.status(500).json({ error: "Failed to get AI insights" });
  }
});

module.exports = router;
