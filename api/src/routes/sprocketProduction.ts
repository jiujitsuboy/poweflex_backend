import express from 'express'
import { addSpRocketProductionController, deleteSpRocketProductionController, getSpRocketProductionByFactoryController, getSpRocketProductionController, getSpRocketsProductionController, updateSpRocketProductionController } from '../controllers/sprocketProduction'
import authMiddleware from '../middleware/auth'

const routerSpRocketProduction = express.Router()

routerSpRocketProduction.get('/sprocketproduction/:id', authMiddleware, getSpRocketProductionController)
routerSpRocketProduction.get('/sprocketsproduction', authMiddleware, getSpRocketsProductionController)
routerSpRocketProduction.get('/sprocketsproduction/:name', authMiddleware, getSpRocketProductionByFactoryController)
routerSpRocketProduction.post('/sprocketproduction', authMiddleware, addSpRocketProductionController)
routerSpRocketProduction.put('/sprocketproduction', authMiddleware, updateSpRocketProductionController)
routerSpRocketProduction.delete('/sprocketproduction/:id', authMiddleware, deleteSpRocketProductionController)

export default routerSpRocketProduction