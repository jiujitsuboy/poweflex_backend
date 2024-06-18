import express, { Request, Response, NextFunction } from 'express'
import { addFactoryController, deleteFactoryController, getFactoriesController, getFactoryController, updateFactoryController } from '../controllers/factory'
import authMiddleware from '../middleware/auth'

const routerFactory = express.Router()

routerFactory.get('/factory/:id', authMiddleware, getFactoryController)
routerFactory.get('/factories', authMiddleware, getFactoriesController)
routerFactory.post('/factory', authMiddleware, addFactoryController)
routerFactory.put('/factory', authMiddleware, updateFactoryController)
routerFactory.delete('/factory/:id', authMiddleware, deleteFactoryController)

export default routerFactory