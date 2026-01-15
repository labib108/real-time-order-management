import { io } from 'socket.io-client'

export const emitSocketEvent = (event: string, data: any) => {
    const socket = io('http://localhost:3001')

    socket.on('connect', () => {
        socket.emit(event, data)
        // Small delay to ensure emission before disconnect
        setTimeout(() => {
            socket.disconnect()
        }, 100)
    })
}
