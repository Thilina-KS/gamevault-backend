import { Request, Response } from 'express';
import Game from '../models/Game';

interface IGame {
  title: string;
  steamPrice: number;
  price: number;
  genres: string[];
  platforms: string[];
  image: string;
  description: string;
}

// @desc    Get all games
// @route   GET /api/games
// @access  Public
export const getGames = async (req: Request, res: Response) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching games' });
  }
};

// @desc    Get game by ID
// @route   GET /api/games/:id
// @access  Public
export const getGame = async (req: Request, res: Response) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game' });
  }
};

// @desc    Create a game
// @route   POST /api/games
// @access  Private/Admin
export const createGame = async (req: Request, res: Response) => {
  try {
    const gameData: IGame = req.body;
    const game = new Game(gameData);
    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ message: 'Error creating game' });
  }
};

// @desc    Update a game
// @route   PUT /api/games/:id
// @access  Private/Admin
export const updateGame = async (req: Request, res: Response) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(400).json({ message: 'Error updating game' });
  }
};

// @desc    Delete a game
// @route   DELETE /api/games/:id
// @access  Private/Admin
export const deleteGame = async (req: Request, res: Response) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting game' });
  }
};

// @desc    Search games
// @route   GET /api/games/search
// @access  Public
export const searchGames = async (req: Request, res: Response) => {
  try {
    const { query, genre, platform, minPrice, maxPrice } = req.query;
    
    let filter: any = {};
    
    // Search by title
    if (query) {
      filter.title = { $regex: query, $options: 'i' };
    }
    
    // Filter by genre
    if (genre) {
      filter.genre = { $in: [genre] };
    }
    
    // Filter by platform
    if (platform) {
      filter.platform = { $in: [platform] };
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      filter.discountedPrice = {};
      if (minPrice) filter.discountedPrice.$gte = Number(minPrice);
      if (maxPrice) filter.discountedPrice.$lte = Number(maxPrice);
    }
    
    const games = await Game.find(filter);
    res.json(games);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message });
  }
}; 