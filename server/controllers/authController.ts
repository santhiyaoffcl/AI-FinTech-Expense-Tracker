import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { getDB, saveDB, UserDoc } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fintech_secret_key_2026_change_in_production';

// Demo seed helper so user can test instantly with demo account if desired
export const ensureDemoUser = async () => {
  const db = getDB();
  const demoEmail = 'demo@fintech.com';
  let user = db.users.find((u) => u.email === demoEmail);

  if (!user) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('demo1234', salt);
    user = {
      id: 'demo-user-id',
      name: 'Alex Morgan',
      email: demoEmail,
      passwordHash,
      monthlyBudget: 3500,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);

    // Add demo expenses
    const now = new Date();
    const currYear = now.getFullYear();
    const currMonth = String(now.getMonth() + 1).padStart(2, '0');

    db.expenses.push(
      {
        id: 'exp-1',
        userId: 'demo-user-id',
        title: 'Weekly Organic Grocery',
        amount: 145.5,
        category: 'Food',
        date: `${currYear}-${currMonth}-02`,
        notes: 'Whole Foods organic fruits & veggies',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'exp-2',
        userId: 'demo-user-id',
        title: 'Metro Monthly Pass',
        amount: 85.0,
        category: 'Transport',
        date: `${currYear}-${currMonth}-03`,
        notes: 'Public transit subway card',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'exp-3',
        userId: 'demo-user-id',
        title: 'Electric & Heating Bill',
        amount: 112.3,
        category: 'Bills',
        date: `${currYear}-${currMonth}-05`,
        notes: 'Power utility payment',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'exp-4',
        userId: 'demo-user-id',
        title: 'Tech Headphones Purchase',
        amount: 220.0,
        category: 'Shopping',
        date: `${currYear}-${currMonth}-08`,
        notes: 'Wireless noise cancelling headphones',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'exp-5',
        userId: 'demo-user-id',
        title: 'Pharmacy & Vitamin Supply',
        amount: 45.0,
        category: 'Medical',
        date: `${currYear}-${currMonth}-10`,
        notes: 'Health supplement checkup',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'exp-6',
        userId: 'demo-user-id',
        title: 'Online Fintech Course',
        amount: 120.0,
        category: 'Education',
        date: `${currYear}-${currMonth}-12`,
        notes: 'Algorithmic trading & personal finance module',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'exp-7',
        userId: 'demo-user-id',
        title: 'Weekend Cinema & Dining',
        amount: 78.5,
        category: 'Entertainment',
        date: `${currYear}-${currMonth}-15`,
        notes: 'Dinner and movie with friends',
        createdAt: new Date().toISOString(),
      }
    );

    // Add demo incomes
    db.incomes.push(
      {
        id: 'inc-1',
        userId: 'demo-user-id',
        source: 'Salary',
        amount: 4200.0,
        date: `${currYear}-${currMonth}-01`,
        description: 'Monthly Senior Dev Paycheck',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'inc-2',
        userId: 'demo-user-id',
        source: 'Freelancing',
        amount: 850.0,
        date: `${currYear}-${currMonth}-10`,
        description: 'React UI Consulting Gig',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'inc-3',
        userId: 'demo-user-id',
        source: 'Investment',
        amount: 180.0,
        date: `${currYear}-${currMonth}-14`,
        description: 'Stock Portfolio Dividend Payout',
        createdAt: new Date().toISOString(),
      }
    );

    await saveDB();
  }
};

export const register = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, password, monthlyBudget } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    const db = getDB();
    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: UserDoc = {
      id: 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      name,
      email: email.toLowerCase(),
      passwordHash,
      monthlyBudget: Number(monthlyBudget) || 3000,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    await saveDB();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        monthlyBudget: newUser.monthlyBudget,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Registration failed.' });
  }
};

export const login = async (req: AuthenticatedRequest, res: Response) => {
  try {
    await ensureDemoUser();
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const db = getDB();
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        monthlyBudget: user.monthlyBudget,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Login failed.' });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const db = getDB();
    const user = db.users.find((u) => u.id === userId);

    if (!user) {
      res.status(404).json({ success: false, message: 'User profile not found.' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        monthlyBudget: user.monthlyBudget,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching profile.' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, email, monthlyBudget } = req.body;

    const db = getDB();
    const userIndex = db.users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      res.status(404).json({ success: false, message: 'User profile not found.' });
      return;
    }

    if (name) db.users[userIndex].name = name;
    if (email) {
      // Check duplicate
      const duplicate = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== userId);
      if (duplicate) {
        res.status(400).json({ success: false, message: 'Email address already in use by another account.' });
        return;
      }
      db.users[userIndex].email = email.toLowerCase();
    }
    if (monthlyBudget !== undefined && !isNaN(Number(monthlyBudget))) {
      db.users[userIndex].monthlyBudget = Number(monthlyBudget);
    }

    await saveDB();

    const updated = db.users[userIndex];
    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        monthlyBudget: updated.monthlyBudget,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error updating profile.' });
  }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Current password and new password are required.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
      return;
    }

    const db = getDB();
    const user = db.users.find((u) => u.id === userId);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await saveDB();

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error changing password.' });
  }
};
