import SpRocketProductionRepository from "../repositories/sprockeProduction";
import { getFactory } from "./factory";
import { getSpRocket } from "./sprocket";

type FactoryData = {
    name: string
    spRockets: Map<number, SpRocketProductionData[]>
}

type SpRocketProductionData = {
    goal: number
    actual: number
    time: bigint
}

const spRocketProductionRepository = new SpRocketProductionRepository()

const getSpRocketProduction = async (id: number) => {
    const sprocketResp = await spRocketProductionRepository.getSpRocketProduction(id)
    if (!sprocketResp) {
        throw new Error(`sprocketProduction with ${id} does not exist.`)
    }

    return formatSpRocketProductions([sprocketResp])
}

const getSpRocketProductionByAttributes = (factoryId: number, spRocketId: number, time: bigint) => {
    return spRocketProductionRepository.getSpRocketProductionByAttributes(factoryId, spRocketId, time)
}

const getSpRocketProductionByFactory = async (factoryId: number, pageNum: number, pageSize: number) => {
    const spRocketsProduction = await spRocketProductionRepository.getSpRocketProductionByFactory(factoryId, pageNum, pageSize)
    return formatSpRocketProductions(spRocketsProduction.factories)
}

const addSpRocketProduction = async (factoryId: number, sprocketId: number, goal: number, actual: number, time: bigint) => {
    await getSpRocket(sprocketId)
    await getFactory(factoryId)

    const spRocketProductionExists = await getSpRocketProductionByAttributes(factoryId, sprocketId, time)

    if (spRocketProductionExists) {
        throw new Error(`sprocket with factoryId: ${factoryId}, sprocketId: ${sprocketId}, time: ${time} already exist.`)
    }
    const spRocketProduction: SpRocketProduction = {
        id: -1,
        factory_id: factoryId,
        sprocket_id: sprocketId,
        goal,
        actual,
        time
    }
    return spRocketProductionRepository.addSpRocketProduction(spRocketProduction)
}

const updateSpRocketProduction = async (id: number, factoryId: number, sprocketId: number, goal: number, actual: number, time: bigint) => {
    await getSpRocketProduction(id)
    await getSpRocket(sprocketId)
    await getFactory(factoryId)

    const spRocketProduction: SpRocketProduction = {
        id,
        factory_id: factoryId,
        sprocket_id: sprocketId,
        goal,
        actual,
        time
    }

    return spRocketProductionRepository.updateSpRocketProduction(spRocketProduction)
}

const deleteSpRocketProduction = async (id: number) => {
    await getSpRocketProduction(id)
    return spRocketProductionRepository.deleteSpRocketProduction(id)
}

const getSpRocketsProduction = async (pageNum: number, pageSize: number) => {
    const spRocketsProduction = await spRocketProductionRepository.getSpRocketsProduction(pageNum, pageSize)
    return formatSpRocketProductions(spRocketsProduction.factories)
}

const formatSpRocketProductions = (spRocketsProduction: SpRocketProduction[]) => {
    const factoryMap = new Map<number, FactoryData>()
    const factories = []

    if (spRocketsProduction.length > 0) {
        for (const rocketProduction of spRocketsProduction) {
            const factoryId = rocketProduction.factory_id
            const spRocketId = rocketProduction.sprocket_id

            const factorySpRockets = factoryMap.get(factoryId)
            if (factorySpRockets) {
                const spRocketProduction = factorySpRockets.spRockets.get(spRocketId)
                if (spRocketProduction) {
                    spRocketProduction.push({ goal: rocketProduction.goal, actual: rocketProduction.actual, time: rocketProduction.time })
                }
                else {
                    factorySpRockets.spRockets.set(spRocketId, [{ goal: rocketProduction.goal, actual: rocketProduction.actual, time: rocketProduction.time }])
                }
            }
            else {
                const spRocketMapInit = new Map<number, SpRocketProductionData[]>()
                spRocketMapInit.set(spRocketId, [{ goal: rocketProduction.goal, actual: rocketProduction.actual, time: rocketProduction.time }])
                const factoryData: FactoryData = {
                    name: rocketProduction.factory!.name,
                    spRockets: spRocketMapInit
                }
                factoryMap.set(factoryId, factoryData)
            }
        }

        const factoriesKeys = Array.from(factoryMap.keys())

        for (const factoryId of factoriesKeys) {
            const factoryData = factoryMap.get(factoryId)

            const spRocketsKeys = Array.from(factoryData!.spRockets.keys())

            for (const spRocketId of spRocketsKeys) {
                const spRocketProductionData = factoryData!.spRockets.get(spRocketId)
                const factory = {
                    factory: {
                        name: factoryData!.name,
                        spRocketId: spRocketId,
                        char_data: {
                            sprocket_production_actual: spRocketProductionData?.map(productionData => productionData.actual),
                            sprocket_production_goal: spRocketProductionData?.map(productionData => productionData.goal),
                            time: spRocketProductionData?.map(productionData => productionData.time),
                        }

                    }
                }
                factories.push(factory)
            }

        }        
    }

    return {
        factories: factories
    }
}

export { getSpRocketProduction, getSpRocketProductionByAttributes, getSpRocketsProduction, getSpRocketProductionByFactory, addSpRocketProduction, updateSpRocketProduction, deleteSpRocketProduction }