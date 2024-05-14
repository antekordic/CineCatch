import { Request, Response, NextFunction } from 'express';
import { UserModel } from './models/user.model';
import asyncHandler from 'express-async-handler';

// Funktion zum Hinzufügen eines Films zur ToWatch-Liste
export const addToWatch = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId, movieId } = req.params;
    const user = await UserModel.findById(userId);

    if (!user) {
        res.status(404).send('User not found!');
        return;
    }

    // Prüfen, ob der Film bereits in der Liste ist
    if (!user.toWatch.includes(movieId)) {
        user.toWatch.push(movieId);
        await user.save();
        res.status(200).send('Movie added to toWatch list');
    } else {
        res.status(400).send('Movie already in toWatch list');
    }
});

// Funktion zum Hinzufügen eines Films und einer Bewertung zur Watched-Map
export const addWatched = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId, movieId, rating } = req.params;
    const user = await UserModel.findById(userId);

    if (!user) {
        res.status(404).send('User not found!');
        return;
    }

    // Prüfen, ob der Film bereits bewertet wurde
    if (!user.watched.has(movieId)) {
        user.watched.set(movieId, Number(rating));
        await user.save();
        res.status(200).send('Movie added to watched list with rating');
    } else {
        res.status(400).send('Movie already rated');
    }
});