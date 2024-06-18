import prisma from "../repositories/prismaClient/client";
import { getPrismaMock } from "../repositories/prismaClient/singleton"
import { factories, spRockets, spRocketsProduction } from "../repositories/prismaClient/testData"
import { addSpRocketProduction, deleteSpRocketProduction, getSpRocketProduction, getSpRocketProductionByFactory, getSpRocketsProduction, updateSpRocketProduction } from "./sprocketProduction";

jest.mock("../repositories/prismaClient/client")

const prismaMock = getPrismaMock(prisma)

describe("with SpRocketProduction", () => {
    it("get all of them", async () => {
        //given
        prismaMock.sprocket_production.count.mockResolvedValue(spRocketsProduction.length)
        prismaMock.sprocket_production.findMany.mockResolvedValue(spRocketsProduction)

        //when
        const spRocketsProductionPaginated = await getSpRocketsProduction(0, 10)

        //then        
        expect(spRocketsProductionPaginated).toBeTruthy()
    })
    it("fail to get them all", async () => {
        prismaMock.sprocket_production.count.mockImplementation(() => {
            throw new Error("database connection rejected");
        })

        await expect(getSpRocketsProduction(0, 10)).rejects.toThrow('database connection rejected');
    })
    it("get SpRocketProduction by id", async () => {
        //given
        const spRocketProductionElement = spRocketsProduction[spRocketsProduction.length - 1]
        prismaMock.sprocket_production.findUnique.mockResolvedValue(spRocketProductionElement)

        //when
        const spRocketProductionResp = await getSpRocketProduction(spRocketProductionElement.id)

        //then
        expect(spRocketProductionResp).toBeTruthy()
        expect(spRocketProductionResp?.factories.length).toBe(1)
        expect(spRocketProductionResp?.factories[0].factory.name).toBe(spRocketProductionElement.factory?.name)
        expect(spRocketProductionResp?.factories[0].factory.spRocketId).toBe(spRocketProductionElement.sprocket?.id)

    })
    it("fail to get spRocketProduction by id", async () => {
        //given
        prismaMock.sprocket_production.findUnique.mockImplementation(() => {
            throw new Error("database connection rejected");
        })

        //when
        await expect(getSpRocketProduction(spRocketsProduction[spRocketsProduction.length - 1].id)).rejects.toThrow('database connection rejected');

    })
    it("spRocketProduction with id does not exists", async () => {
        //given
        prismaMock.sprocket_production.findUnique.mockResolvedValue(null)
        const id = spRocketsProduction[spRocketsProduction.length - 1].id
        //when

        await expect(getSpRocketProduction(id)).rejects.toThrow(`sprocketProduction with ${id} does not exist.`);

    })
    it("get SpRocketProduction by factory name", async () => {
        //given

        const factoryProduction = spRocketsProduction.filter((_, index) => index === spRocketsProduction.length - 1)
        const spRocketProductionElement = factoryProduction[0]
        prismaMock.sprocket_production.count.mockResolvedValue(factoryProduction.length)
        prismaMock.sprocket_production.findMany.mockResolvedValue(factoryProduction)

        //when
        const spRocketProductionResp = await getSpRocketProductionByFactory(spRocketProductionElement.factory!.name, 0, 10)

        //then
        expect(spRocketProductionResp).toBeTruthy()
        expect(spRocketProductionResp?.factories.length).toBe(1)
        expect(spRocketProductionResp?.factories[0].factory.name).toBe(spRocketProductionElement.factory?.name)
        expect(spRocketProductionResp?.factories[0].factory.spRocketId).toBe(spRocketProductionElement.sprocket?.id)

    })
    it("fail to get spRocketProduction by factory name", async () => {
        //given
        prismaMock.sprocket_production.count.mockImplementation(() => {
            throw new Error("database connection rejected");
        })
        const factoryProduction = spRocketsProduction.filter((_, index) => index === spRocketsProduction.length - 1)
        const spRocketProductionElement = factoryProduction[0]

        //when
        await expect(getSpRocketProductionByFactory(spRocketProductionElement.factory!.name, 0, 10)).rejects.toThrow('database connection rejected');

    })
    it("create new spRocketProduction", async () => {
        //given
        const newSpRocketProduction = {
            id: 3,
            factory_id: 1,
            sprocket_id: 1,
            actual: 10,
            goal: 12,
            time: BigInt(11122345),
            factory: factories[0],
            sprocket: spRockets[0]

        }
        prismaMock.factory.findUnique.mockResolvedValue(factories[factories.length - 1])
        prismaMock.sprocket.findUnique.mockResolvedValue(spRockets[spRockets.length - 1])
        prismaMock.sprocket_production.findFirst.mockResolvedValue(null)
        prismaMock.sprocket_production.create.mockResolvedValueOnce(newSpRocketProduction)

        //when
        const spRocketProductionResp = await addSpRocketProduction(newSpRocketProduction.factory_id, newSpRocketProduction.sprocket_id, newSpRocketProduction.goal, newSpRocketProduction.actual, newSpRocketProduction.time)

        //then
        expect(spRocketProductionResp).toBeTruthy()
        expect(spRocketProductionResp.factory_id).toBe(newSpRocketProduction.factory_id)
        expect(spRocketProductionResp.sprocket_id).toBe(newSpRocketProduction.sprocket_id)
        expect(spRocketProductionResp.goal).toBe(newSpRocketProduction.goal)
        expect(spRocketProductionResp.actual).toBe(newSpRocketProduction.actual)
        expect(spRocketProductionResp.time).toBe(newSpRocketProduction.time)
    })
    it("fail create new, spRocketProduction already exists", async () => {
        //given

        const newSpRocketProduction = {
            id: 3,
            factory_id: 1,
            sprocket_id: 1,
            actual: 10,
            goal: 12,
            time: BigInt(11122345),
            factory: factories[0],
            sprocket: spRockets[0]

        }
        prismaMock.factory.findUnique.mockResolvedValue(factories[factories.length - 1])
        prismaMock.sprocket.findUnique.mockResolvedValue(spRockets[spRockets.length - 1])
        prismaMock.sprocket_production.findFirst.mockResolvedValue(newSpRocketProduction)

        //when
        await expect(addSpRocketProduction(newSpRocketProduction.factory_id, newSpRocketProduction.sprocket_id, newSpRocketProduction.goal, newSpRocketProduction.actual, newSpRocketProduction.time))
            .rejects
            .toThrow(`sprocket with factoryId: ${newSpRocketProduction.factory_id}, sprocketId: ${newSpRocketProduction.sprocket_id}, time: ${newSpRocketProduction.time} already exist.`);
    })
    it("fail to validate spRocketProduction existance", async () => {
        //given

        const newSpRocketProduction = {
            id: 3,
            factory_id: 1,
            sprocket_id: 1,
            actual: 10,
            goal: 12,
            time: BigInt(11122345),
            factory: factories[0],
            sprocket: spRockets[0]

        }
        prismaMock.factory.findUnique.mockResolvedValue(factories[factories.length - 1])
        prismaMock.sprocket.findUnique.mockResolvedValue(spRockets[spRockets.length - 1])
        prismaMock.sprocket_production.findFirst.mockImplementation(() => {
            throw new Error("database connection rejected");
        })

        //when
        await expect(addSpRocketProduction(newSpRocketProduction.factory_id, newSpRocketProduction.sprocket_id, newSpRocketProduction.goal, newSpRocketProduction.actual, newSpRocketProduction.time))
            .rejects.toThrow('database connection rejected');
    })    
    it("udpate existing spRocketProduction", async () => {
        //given

        const existingSpRocketProduction = {
            id: 2,
            factory_id: 1,
            sprocket_id: 1,
            actual: 10,
            goal: 12,
            time: BigInt(11122345),
            factory: factories[0],
            sprocket: spRockets[0]
        }
        prismaMock.factory.findUnique.mockResolvedValue(factories[factories.length - 1])
        prismaMock.sprocket.findUnique.mockResolvedValue(spRockets[spRockets.length - 1])
        prismaMock.sprocket_production.findUnique.mockResolvedValue(existingSpRocketProduction)
        prismaMock.sprocket_production.update.mockResolvedValueOnce(existingSpRocketProduction)

        //when
        const spRocketProductionResp = await updateSpRocketProduction(existingSpRocketProduction.id, existingSpRocketProduction.factory_id, existingSpRocketProduction.sprocket_id, existingSpRocketProduction.goal, existingSpRocketProduction.actual, existingSpRocketProduction.time)

        //then
        expect(spRocketProductionResp).toBeTruthy()
        expect(spRocketProductionResp.factory_id).toBe(existingSpRocketProduction.factory_id)
        expect(spRocketProductionResp.sprocket_id).toBe(existingSpRocketProduction.sprocket_id)
        expect(spRocketProductionResp.goal).toBe(existingSpRocketProduction.goal)
        expect(spRocketProductionResp.actual).toBe(existingSpRocketProduction.actual)
        expect(spRocketProductionResp.time).toBe(existingSpRocketProduction.time)
    })
    it("delete existing spRocketProduction", async () => {
        //given

        const id = 2
        const existingSpRocketProduction = {
            id: 2,
            factory_id: 1,
            sprocket_id: 1,
            actual: 10,
            goal: 12,
            time: BigInt(11122345),
            factory: factories[0],
            sprocket: spRockets[0]
        }

        const spRocketToDelete = spRocketsProduction[spRocketsProduction.length - 1]
        prismaMock.sprocket_production.findUnique.mockResolvedValue(existingSpRocketProduction)
        prismaMock.sprocket_production.delete.mockResolvedValueOnce(spRocketToDelete)

        //when
        const spRocketProductionResp = await deleteSpRocketProduction(id)

        //then
        expect(spRocketProductionResp).toBeTruthy()
        expect(spRocketProductionResp.factory_id).toBe(spRocketToDelete.factory_id)
        expect(spRocketProductionResp.sprocket_id).toBe(spRocketToDelete.sprocket_id)
        expect(spRocketProductionResp.goal).toBe(spRocketToDelete.goal)
        expect(spRocketProductionResp.actual).toBe(spRocketToDelete.actual)
        expect(spRocketProductionResp.time).toBe(spRocketToDelete.time)
    })    
})