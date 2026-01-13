import { Request, Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';

export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, status } = req.body;

        if (!title || !description) {
            res.status(400).json({ message: "Title and description are required" });
            return;
        }

        const task = await Task.create({
            title,
            description,
            status: status || 'pending',
            userId: req.userId,
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const task = await Task.findOneAndUpdate(
            { _id: id, userId: req.userId },
            req.body,
            { new: true }
        );
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
