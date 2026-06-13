import prisma from "../prisma"

export const sessionService = {
    // Create new session

    async createSession(data: {
        dayOfWeek: number
        startTime: Date
        duration: number
    }) {
        return await prisma!.session.create({
            data: {
                dayOfWeek: data.dayOfWeek,
                startTime: data.startTime,
                duration: data.duration,
                completed: true
            }
        })
    },

    // Search all sessions
    async getAllSessions() {
        return await prisma!.session.findMany({
            orderBy: { startTime: 'desc' }
        })
    },

    // Search for sessions on a specific day
    async getSessionsByDay(dayOfWeek: number) {
        return await prisma!.session.findMany({
            where: { dayOfWeek },
            orderBy: { startTime: 'desc' }
        })
    },

    // Search for sessions of the current week
    async getWeekSessions() {
        const today = new Date()
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())

        return await prisma!.session.findMany({
            where: {
                startTime: {
                    gte: weekStart
                }
            },
            orderBy: { startTime: 'desc' }
        })
    },

    // Update session
    async updateSession(id: string, data: Partial<{
        duration: number
        completed: boolean
    }>) {
        return await prisma!.session.update({
            where: { id },
            data,
        })
    },

    // Delete session
    async deleteSession(id: string) {
        return await prisma!.session.delete({
            where: { id }
        })
    },

    // Delete all sessions
    async deleteAllSessions() {
        return await prisma!.session.deleteMany()
    },
}