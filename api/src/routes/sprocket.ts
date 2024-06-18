import express from 'express'
import { addSpRocketController, deleteSpRocketController, getSpRocketController, getSpRocketsController, updateSpRocketController } from '../controllers/sprocket'
import authMiddleware from '../middleware/auth'

const routerSpRocket = express.Router()

routerSpRocket.get('/sprocket/:id', authMiddleware, getSpRocketController)
routerSpRocket.get('/sprockets', authMiddleware, getSpRocketsController)
routerSpRocket.post('/sprocket', authMiddleware, addSpRocketController)
routerSpRocket.put('/sprocket', authMiddleware, updateSpRocketController)
routerSpRocket.delete('/sprocket/:id', authMiddleware, deleteSpRocketController)

export default routerSpRocket