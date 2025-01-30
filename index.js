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
  const { message, currModel } = req.body;
  const prompt = {
    model: currModel,
    messages: [{ role: "user", content: message }],
    store: false,
  };
  console.log(prompt);
  const response = await openai.chat.completions.create(prompt);
  console.log(response.choices[0].message.content);
  res.json({
    message: response.choices[0].message.content,
  });
});

app.get("/models", (req, res) => {
  openai.models.list().then((data) => {
    models: res.json(data);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
