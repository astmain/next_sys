import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

type prismaClientSingleton =  ReturnType<typeof prismaClientSingleton> 


const globalForPrisma = globalThis as unknown as {
  prisma: prismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma
export const db = prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma



// declare const globalThis: {
//   prisma: ReturnType<typeof prismaClientSingleton> | undefined
// }

// const prisma = globalThis.prisma || prismaClientSingleton()
// globalThis.prisma = prisma

// export const db = prisma
