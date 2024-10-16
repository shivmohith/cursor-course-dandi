import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

const outputSchema = z.object({
  summary: z.string().describe("A concise summary of the README content"),
  cool_facts: z.array(z.string()).describe("A list of interesting facts about the repository"),
});

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema);

export async function summarizeReadme(readmeContent) {
  const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0 });

  const prompt = PromptTemplate.fromTemplate(`
    Summarize the content of the following README:

    {readmeContent}

    {format_instructions}
  `);

  const chain = RunnableSequence.from([
    {
      readmeContent: (input) => input.readmeContent,
      format_instructions: () => outputParser.getFormatInstructions(),
    },
    prompt,
    model.withStructuredOutput(outputSchema),
  ]);

  const response = await chain.invoke({ readmeContent });

  return response;
}
