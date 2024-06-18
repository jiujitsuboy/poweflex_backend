import { Request, Response, NextFunction } from 'express'
import { isNumber } from '../utils'
import { PAGE_SIZE } from '../constants'
import { addSpRocketProduction, deleteSpRocketProduction, getSpRocketProduction, getSpRocketProductionByAttributes, getSpRocketProductionByFactory, getSpRocketsProduction, updateSpRocketProduction } from '../services/sprocketProduction'

const getSpRocketProductionController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id

        const sprocketResp = await getSpRocketProductionById(id)

        res.json(sprocketResp)
    }
    catch (error) {
        next(error)
    }
}

const getSpRocketProductionById = async (id: string) => {

    if (!isNumber(id)) {
        throw new Error("id must be a positive number.")
    }
    return await getSpRocketProduction(+id)

}

const getSpRocketProductionByFactoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const name = req.params.name
        const page = req.query.page || 0
        const size = req.query.size || PAGE_SIZE

        if(!name){
            throw new Error("name must be not blank.")
        }

        if (typeof page === 'string' && !isNumber(page)) {
            throw new Error("page must be a positive number.")
        }

        if (typeof size === 'string' && !isNumber(size)) {
            throw new Error("size must be a positive number.")
        }

        const sprocketsResp = await getSpRocketProductionByFactory(name.toString(), +page, +size)
        res.json(sprocketsResp)
    }
    catch (error) {
        next(error)
    }
}
const getSpRocketsProductionController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = req.query.page || 0
        const size = req.query.size || PAGE_SIZE

        if (typeof page === 'string' && !isNumber(page)) {
            throw new Error("page must be a positive number.")
        }

        if (typeof size === 'string' && !isNumber(size)) {
            throw new Error("size must be a positive number.")
        }

        const sprocketsResp = await getSpRocketsProduction(+page, +size)
        res.json(sprocketsResp)
    }
    catch (error) {
        next(error)
    }
}

const addSpRocketProductionController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { factoryId, sprocketId, goal, actual, time } = req.body

        const params = [{ name: 'factoryId', value: factoryId },
        { name: 'sprocketId', value: sprocketId },
        { name: 'goal', value: goal },
        { name: 'actual', value: actual },
        { name: 'time', value: time }]

        const errorRequired = []
        const errorType = []
        let errorMsg = ''



        for (const param of params) {
            if (!param.value) {
                errorRequired.push(param.name)
            }
            else if (!isNumber(param.value)) {
                errorType.push(param.name)
            }
        }

        if (errorRequired.length > 0) {
            errorMsg += `The following sprocketProduction attributes cannot be empty. ${errorRequired.join(", ")}. \n`
        }
        if (errorType.length > 0) {
            errorMsg += `The following sprocketProduction attributes must be a positive number. ${errorType.join(", ")}`
        }

        if (errorMsg.trim().length > 0) {
            throw new Error(errorMsg)
        }

        const spRocketResp = await addSpRocketProduction(+factoryId, +sprocketId, +goal, +actual, BigInt(time))
        res.json(spRocketResp)
    }
    catch (error) {
        next(error)
    }
}

const updateSpRocketProductionController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, factoryId, sprocketId, goal, actual, time } = req.body

        const params = [
            { name: 'id', value: id },
            { name: 'factoryId', value: factoryId },
            { name: 'sprocketId', value: sprocketId },
            { name: 'goal', value: goal },
            { name: 'actual', value: actual },
            { name: 'time', value: time }]
        const error = []

        for (const param of params) {
            if (!isNumber(param.value)) {
                error.push(param.name)
            }
        }

        if (error.length > 0) {
            throw new Error(`The following sprocketProduction attributes must be a positive number. ${error.join(", ")}`)
        }

        const spRocketResp = await updateSpRocketProduction(+id, +factoryId, +sprocketId, +goal, +actual, BigInt(time))
        res.json(spRocketResp)
    }
    catch (error) {
        next(error)
    }
}

const deleteSpRocketProductionController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id

        const spRocketExists = await getSpRocketProductionById(id)

        if (!spRocketExists) {
            throw new Error(`sprocketProduction with ${id} does not exist.`)
        }

        const spRocketResp = await deleteSpRocketProduction(+id)
        res.json(spRocketResp)
    }
    catch (error) {
        next(error)
    }
}

export { getSpRocketProductionController, getSpRocketsProductionController, getSpRocketProductionByFactoryController, addSpRocketProductionController, updateSpRocketProductionController, deleteSpRocketProductionController }