import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PATCH']
    }
})

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    socket.on('order:update', (data) => {
        console.log(`Order update received:`, data)
        socket.broadcast.emit('order:updated', data)
    })

    socket.on('order:new', (data) => {
        console.log(`New order received:`, data)
        socket.broadcast.emit('order:created', data)
    })

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`)
    })
})

const PORT = 3001
httpServer.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`)
})
