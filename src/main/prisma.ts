import { PrismaClient } from '@prisma/client'

declare global {
    var prisma: PrismaClient | undefined
}

let prisma: PrismaClient | undefined

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient()
    }
    prisma = global.prisma
}

// ✨ Garantir que nunca é undefined ao exportar
if (!prisma) {
    throw new Error('Prisma não foi inicializado')
}

export default prisma