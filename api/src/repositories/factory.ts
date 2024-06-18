import {
    Prisma,
    PrismaClient,
} from "@prisma/client";
import prisma from "./prismaClient/client";

class FactoryRepository {
    private db: PrismaClient<Prisma.PrismaClientOptions, never>;

    constructor(db = prisma) {
        this.db = db;
    }

    getFactory = async (id: number) => {
        let factory: Factory | null = null
        try {
            factory = await this.db.factory.findUnique({
                where: {
                    id
                },
                include: {
                    sprocket_production: {
                        include: {
                            factory: true,
                            sprocket: true
                        }
                    }
                }
            })
        }
        catch (error) {
            console.log(error)
            throw error
        }

        return factory
    }

    getFactoryByName = async (name: string) => {
        let factory: Factory | null = null
        try {
            factory = await this.db.factory.findUnique({
                where: {
                    name
                },
                include: {
                    sprocket_production: {
                        include: {
                            factory: true,
                            sprocket: true
                        }
                    }
                }
            })
        }
        catch (error) {
            console.log(error)
            throw error
        }

        return factory
    }

    getFactories = async (pageNum: number, pageSize: number) => {
        let factories: FactoriesPaginated | null = null
        try {
            const totalRows = await this.db.factory.count()
            const factoriesDb = await this.db.factory.findMany({
                skip: pageNum * pageSize,
                take: pageSize,
                include: {
                    sprocket_production: {
                        include: {
                            factory: true,
                            sprocket: true
                        }
                    }
                }
            })

            factories = {
                factories: factoriesDb,
                pageNum,
                totalRows
            }
        }
        catch (error) {
            console.log(error)
            throw error
        }
        return factories
    }

    addFactory = async (factory: Factory) => {
        console.log("factory repo: ", factory.name)
        return this.db.factory.create({
            data: {
                name: factory.name
            }
        })
    }

    updateFactory = async (factory: Factory) => {
        return this.db.factory.update({
            where: {
                id: factory.id
            },
            data: {
                name: factory.name,
                updated_at: factory.updated_at
            }
        })
    }

    deleteFactory = async (id: number) => {
        return this.db.factory.delete({
            where: {
                id
            }
        })
    }
}

export default FactoryRepository