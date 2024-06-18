import FactoryRepository from "../repositories/factory";

const factoryRepository = new FactoryRepository()

const getFactory = async(id: number) => {
    const factoryResp = await factoryRepository.getFactory(id)

    if (!factoryResp) {
        throw new Error(`factory with ${id} does not exist.`)
    }

    return factoryResp
}

const getFactoryByName = (name: string) => {
    return factoryRepository.getFactoryByName(name)
}

const getFactories = (pageNum: number, pageSize: number) => {
    return factoryRepository.getFactories(pageNum, pageSize)
}

const addFactory = async (name: string) => {


    const factoryExists = await getFactoryByName(name)

    if (factoryExists) {
        throw new Error(`factory with ${name} already exist.`)
    }

    const date = new Date()
    const factory: Factory = {
        id: -1,
        name,
        created_at: date,
        updated_at: date
    }

    return factoryRepository.addFactory(factory)
}

const updateFactory = async (id: number, name: string) => {

    await getFactory(id)

    const date = new Date()
    const factory: Factory = {
        id,
        name,
        created_at: date,
        updated_at: date
    }

    return factoryRepository.updateFactory(factory)
}

const deleteFactory = async (id: number) => {
    await getFactory(id)
    return factoryRepository.deleteFactory(id)
}

export { getFactory, getFactoryByName, getFactories, addFactory, updateFactory, deleteFactory }