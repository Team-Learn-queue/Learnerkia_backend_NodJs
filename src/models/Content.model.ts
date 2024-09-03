import pool from '../config/db';

export interface Content {
  id?: number;
  title: string;
  type: 'video' | 'audio' | 'document';
  data: string;
  instructorId: number;
  createdAt?: Date;
}

export const createContent = async (content: Content): Promise<Content> => {
  const [result] = await pool.query('INSERT INTO contents SET ?', content);
  return { id: (result as any).insertId, ...content };
};

export const findContentById = async (id: number): Promise<Content | null> => {
  const [rows] = await pool.query('SELECT * FROM contents WHERE id = ?', [id]);
  return (rows as Content[])[0] || null;
};
