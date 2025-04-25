import express from 'express';
import { register, login, getProfile, createUserAsAdmin } from '../controllers/auth.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Публичные маршруты для аутентификации
router.post('/register', register);
router.post('/login', login);

// Защищенные маршруты - требуют аутентификации
router.get('/profile', authMiddleware, getProfile);

// Маршруты только для администраторов
router.post('/admin/create-user', authMiddleware, roleMiddleware(['admin']), createUserAsAdmin);

export default router;