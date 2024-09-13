// import cohere from 'cohere-ai';
// import { Content } from "../models/Content.model";
// import { CustomError, ErrorType } from "../middlewares/CustomError.middleware";

// class ContentService {
//   async generateContent(
//     title: string,
//     type: "video" | "audio" | "document",
//     instructorId: number
//   ): Promise<Content> {
//     let cohereResponse;

//     try {

//       switch (type) {
//         case "document":
//           // @ts-ignore
//           cohereResponse = await cohere.generate({
//             model: 'command-xlarge-2023',
//             prompt: `Write a detailed document about the topic: ${title}`,
//             max_tokens: 1000,
//             api_key: process.env.COHERE_API_KEY!,  // Pass API key here
//           });
//           break;
//         case "video":
//         case "audio":
//           // @ts-ignore
//           cohereResponse = await cohere.generate({
//             model: 'command-xlarge-2023',
//             prompt: `Create an outline with key points for a ${type} on the topic: ${title}`,
//             max_tokens: 500,
//             api_key: process.env.COHERE_API_KEY!,  // Pass API key here
//           });
//           break;
//         default:
//           throw new CustomError(
//             ErrorType.BAD_REQUEST,
//             "Invalid content type",
//             400
//           );
//       }

//       const contentData = cohereResponse.body.generations[0].text.trim();
//       console.log("contentData:", contentData);

//       const content = await Content.create({
//         title,
//         type,
//         data: contentData,
//         instructorId,
//       });
//       console.log("content", content);
//       return content;
//     } catch (error: any) {
//       throw new CustomError(
//         ErrorType.INTERNAL_SERVER,
//         `Failed to generate content: ${error.message}`,
//         500
//       );
//     }
//   }

//   async findContentById(id: number): Promise<Content | null> {
//     try {
//       const content = await Content.findByPk(id);
//       if (!content)
//         throw new CustomError(ErrorType.NOT_FOUND, "Content not found", 404);

//       return content;
//     } catch (error: any) {
//       throw new CustomError(
//         ErrorType.INTERNAL_SERVER,
//         `Error retrieving content: ${error.message}`,
//         500
//       );
//     }
//   }

//   async generateQuestionsFromContent(contentData: string): Promise<string[]> {
//     try {
//       // @ts-ignore
//       const cohereResponse = await cohere.generate({
//         model: 'command-xlarge-2023',
//         prompt: `Generate 5 quiz questions based on the following content: ${contentData}`,
//         max_tokens: 300,
//         api_key: process.env.COHERE_API_KEY!,  // Pass API key here
//       });

//       return cohereResponse.body.generations[0].text
//         .trim()
//         .split("\n")
//         .filter((q: string | any[]) => q.length > 0);
//     } catch (error: any) {
//       throw new CustomError(
//         ErrorType.INTERNAL_SERVER,
//         `Error generating questions from content: ${error.message}`,
//         500
//       );
//     }
//   }
// }

// export const contentService = new ContentService();
