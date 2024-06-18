import { PrismaClient } from '@prisma/client'
import { DeepMockProxy } from 'jest-mock-extended'

const getPrismaMock = (prisma: PrismaClient) => {
  return prisma as unknown as DeepMockProxy<PrismaClient>
}

export {getPrismaMock}