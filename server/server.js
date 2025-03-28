import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js'
const app = express();

app.use(cors());

// Connect to database
connectDB().then(() => {
    console.log("MongoDB Connected");
}).catch(err => {
    console.error("Database connection error:", err);
});

// Define API route
app.get('/', (req, res) => res.send('API working'));
app.post('/clerk',express.json(),clerkWebhooks)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
