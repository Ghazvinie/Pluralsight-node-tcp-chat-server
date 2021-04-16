const net = require('net');

const server = net.createServer();

let counter = 0;
let sockets = {};

function timeStamp() {
    const currentDate = new Date();
    return `${currentDate.getHours()}:${currentDate.getMinutes()}`;
}

server.on('connection', socket => {
    socket.id = counter++;
    console.log('A client has connected');
    socket.write('Please type your name\n');

    socket.on('data', (data) => {
        if (!sockets[socket.id]){
            socket.name = data.toString().trim();
            socket.write(`Welcome ${socket.name}!\n`);
            sockets[socket.id] = socket;
            socket.write(`${socket.name}, please start typing to chat!\n`);
            return;
        }

        Object.entries(sockets).forEach(([keyId, clientSocket]) => {
            if (socket.id == keyId) {
                socket.write(`You said: ${data.toString()}`);
                return;
            }
            clientSocket.write(`${timeStamp()} - User ${socket.name} said:  `);
            clientSocket.write(data);
        });
    });

    socket.on('end', () => {
        delete sockets[socket.id];
        console.log('Client Disconnected');
    });
});

server.listen(8080, () => console.log('Server has started'));
