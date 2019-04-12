import io from 'socket.io-client';
import config from './config/index';

const socket = io.connect(config.server);

export default socket;
