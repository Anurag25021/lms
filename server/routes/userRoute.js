import { getUserData, userEnrolledCourses } from "../controllers/userController.js"
import express from 'express'
const userRouter=express.Router()

userRouter.get('/data',getUserData)
userRouter.get('/enrolled-courses',userEnrolledCourses)

export default userRouter