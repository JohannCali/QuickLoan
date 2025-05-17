import { createOpenAI } from "@ai-sdk/openai";
import { LanguageModel } from "ai";
import dotenv from "dotenv";
dotenv.config();

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai_model: LanguageModel = openai(
  "gpt-4o"
);

