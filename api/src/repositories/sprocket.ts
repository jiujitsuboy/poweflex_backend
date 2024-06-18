import {
    Prisma,
    PrismaClient,
} from "@prisma/client";
import prisma from "./prismaClient/client";

class SpRocketRepository {
    private db: PrismaClient<Prisma.PrismaClientOptions, never>;

    constructor(db = prisma) {
        this.db = db;
    }

    getSpRocket = async (id: number) => {
        let spRocket: SpRocket | null = null
        try {
            spRocket = await this.db.sprocket.findUnique({
                where: {
                    id
                }                
            })

        }
        catch (error) {
            console.log(error)
            throw error
        }
        return spRocket
    }

    getSpRocketByAttributes = async (teeth: number, pitchDiameter: number, outsideDiameter: number, pitch: number) => {
        let spRocket: SpRocket | null = null
        try {
            spRocket = await this.db.sprocket.findFirst({
                where: {
                    teeth,
                    pitch_diameter: pitchDiameter,
                    outside_diameter: outsideDiameter,
                    pitch
                }
            })
        }
        catch (error) {
            console.log(error)
            throw error
        }
        return spRocket
    }

    getSpRockets = async (pageNum: number, pageSize: number) => {
        let spRockets: SpRocketPaginated | null = null
        try {
            const totalRows = await this.db.sprocket.count()
            const spRocketsDb = await this.db.sprocket.findMany({
                skip: pageNum * pageSize,
                take: pageSize
            })

            spRockets = {
                spRockets: spRocketsDb,
                pageNum,
                totalRows
            }
        }
        catch (error) {
            console.log(error)
            throw error
        }
        return spRockets
    }

    addSpRocket = async (spRocket: SpRocket) => {
        return this.db.sprocket.create({
            data: {
                teeth: spRocket.teeth,
                pitch_diameter: spRocket.pitch_diameter,
                outside_diameter: spRocket.outside_diameter,
                pitch: spRocket.pitch
            }
        })
    }

    updateSpRocket = async (spRocket: SpRocket) => {
        return this.db.sprocket.update({
            where: {
                id: spRocket.id
            },
            data: {
                teeth: spRocket.teeth,
                pitch_diameter: spRocket.pitch_diameter,
                outside_diameter: spRocket.outside_diameter,
                pitch: spRocket.pitch
            }
        })
    }

    deleteSpRocket = async (id: number) => {
        return this.db.sprocket.delete({
            where: {
                id
            }
        })
    }
}

export default SpRocketRepository