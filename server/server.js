import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';

const app = express();
app.use(cors());
app.use(express.json()); // Middleware for JSON parsing

// Connect to database
connectDB();

// Define API route
app.get('/', (req, res) => res.send('API working'));
app.post('/clerk', clerkWebhooks);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
