import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { MongoMemoryServer } from 'mongodb-memory-server';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
});

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`Connected to MongoDB: ${conn.connection.host}`);
    } catch (err) {
        console.log("Local MongoDB connection failed. Attempting to start in-memory MongoDB...");
        try {
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            console.log(`In-memory MongoDB started at ${uri}`);
            await mongoose.connect(uri);
            console.log('Connected to In-memory MongoDB');
        } catch (memoryErr) {
            console.error('Fatal: Could not connect to any MongoDB instance.', memoryErr);
            process.exit(1);
        }
    }
};

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
