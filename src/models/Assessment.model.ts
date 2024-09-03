import pool from '../config/db';

export interface Assessment {
  id?: number;
  question: string;
  answer: string;
  contentId: number;
  createdAt?: Date;
}

export const createAssessment = async (assessment: Assessment): Promise<Assessment> => {
  const [result] = await pool.query('INSERT INTO assessments SET ?', assessment);
  return { id: (result as any).insertId, ...assessment };
};
