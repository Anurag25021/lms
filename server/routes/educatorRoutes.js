import express from 'express'
import { updateRoleToEducator } from '../controllers/educatorController'

const educatorRouter =express.Router()

//Add Educator Role
educatorRouter.get('/api/educator/update-role',updateRoleToEducator)

export default educatorRouter;