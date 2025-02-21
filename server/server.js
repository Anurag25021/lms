import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import clerkWebhooks from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';

// Initialize Express
const app = express();

// Middleware
app.use(express.json()); // ✅ Correct placement
app.use(cors());
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => res.send("API Working"));
app.post('/clerk', clerkWebhooks);
app.use('/api/educator', educatorRouter);

// Port
const PORT = process.env.PORT || 5000;

// Connect to DB and Start Server
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
}).catch(err => console.error("DB Connection Failed:", err));
