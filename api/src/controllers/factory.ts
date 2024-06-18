import { Request, Response, NextFunction } from 'express'
import { addFactory, deleteFactory, getFactories, getFactory, getFactoryByName, updateFactory } from '../services/factory'
import { isNumber } from '../utils'
import { PAGE_SIZE } from '../constants'

const getFactoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id

        const factoryResp = await getFactoryById(id)

        res.json(factoryResp)
    }
    catch (error) {
        next(error)
    }
}

const getFactoryById = async (id: string) => {

    if (!isNumber(id)) {
        throw new Error("id must be a positive number.")
    }
    return await getFactory(+id)

}

const getFactoriesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = req.query.page || 0
        const size = req.query.size || PAGE_SIZE

        if (typeof page === 'string' && !isNumber(page)) {
            throw new Error("page must be a positive number.")
        }

        if (typeof size === 'string' && !isNumber(size)) {
            throw new Error("size must be a positive number.")
        }

        const factoriesResp = await getFactories(+page, +size)
        res.json(factoriesResp)
    }
    catch (error) {
        next(error)
    }
}

const addFactoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const name: string = req.body.name

        if (name.length === 0) {
            throw new Error("name must be a non empty string.")
        }

        const factoriesResp = await addFactory(name)
        res.json(factoriesResp)
    }
    catch (error) {
        next(error)
    }
}

const updateFactoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, name } = req.body

        if (!isNumber(id)) {
            throw new Error("id must be a positive number.")
        }

        if (name.length === 0) {
            throw new Error("name must be a non empty string.")
        }

        const factoriesResp = await updateFactory(+id, name)
        res.json(factoriesResp)
    }
    catch (error) {
        next(error)
    }
}

const deleteFactoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id

        if (!isNumber(id)) {
            throw new Error("id must be a positive number.")
        }

        const factoriesResp = await deleteFactory(+id)
        res.json(factoriesResp)
    }
    catch (error) {
        next(error)
    }
}

export { getFactoryController, getFactoriesController, addFactoryController, updateFactoryController, deleteFactoryController }