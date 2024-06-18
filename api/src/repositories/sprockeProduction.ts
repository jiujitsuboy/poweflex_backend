import {
    Prisma,
    PrismaClient,
} from "@prisma/client";
import prisma from "./prismaClient/client";

class SpRocketProductionRepository {
    private db: PrismaClient<Prisma.PrismaClientOptions, never>;

    constructor(db = prisma) {
        this.db = db;
    }

    getSpRocketProduction = async (id: number) => {
        let spRocketProduction: SpRocketProduction | null = null
        try {
            spRocketProduction = await this.db.sprocket_production.findUnique({
                where: {
                    id
                },
                include: {
                    factory: {
                        select: {
                            name: true
                        }
                    },
                    sprocket: true
                }
            })            
        }
        catch (error) {
            console.log(error)
            throw error
        }
        return spRocketProduction
    }

    getSpRocketProductionByAttributes = async (factoryId: number, spRocketId: number, time: bigint) => {
        let spRocketProduction: SpRocketProduction | null = null
        try {
            spRocketProduction = await this.db.sprocket_production.findFirst({
                where: {
                    factory_id: factoryId,
                    sprocket_id: spRocketId,
                    time
                },
                include: {
                    factory: {
                        select: {
                            name: true
                        }
                    },
                    sprocket: true
                }
            })            
        }
        catch (error) {
            console.log(error)
            throw error
        }
        return spRocketProduction
    }

    getSpRocketsProduction = async (pageNum: number, pageSize: number) => {
        let spRocketsProduction: SpRocketProductionsPaginated | null = null
        try {
            const totalRows = await this.db.sprocket_production.count()
            const spRocketsProductionDb = await this.db.sprocket_production.findMany({
                skip: pageNum * pageSize,
                take: pageSize,
                include: {
                    factory: {
                        select: {
                            name: true
                        }                        
                    },
                    sprocket: true
                }
            })

            spRocketsProduction = {
                factories: spRocketsProductionDb,
                pageNum,
                totalRows
            }
        }
        catch (error) {
            console.log(error)
            throw error
        }
        return spRocketsProduction
    }

    getSpRocketProductionByFactory = async (factoryName: string, pageNum: number, pageSize: number) => {
        let spRocketsProduction: SpRocketProductionsPaginated | null = null
        try {
            const totalRows = await this.db.sprocket_production.count({
                where: {
                    factory: {
                        name: factoryName
                    }
                }
            })
            const spRocketsProductionDb = await this.db.sprocket_production.findMany({
                skip: pageNum * pageSize,
                take: pageSize,
                where: {
                    factory: {
                        name: factoryName
                    }
                },
                include: {
                    factory: {
                        select: {
                            name: true
                        }                        
                    },
                    sprocket: true
                }
            })

            // if (spRocketsProductionDb && spRocketsProductionDb.length > 0) {
            //     for (const spRocketProduction of spRocketsProductionDb) {
            //         spRocketProduction.factory_id = spRocketProduction.factory.id
            //         spRocketProduction.sprocket_id = spRocketProduction.sprocket_id

            //     }
            // }

            spRocketsProduction = {
                factories: spRocketsProductionDb,
                pageNum,
                totalRows
            }
        }
        catch (error) {
            console.log(error)
            throw error
        }
        return spRocketsProduction
    }

    addSpRocketProduction = async (spRocketProduction: SpRocketProduction) => {
        return this.db.sprocket_production.create({
            data: {
                factory_id: spRocketProduction.factory_id,
                sprocket_id: spRocketProduction.sprocket_id,
                goal: spRocketProduction.goal,
                actual: spRocketProduction.actual,
                time: spRocketProduction.time
            }
        })
    }

    updateSpRocketProduction = async (spRocketProduction: SpRocketProduction) => {
        return this.db.sprocket_production.update({
            where: {
                id: spRocketProduction.id
            },
            data: {
                factory_id: spRocketProduction.factory_id,
                sprocket_id: spRocketProduction.sprocket_id,
                goal: spRocketProduction.goal,
                actual: spRocketProduction.actual,
                time: spRocketProduction.time
            }
        })
    }

    deleteSpRocketProduction = async (id: number) => {
        return this.db.sprocket_production.delete({
            where: {
                id
            }
        })
    }
}

export default SpRocketProductionRepository