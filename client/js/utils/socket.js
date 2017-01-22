import windowHelper from './windowHelper';
import Emitter from './Emitter';
import SocketHandler from './SocketHandler';

const USER = { channelId: '' };
export const emitter = new Emitter;
const socketHandler = new SocketHandler(emitter);

export default {
    connect(id = USER.channelId) {
        USER.channelId = id;
        const socketUrl = windowHelper.getSocketUrl();
        const protocol = windowHelper.getProtocol() === 'https:' ? 'wss:' : 'ws:';
        socketHandler.connect(`${protocol}//${socketUrl}?id=${id}`);
        return this;
    },
    on(event, callback) {
        emitter.addListener(event, callback);
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
