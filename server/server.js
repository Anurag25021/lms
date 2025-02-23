import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import clerkWebhooks, { stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoute.js';

// Initialize Express
const app = express();

//database
 await connectCloudinary()
// Middleware
app.use(express.json()); // ✅ Correct placement
app.use(cors());
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => res.send("API Working"));
app.post('/clerk', clerkWebhooks);
app.use('/api/educator', educatorRouter);
app.use('/api/course',express.json(),courseRouter)
app.use('/api/user',express.json(),userRouter)
app.post('/stripe',express.raw({type:'application/json'}),stripeWebhooks)
// Port
const PORT = process.env.PORT || 5000;

// Connect to DB and Start Server
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
}).catch(err => console.error("DB Connection Failed:", err));
