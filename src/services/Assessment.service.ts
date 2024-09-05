import { Assessment } from "../models/Assessment.model";
import { Assignment } from "../models/Assignment.model";
import { contentService } from "./Content.service";
import { CustomError, ErrorType } from "../middlewares/CustomError.middleware";

class AssessmentService {
  async generateAndAssignQuestions(
    contentId: number,
    learnerIds: number[],
    groupId?: number
  ): Promise<void> {
    const content = await contentService.findContentById(contentId);
    if (!content?.data)
      throw new CustomError(ErrorType.NOT_FOUND, "Content not found", 400);

    const questions = await contentService.generateQuestionsFromContent(
      content.data
    );

    for (const question of questions) {
      const assessment = await Assessment.create({
        question,
        answer: "", // AI can generate or instructor can add
        contentId: content.id!,
      });

      for (const learnerId of learnerIds) {
        await Assignment.create({
          learnerId,
          assessmentId: assessment.id!,
          groupId,
        });
      }
    }

    // return questions;
  }
}

export const assessmentService = new AssessmentService();
