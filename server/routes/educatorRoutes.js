import express from 'express';
import { updateRoleToEducator } from '../controllers/educatorController.js';

const educatorRouter = express.Router();

// Use PATCH or PUT for updates instead of GET
educatorRouter.patch('/update-role', updateRoleToEducator);

export default educatorRouter;
