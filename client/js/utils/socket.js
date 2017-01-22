import windowHelper from './windowHelper';
import Emitter from './Emitter';
import SocketHandler from './SocketHandler';

const CONNECTION_URL = 'localhost:8080/socket';
const PROTOCOL = windowHelper.getProtocol() === 'https:' ? 'wss:' : 'ws:';
const USER = { channelId: '' };
const emitter = new Emitter;
const socketHandler = new SocketHandler(emitter);

export default {
    connect(id = USER.channelId) {
        USER.channelId = id;
        socketHandler.connect(`${PROTOCOL}//${CONNECTION_URL}?id=${id}`);
        return this;
    },
    on(event, callback) {
        emitter.addEventListener(event, callback);
        return this;
    },
    send(type, payload) {
        socketHandler.send({ type, payload });
        return this;
    },
    close() {
        socketHandler.close();
    }
};
