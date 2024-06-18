import prisma from "../repositories/prismaClient/client";
import { getPrismaMock } from "../repositories/prismaClient/singleton"
import { factories } from "../repositories/prismaClient/testData"
import { addFactory, deleteFactory, getFactories, getFactory, getFactoryByName, updateFactory } from "./factory";

jest.mock("../repositories/prismaClient/client")

const prismaMock = getPrismaMock(prisma)

describe("with Factory", () => {
    it("get all of them", async () => {
        //given
        prismaMock.factory.count.mockResolvedValue(factories.length)
        prismaMock.factory.findMany.mockResolvedValue(factories)

        //when
        const factoriesPaginated = await getFactories(0, 10)

        //then
        expect(factoriesPaginated).toBeTruthy()
        expect(factoriesPaginated.totalRows).toBe(factories.length)
    })
    it("fail to get them all", async () => {
        prismaMock.factory.count.mockImplementation(() => {
            throw new Error("database connection rejected");
        })

        await expect(getFactories(0, 10)).rejects.toThrow('database connection rejected');
    })
    it("get factory by id", async () => {
        //given
        prismaMock.factory.findUnique.mockResolvedValue(factories[factories.length - 1])

        //when
        const factoryResp = await getFactory(factories[factories.length - 1].id)

        //then
        expect(factoryResp).toBeTruthy()
        expect(factoryResp?.name).toBe(factories[factories.length - 1].name)
    })
    it("fail to get factory by id", async () => {
        //given
        prismaMock.factory.findUnique.mockImplementation(() => {
            throw new Error("database connection rejected");
        })

        //when

        await expect(getFactory(factories[factories.length - 1].id)).rejects.toThrow('database connection rejected');

    })
    it("factory with id does not exists", async () => {
        //given
        prismaMock.factory.findUnique.mockResolvedValue(null)
        const id = factories[factories.length - 1].id
        //when

        await expect(getFactory(id)).rejects.toThrow(`factory with ${id} does not exist.`);

    })
    it("get factory by name", async () => {
        //given
        prismaMock.factory.findUnique.mockResolvedValue(factories[0])

        //when
        const factoryResp = await getFactoryByName(factories[0].name)

        //then
        expect(factoryResp).toBeTruthy()
        expect(factoryResp?.name).toBe(factories[0].name)
    })
    it("fail to get factory by name", async () => {
        //given
        prismaMock.factory.findUnique.mockImplementation(() => {
            throw new Error("database connection rejected");
        })

        //when
        await expect(getFactoryByName(factories[0].name)).rejects.toThrow('database connection rejected');

    })
    it("create new factory", async () => {
        //given

        const factoryName = "factor3"
        const newFactory = {
            id: 3,
            name: factoryName,
            created_at: new Date("2024-06-17"),
            updated_at: new Date("2024-06-17"),
        }
        prismaMock.factory.create.mockResolvedValueOnce(newFactory)

        //when
        const factoryResp = await addFactory(factoryName)

        //then
        expect(factoryResp).toBeTruthy()
        expect(factoryResp?.id).toBe(newFactory.id)
        expect(factoryResp?.name).toBe(newFactory.name)
        expect(factoryResp?.created_at).toBe(newFactory.created_at)
        expect(factoryResp?.updated_at).toBe(newFactory.updated_at)
    })
    it("fail create new, factory already exists", async () => {
        //given

        const factoryName = "factor3"
        const newFactory = {
            id: 3,
            name: factoryName,
            created_at: new Date("2024-06-17"),
            updated_at: new Date("2024-06-17"),
        }
        prismaMock.factory.findUnique.mockResolvedValue(newFactory)

        //when
        await expect(addFactory(factoryName)).rejects.toThrow(`factory with ${factoryName} already exist.`);
    })
    it("udpate existing factory", async () => {
        //given

        const id = 2
        const factoryName = "factor3"
        const newFactory = {
            id: 2,
            name: factoryName,
            created_at: new Date("2024-06-17"),
            updated_at: new Date("2024-06-18"),
        }
        prismaMock.factory.findUnique.mockResolvedValue(factories[factories.length - 1])
        prismaMock.factory.update.mockResolvedValueOnce(newFactory)

        //when
        const factoryResp = await updateFactory(id, factoryName)

        //then
        expect(factoryResp).toBeTruthy()
        expect(factoryResp?.id).toBe(newFactory.id)
        expect(factoryResp?.name).toBe(newFactory.name)
        expect(factoryResp?.created_at).toBe(newFactory.created_at)
        expect(factoryResp?.updated_at).toBe(newFactory.updated_at)
    })
    it("fail udpate existing, factory does not exists", async () => {
        //given

        const id = 2
        const factoryName = "factor3"        

        //when
        await expect(updateFactory(id, factoryName)).rejects.toThrow(`factory with ${id} does not exist.`);
    })
    it("delete existing factory", async () => {
        //given

        const id = 2
        
        const factoryToDelete = factories[factories.length - 1] 
        prismaMock.factory.findUnique.mockResolvedValue(factoryToDelete)
        prismaMock.factory.delete.mockResolvedValueOnce(factoryToDelete)

        //when
        const factoryResp = await deleteFactory(id)

        //then
        expect(factoryResp).toBeTruthy()
        expect(factoryResp?.id).toBe(factoryToDelete.id)
        expect(factoryResp?.name).toBe(factoryToDelete.name)
        expect(factoryResp?.created_at).toBe(factoryToDelete.created_at)
        expect(factoryResp?.updated_at).toBe(factoryToDelete.updated_at)
    })
    it("fail udpate existing, factory does not exists", async () => {
        //given
        const id = 2        

        //when
        await expect(deleteFactory(id)).rejects.toThrow(`factory with ${id} does not exist.`);
    })
})