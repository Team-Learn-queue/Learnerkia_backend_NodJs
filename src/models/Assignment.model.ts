import pool from '../config/db';

export interface Assignment {
  id?: number;
  learnerId: number;
  assessmentId: number;
  assignedAt?: Date;
  groupId?: number;
}

export const createAssignment = async (assignment: Assignment): Promise<Assignment> => {
  const [result] = await pool.query('INSERT INTO assignments SET ?', assignment);
  return { id: (result as any).insertId, ...assignment };
};