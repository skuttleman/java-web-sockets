import socket from './utils/socket';

socket.connect('manager')
    .on('open', () => console.log('connection open'))
    .on('message', console.log);

