type Factory = {
    id: number
    name: string
    created_at: Date
    updated_at: Date
    sprocket?: SpRocket[]
    sprocket_production?: SpRocketProduction[]
}

type SpRocket = {
    id: number
    teeth: number
    pitch_diameter: number
    outside_diameter: number
    pitch: number
}

type SpRocketProduction = {
    id: number
    factory_id: number
    sprocket_id: number
    goal: number
    actual: number
    time: bigint
    factory?: {
        name: string
    }
    sprocket?: SpRocket
}

type FactoriesPaginated = {
    factories: Factory[],
    pageNum: number,
    totalRows: number
}

type SpRocketPaginated = {
    spRockets: SpRocket[],
    pageNum: number,
    totalRows: number
}

type SpRocketProductionsPaginated = {
    factories: SpRocketProduction[],
    pageNum: number,
    totalRows: number
}