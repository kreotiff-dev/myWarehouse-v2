import express from 'express';
import * as controller from '../controllers/CONTROLLER.js';
import { authMiddleware, workerRoleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Применяем middleware аутентификации ко всем маршрутам
router.use(authMiddleware);
// Доступ только для worker и admin
router.use(workerRoleMiddleware);

/**
 * @swagger
 * /route-path:
 *   method:
 *     summary: Описание эндпоинта
 *     description: Детальное описание эндпоинта
 *     tags: [TagName]
 *     security:
 *       - bearerAuth: []
 */

export default router;