import express from 'express';
import { verifyToken } from '../middleware/auth';
import Game from '../models/Game';

const router = express.Router();

// Get all games
router.get('/games', verifyToken, async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching games' });
  }
});

// Add a new game
router.post('/games', verifyToken, async (req, res) => {
  try {
    const game = new Game(req.body);
    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ message: 'Error creating game' });
  }
});

// Update a game
router.put('/games', verifyToken, async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const game = await Game.findByIdAndUpdate(id, updateData, { new: true });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(400).json({ message: 'Error updating game' });
  }
});

// Delete a game
router.delete('/games/:id', verifyToken, async (req, res) => {
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