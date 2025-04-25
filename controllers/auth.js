import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Уникальное имя пользователя
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email пользователя
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Пароль пользователя
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *       400:
 *         description: Ошибка валидации или пользователь уже существует
 */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Проверяем, существует ли уже пользователь
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Пользователь с таким email или именем уже существует' 
      });
    }
    
    // Создаем нового пользователя с хешированным паролем
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // В публичной регистрации роль всегда worker
    const userRole = 'worker';
    
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: userRole
    });
    
    await user.save();
    
    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email пользователя
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT токен
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Неверные учетные данные
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Находим пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }
    
    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }
    
    // Проверяем активен ли аккаунт
    if (!user.isActive) {
      return res.status(401).json({ message: 'Аккаунт деактивирован' });
    }
    
    // Создаем JWT токен
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Обновляем время последнего входа
    user.lastLogin = new Date();
    await user.save();
    
    res.status(200).json({
      message: 'Авторизация успешна',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Получение профиля текущего пользователя
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профиль пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 lastLogin:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Не авторизован
 */
export const getProfile = async (req, res) => {
  try {
    // req.user установлен в middleware auth
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

/**
 * @swagger
 * /auth/admin/create-user:
 *   post:
 *     summary: Создание пользователя с произвольной ролью (только для администраторов)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 description: Уникальное имя пользователя
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email пользователя
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Пароль пользователя
 *               role:
 *                 type: string
 *                 enum: [admin, manager, worker]
 *                 description: Роль пользователя
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *       400:
 *         description: Ошибка валидации или пользователь уже существует
 *       403:
 *         description: Доступ запрещен (нет прав администратора)
 */
export const createUserAsAdmin = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Проверяем, существует ли уже пользователь
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Пользователь с таким email или именем уже существует' 
      });
    }
    
    // Создаем нового пользователя с хешированным паролем
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Используем роль из запроса (доступ к этому эндпоинту только у админов)
    const userRole = role || 'worker';
    
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: userRole
    });
    
    await user.save();
    
    res.status(201).json({
      message: 'Пользователь успешно создан администратором',
      userId: user._id,
      role: userRole
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};