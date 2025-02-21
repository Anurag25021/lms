import express from 'express'
import { updateRoleToEducator } from '../controllers/educatorController'

const educatorRouter =express.Router()

//Add Educator Role
educatorRouter.post('/update-role',updateRoleToEducator)

export default educatorRouter;