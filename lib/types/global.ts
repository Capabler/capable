export interface IGlobal extends NodeJS.Global {
  emitter: any;
  $_POST: any;
  $_GET: any;
  $_COOKIE: any;
  $_SESSION: any;
  setcookie: Function;
  DJ_Controller: Function;
  DJ_Model: Function;
  SocketIo: any;
}
