import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import {clerkWebhooks} from './controllers/webhooks.js'
//Initalize Express
const app=express()

//cpnnect to database

await connectDB()

//Middlewares
app.use(cors())

//Route
app.get('/',(req,res)=>res.send("API WORKING"))
app.post('/clerk', express.json(), clerkWebhooks)
//Port
const PORT =process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
