import { Content, createContent, findContentById } from '../models/Content.model';
import { OpenAI } from 'openai';

class ContentService {
  private openAI: OpenAI;

  constructor() {
    this.openAI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    });
  }

  async generateContent(title: string, type: 'video' | 'audio' | 'document', instructorId: number): Promise<Content> {
    let aiResponse;

    switch (type) {
      case 'document':
        aiResponse = await this.openAI.completions.create({
          model: 'text-davinci-003',
          prompt: `Create a detailed document on the topic: ${title}`,
          max_tokens: 1500,
        });
        break;
      case 'video':
      case 'audio':
        aiResponse = await this.openAI.completions.create({
          model: 'text-davinci-003',
          prompt: `Outline key points for a ${type} on the topic: ${title}`,
          max_tokens: 1000,
        });
        break;
    }

    const contentData = aiResponse.choices[0].text.trim();
    const content = await createContent({ title, type, data: contentData, instructorId });
    return content;
  }

  async findContentById(id: number): Promise<Content | null> {
    return await findContentById(id);
  }

  async generateQuestionsFromContent(contentData: string): Promise<string[]> {
    const aiResponse = await this.openAI.completions.create({
      model: 'text-davinci-003',
      prompt: `Generate 5 quiz questions based on the following content: ${contentData}`,
      max_tokens: 500,
    });

    return aiResponse.choices[0].text.trim().split('\n').filter((q: string | any[]) => q.length > 0);
  }
}

export const contentService = new ContentService();
