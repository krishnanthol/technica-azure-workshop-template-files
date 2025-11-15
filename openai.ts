//sample prompt
import { openaiClient } from "./app";
import dotenv from "dotenv";

dotenv.config();

const sampleFunction = async () => {
    const DEPLOYMENT_NAME = process.env.AZURE_OPENAI_DEPLOYMENT;

    try {
    const completion = await openaiClient.chat.completions.create({
      model: DEPLOYMENT_NAME!,
      messages: [
        {
          role: "system",
          content:
            "System Prompt",
        },
        {
          role: "user",
          content: "User Prompt",
        },
      ],
      max_tokens: 500,
      temperature: 0.5,
    });

    const text = completion.choices[0]?.message?.content ?? "";
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
