import { OpenAI } from "openai";
import { Content } from "../models/Content.model";
import { CustomError, ErrorType } from "../middlewares/CustomError.middleware";

class ContentService {
  private openAI: OpenAI;

  constructor() {
    this.openAI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }

  async generateContent(
    title: string,
    type: "video" | "audio" | "document",
    instructorId: number
  ): Promise<Content> {
    let aiResponse;

    try {
      switch (type) {
        case "document":
          aiResponse = await this.openAI.completions.create({
            model: "gpt-4o-mini",
            prompt: `Create a detailed document on the topic: ${title}`,
            max_tokens: 1500,
          });
          break;
        case "video":
        case "audio":
          aiResponse = await this.openAI.completions.create({
            model: "gpt-4o-mini",
            prompt: `Outline key points for a ${type} on the topic: ${title}`,
            max_tokens: 1000,
          });
          break;
        default:
          throw new CustomError(
            ErrorType.BAD_REQUEST,
            "Invalid content type",
            400
          );
      }

      const contentData = aiResponse.choices[0].text.trim();
      console.log("contentData:", contentData);

      const content = await Content.create({
        title,
        type,
        data: contentData,
        instructorId,
      });
      console.log("content", content);
      return content;
    } catch (error: any) {
      throw new CustomError(
        ErrorType.INTERNAL_SERVER,
        `Failed to generate content: ${error.message}`,
        500
      );
    }
  }

  async findContentById(id: number): Promise<Content | null> {
    try {
      const content = await Content.findByPk(id);
      if (!content)
        throw new CustomError(ErrorType.NOT_FOUND, "Content not found", 404);

      return await Content.findByPk(id);
    } catch (error: any) {
      throw new CustomError(
        ErrorType.INTERNAL_SERVER,
        `Error retrieving content: ${error.message}`,
        500
      );
    }
  }

  async generateQuestionsFromContent(contentData: string): Promise<string[]> {
    try {
      const aiResponse = await this.openAI.completions.create({
        model: "gpt-4o",
        prompt: `Generate 5 quiz questions based on the following content: ${contentData}`,
        max_tokens: 500,
      });

      return aiResponse.choices[0].text
        .trim()
        .split("\n")
        .filter((q: string | any[]) => q.length > 0);
    } catch (error: any) {
      throw new CustomError(
        ErrorType.INTERNAL_SERVER,
        `Error generating questions from content: ${error.message}`,
        500
      );
    }
  }
}

export const contentService = new ContentService();
