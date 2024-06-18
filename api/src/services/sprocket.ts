import SpRocketRepository from "../repositories/sprocket";

const spRocketRepository = new SpRocketRepository()

const getSpRocket = async(id: number) => {
    const sprocketResp = await spRocketRepository.getSpRocket(id)

    if (!sprocketResp) {
        throw new Error(`sprocket with ${id} does not exist.`)
    }

    return sprocketResp
}

const getSpRocketByAttributes = (teeth: number, pitchDiameter: number, outsideDiameter: number, pitch: number) => {
    return spRocketRepository.getSpRocketByAttributes(teeth, pitchDiameter, outsideDiameter, pitch)
}

const getSpRockets = (pageNum: number, pageSize: number) => {
    return spRocketRepository.getSpRockets(pageNum, pageSize)
}

const addSpRocket = async (teeth: number, pitchDiameter: number, outsideDiameter: number, pitch: number) => {

    const spRocketExists = await getSpRocketByAttributes(teeth, pitchDiameter, outsideDiameter, pitch)

    if (spRocketExists) {
        throw new Error(`sprocket with teeth: ${teeth}, pitchDiameter: ${pitchDiameter}, outsideDiameter: ${outsideDiameter}, pitch: ${pitch} already exist.`)
    }

    const spRocket: SpRocket = {
        id: -1,
        teeth,
        pitch_diameter: pitchDiameter,
        outside_diameter: outsideDiameter,
        pitch
    }
    return spRocketRepository.addSpRocket(spRocket)
}

const updateSpRocket = async(id: number, teeth: number, pitchDiameter: number, outsideDiameter: number, pitch: number) => {
    await getSpRocket(id)

    const spRocket: SpRocket = {
        id,
        teeth,
        pitch_diameter: pitchDiameter,
        outside_diameter: outsideDiameter,
        pitch
    }
    return spRocketRepository.updateSpRocket(spRocket)
}

const deleteSpRocket = async(id: number) => {
    await getSpRocket(id)
    
    return spRocketRepository.deleteSpRocket(id)
}

export { getSpRocket, getSpRocketByAttributes, getSpRockets, addSpRocket, updateSpRocket, deleteSpRocket }