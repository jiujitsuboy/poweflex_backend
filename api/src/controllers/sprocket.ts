import { Request, Response, NextFunction } from 'express'
import { isNumber } from '../utils'
import { PAGE_SIZE } from '../constants'
import { addSpRocket, deleteSpRocket, getSpRocket, getSpRocketByAttributes, getSpRockets, updateSpRocket } from '../services/sprocket'

const getSpRocketController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id

        const sprocketResp = await getSpRocketById(id)

        res.json(sprocketResp)
    }
    catch (error) {
        next(error)
    }
}

const getSpRocketById = async (id: string) => {

    if (!isNumber(id)) {
        throw new Error("id must be a positive number.")
    }
    return await getSpRocket(+id)

}

const getSpRocketsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = req.query.page || 0
        const size = req.query.size || PAGE_SIZE

        if (typeof page === 'string' && !isNumber(page)) {
            throw new Error("page must be a positive number.")
        }

        if (typeof size === 'string' && !isNumber(size)) {
            throw new Error("size must be a positive number.")
        }

        const sprocketsResp = await getSpRockets(+page, +size)
        res.json(sprocketsResp)
    }
    catch (error) {
        next(error)
    }
}

const addSpRocketController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { teeth, pitchDiameter, outsideDiameter, pitch } = req.body

        const params = [{ name: 'teeth', value: teeth },
        { name: 'pitchDiameter', value: pitchDiameter },
        { name: 'outsideDiameter', value: outsideDiameter },
        { name: 'pitch', value: pitch }]

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
            errorMsg += `The following sprocket attributes cannot be empty. ${errorRequired.join(", ")}. \n`
        }
        if (errorType.length > 0) {
            errorMsg += `The following sprocket attributes must be a positive number. ${errorType.join(", ")}`
        }

        if (errorMsg.trim().length > 0) {
            throw new Error(errorMsg)
        }

        const spRocketResp = await addSpRocket(+teeth, +pitchDiameter, +outsideDiameter, +pitch)
        res.json(spRocketResp)
    }
    catch (error) {
        next(error)
    }
}

const updateSpRocketController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, teeth, pitchDiameter, outsideDiameter, pitch } = req.body

        const params = [
            { name: 'id', value: id },
            { name: 'teeth', value: teeth },
            { name: 'pitchDiameter', value: pitchDiameter },
            { name: 'outsideDiameter', value: outsideDiameter },
            { name: 'pitch', value: pitch }]
        const error = []

        for (const param of params) {
            if (!isNumber(param.value)) {
                error.push(param.name)
            }
        }

        if (error.length > 0) {
            throw new Error(`The following sprocket attributes must be a positive number. ${error.join(", ")}`)
        }

        const spRocketResp = await updateSpRocket(+id, +teeth, +pitchDiameter, +outsideDiameter, +pitch)
        res.json(spRocketResp)
    }
    catch (error) {
        next(error)
    }
}

const deleteSpRocketController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id

        if (!isNumber(id)) {
            throw new Error("id must be a positive number.")
        }

        const spRocketResp = await deleteSpRocket(+id)
        res.json(spRocketResp)
    }
    catch (error) {
        next(error)
    }
}

export { getSpRocketController, getSpRocketsController, addSpRocketController, updateSpRocketController, deleteSpRocketController }