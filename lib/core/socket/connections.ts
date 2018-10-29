export default (socket: any, route: any, Controller: any, func: any) => {
  socket.of(route).on('connection', (_socket: any) => {
    const _C = new Controller(null, _socket);
    _C[func].apply(_C);
  });
};
