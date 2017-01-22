import socket from './utils/socket';

socket.connect('client')
    .on('open', () => console.log('connection open'))
    .on('open', () => {
        // setTimeout(() => {
        //     socket.send('broadcast', { message: 'to everyone' })
        //         .send('broadcast', { to: 'myid', message: 'to myid' });
        // }, 1000);
    }).on('message', console.log);

window.socket = socket;
