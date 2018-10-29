import io from 'socket.io';
import path from 'path';
import SocketPath from './SocketPath';

const dir = process.cwd();
const { socket } = require(path.join(dir, 'config/config.js'));

export default (app: any) => {
  if (socket) {
    app = require('http').createServer(app.callback());
    SocketPath(io(app));
  }
  return app;
};
