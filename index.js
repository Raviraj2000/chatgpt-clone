import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [{ role: "user", content: message }],
    store: false,
  });
  console.log(response.choices[0].message.content);
  res.json({
    message: response.choices[0].message.content,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
