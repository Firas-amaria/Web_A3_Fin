import http from 'http';
import {Server} from 'socket.io';
import {getSession} from 'next-auth/react';

/**
 * this is the starting function of our server it handles initialization 
 * and message handling
 */
async function init(){
    const httServer = http.createServer();
    const PORT = process.env.PORT || 5000;
    //determine the port and the link to the server
    const io = new Server(httServer, {
        cors: {
            origin: ['http://localhost:3000', 'https://web-a3-fin.onrender.com//api'],
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Socket.io middleware function to authenticate and authorize users
    io.use(async (socket, next) => {
        const session = await getSession({req: socket.request});
        socket.user = session?.user;
        return next();
    });

    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    
        socket.on('message:request', async (data, cb) => {
            cb('Message received');

            // Save message to database
            const response = await fetch('https://web-a3-fin.onrender.com//api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    courseId: data.courseId,
                    message: data.message,
                    user: socket.user
                })
            });
            
            if(response.status === 201){
                console.log('Message saved');
                const result = await response.json();
                io.emit('message:response', result.data);
            }
        });
    });

    httServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

init();