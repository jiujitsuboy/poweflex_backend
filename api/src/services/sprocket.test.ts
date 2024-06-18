import prisma from "../repositories/prismaClient/client";
import { getPrismaMock } from "../repositories/prismaClient/singleton"
import { spRockets } from "../repositories/prismaClient/testData"
import { addSpRocket, deleteSpRocket, getSpRocket, getSpRockets, updateSpRocket } from "./sprocket";

jest.mock("../repositories/prismaClient/client")

const prismaMock = getPrismaMock(prisma)

describe("with SpRocket", () => {
    it("get all of them", async () => {
        //given
        prismaMock.sprocket.count.mockResolvedValue(spRockets.length)
        prismaMock.sprocket.findMany.mockResolvedValue(spRockets)

        //when
        const spRocketsPaginated = await getSpRockets(0, 10)

        //then
        expect(spRocketsPaginated).toBeTruthy()
        expect(spRocketsPaginated.totalRows).toBe(spRockets.length)
    })
    it("fail to get them all", async () => {
        prismaMock.sprocket.count.mockImplementation(() => {
            throw new Error("database connection rejected");
        })

        await expect(getSpRockets(0, 10)).rejects.toThrow('database connection rejected');
    })
    it("get factory by id", async () => {
        //given
        const spRocketElement = spRockets[spRockets.length - 1]
        prismaMock.sprocket.findUnique.mockResolvedValue(spRocketElement)

        //when
        const spRocketResp = await getSpRocket(spRocketElement.id)

        //then
        expect(spRocketResp).toBeTruthy()
        expect(spRocketResp?.id).toBe(spRocketElement.id)
        expect(spRocketResp?.teeth).toBe(spRocketElement.teeth)
        expect(spRocketResp?.pitch).toBe(spRocketElement.pitch)
        expect(spRocketResp?.outside_diameter).toBe(spRocketElement.outside_diameter)
        expect(spRocketResp?.pitch_diameter).toBe(spRocketElement.pitch_diameter)

    })
    it("fail to get spRocket by id", async () => {
        //given
        prismaMock.sprocket.findUnique.mockImplementation(() => {
            throw new Error("database connection rejected");
        })

        //when
        await expect(getSpRocket(spRockets[spRockets.length - 1].id)).rejects.toThrow('database connection rejected');

    })
    it("spRocket with id does not exists", async () => {
        //given
        prismaMock.sprocket.findUnique.mockResolvedValue(null)
        const id = spRockets[spRockets.length - 1].id
        //when

        await expect(getSpRocket(id)).rejects.toThrow(`sprocket with ${id} does not exist.`);

    })
    it("create new spRocket", async () => {
        //given
        const newSpRocket = {
            id: 3,
            teeth: 12,
            outside_diameter: 22,
            pitch: 52,
            pitch_diameter: 42
        }
        prismaMock.sprocket.create.mockResolvedValueOnce(newSpRocket)

        //when
        const spRocketResp = await addSpRocket(newSpRocket.teeth, newSpRocket.pitch_diameter, newSpRocket.outside_diameter, newSpRocket.pitch)

        //then
        expect(spRocketResp).toBeTruthy()
        expect(spRocketResp?.id).toBe(newSpRocket.id)
        expect(spRocketResp?.teeth).toBe(newSpRocket.teeth)
        expect(spRocketResp?.pitch_diameter).toBe(newSpRocket.pitch_diameter)
        expect(spRocketResp?.outside_diameter).toBe(newSpRocket.outside_diameter)
        expect(spRocketResp?.pitch).toBe(newSpRocket.pitch)
    })
    it("fail create new, spRocket already exists", async () => {
        //given

        const newSpRocket = {
            id: 3,
            teeth: 12,
            outside_diameter: 22,
            pitch: 52,
            pitch_diameter: 42
        }
        prismaMock.sprocket.findFirst.mockResolvedValue(newSpRocket)

        //when
        await expect(addSpRocket(newSpRocket.teeth, newSpRocket.pitch_diameter, newSpRocket.outside_diameter, newSpRocket.pitch))
            .rejects
            .toThrow(`sprocket with teeth: ${newSpRocket.teeth}, pitchDiameter: ${newSpRocket.pitch_diameter}, outsideDiameter: ${newSpRocket.outside_diameter}, pitch: ${newSpRocket.pitch} already exist.`);
    })
    it("fail to validate spRocket existance", async () => {
        //given

        const newSpRocket = {
            id: 3,
            teeth: 12,
            outside_diameter: 22,
            pitch: 52,
            pitch_diameter: 42
        }
        prismaMock.sprocket.findFirst.mockImplementation(() => {
            throw new Error("database connection rejected");
        })

        //when
        await expect(addSpRocket(newSpRocket.teeth, newSpRocket.pitch_diameter, newSpRocket.outside_diameter, newSpRocket.pitch))
            .rejects.toThrow('database connection rejected');
    })

    it("udpate existing sprocket", async () => {
        //given

        const existingSpRocket = {
            id: 2,
            teeth: 12,
            outside_diameter: 22,
            pitch: 52,
            pitch_diameter: 42
        }
        prismaMock.sprocket.findUnique.mockResolvedValue(spRockets[spRockets.length - 1])
        prismaMock.sprocket.update.mockResolvedValueOnce(existingSpRocket)

        //when
        const spRocketResp = await updateSpRocket(existingSpRocket.id, existingSpRocket.teeth, existingSpRocket.pitch_diameter, existingSpRocket.outside_diameter, existingSpRocket.pitch)

        //then
        expect(spRocketResp).toBeTruthy()
        expect(spRocketResp?.id).toBe(existingSpRocket.id)
        expect(spRocketResp?.teeth).toBe(existingSpRocket.teeth)
        expect(spRocketResp?.pitch_diameter).toBe(existingSpRocket.pitch_diameter)
        expect(spRocketResp?.outside_diameter).toBe(existingSpRocket.outside_diameter)
        expect(spRocketResp?.pitch).toBe(existingSpRocket.pitch)
    })
    it("fail udpate existing, sprocket does not exists", async () => {
        //given

        const existingSpRocket = {
            id: 2,
            teeth: 12,
            outside_diameter: 22,
            pitch: 52,
            pitch_diameter: 42
        }

        //when
        await expect(updateSpRocket(existingSpRocket.id, existingSpRocket.teeth, existingSpRocket.pitch_diameter, existingSpRocket.outside_diameter, existingSpRocket.pitch))
            .rejects.toThrow(`sprocket with ${existingSpRocket.id} does not exist.`);
    })
    it("delete existing sprocket", async () => {
        //given

        const id = 2

        const spRocketToDelete = spRockets[spRockets.length - 1]
        prismaMock.sprocket.findUnique.mockResolvedValue(spRocketToDelete)
        prismaMock.sprocket.delete.mockResolvedValueOnce(spRocketToDelete)

        //when
        const spRocketResp = await deleteSpRocket(id)

        //then
        expect(spRocketResp).toBeTruthy()
        expect(spRocketResp?.id).toBe(spRocketToDelete.id)
        expect(spRocketResp?.teeth).toBe(spRocketToDelete.teeth)
        expect(spRocketResp?.pitch_diameter).toBe(spRocketToDelete.pitch_diameter)
        expect(spRocketResp?.outside_diameter).toBe(spRocketToDelete.outside_diameter)
        expect(spRocketResp?.pitch).toBe(spRocketToDelete.pitch)
    })
    it("fail udpate existing, sprocket does not exists", async () => {
        //given
        const id = 2

        //when
        await expect(deleteSpRocket(id)).rejects.toThrow(`sprocket with ${id} does not exist.`);
    })
})