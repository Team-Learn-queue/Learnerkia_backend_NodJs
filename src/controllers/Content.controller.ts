// import { Request, Response, NextFunction } from 'express';
// import { contentService } from '../services/Content.service';
// import { CustomError, ErrorType } from '../middlewares/CustomError.middleware';
// import { ResponseHandler } from '../middlewares/ResponseHandler.middlewares';


// export class ContentController {
//   async createContent(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const { title, type, instructorId } = req.body;

//       if (!title || !type || !instructorId) {
//         throw new CustomError(
//           ErrorType.BAD_REQUEST,
//           'Missing required fields: title, type, or instructorId.',
//           400
//         );
//       }

//       const content = await contentService.generateContent(title, type, instructorId);

//       console.log("content in controller file", content)

//       ResponseHandler.success(res, content, "Content created successfully.", 201);
//     } catch (error) {
//       next(error); 
//     }
//   }

//   async getContent(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const { id } = req.params;
//       const content = await contentService.findContentById(parseInt(id));

//       if (!content) {
//         throw new CustomError(
//           ErrorType.NOT_FOUND, 
//           'Content not found.', 
//           404
//         );
//       }
      
//       ResponseHandler.success(res, content, "Content retrieved successfully.");
//     } catch (error) {
//       next(error)
//     }
//   }
// }
