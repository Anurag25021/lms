import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import {clerkWebhooks} from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
//Initalize Express
const app=express()

//Middlewares
app.use(cors())
app.use(clerkMiddleware())

//Route
app.get('/',(req,res)=>res.send("API WORKING"))
app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/educator',express.json(),educatorRouter)
//Portu
const PORT =process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
      connectCloudinary();
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  });