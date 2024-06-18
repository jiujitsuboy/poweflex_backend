import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

const prisma = new PrismaClient()

const prismaMock: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>()

beforeEach(() => {
  mockReset(prismaMock)
})

export default prismaMock