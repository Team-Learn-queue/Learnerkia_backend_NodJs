import { Router } from 'express';
import { ContentController } from '../controllers/Content.controller';

const router = Router();
const {
  createContent, 
  getContent
} = new ContentController();

router.post('/', createContent);
router.get('/:id', getContent);

export default router;