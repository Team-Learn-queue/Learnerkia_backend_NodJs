import { createAssessment } from '../models/Assessment.model';
import { createAssignment } from '../models/Assignment.model';
import { contentService } from '../services/Content.service'

class AssessmentService {
  async generateAndAssignQuestions(contentId: number, learnerIds: number[], groupId?: number): Promise<void> {
    const content = await contentService.findContentById(contentId);
    if (!content) throw new Error('Content not found');

    const questions = await contentService.generateQuestionsFromContent(content.data);

    for (const question of questions) {
      const assessment = await createAssessment({
        question,
        answer: '', // AI can generate or instructor can add
        contentId: content.id!,
      });

      for (const learnerId of learnerIds) {
        await createAssignment({
          learnerId,
          assessmentId: assessment.id!,
          groupId,
        });
      }
    }
  }
}

export const assessmentService = new AssessmentService();
