import express from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Game from '../models/Game';
import {
  getGames,
  getGame,
  createGame,
  updateGame,
  deleteGame
} from '../controllers/gameController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

// Middleware to verify admin token
const verifyAdminToken = (req: Request, res: Response, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Public routes
router.get('/games', async (req: Request, res: Response) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching games' });
  }
});

// Admin routes
router.post('/admin/games', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const game = new Game(req.body);
    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ message: 'Error creating game' });
  }
});

router.put('/admin/games/:id', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(400).json({ message: 'Error updating game' });
  }
});

router.delete('/admin/games/:id', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting game' });
  }
});

export default router; 