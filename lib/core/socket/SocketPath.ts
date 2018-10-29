import fs from 'fs';
import path from 'path';
import createConnection from './connections';

const dir = process.cwd();
const socketsPath = path.join(dir, 'sockets');

const getParameterName = (fn: any) => {
  if (typeof fn !== 'object' && typeof fn !== 'function') {
    return;
  }
  const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
  const DEFAULT_PARAMS = /=[^,)]+/gm;
  const FAT_ARROWS = /=>.*$/gm;
  let code = fn.prototype ? fn.prototype.constructor.toString() : fn.toString();
  code = code
    .replace(COMMENTS, '')
    .replace(FAT_ARROWS, '')
    .replace(DEFAULT_PARAMS, '');
  const result = code
    .slice(code.indexOf('(') + 1, code.indexOf(')'))
    .match(/([^\s,]+)/g);
  return result === null ? [] : result;
};

// 遍历文件
export default function fileDisplay(socket: any, filePath = socketsPath) {
  // 根据文件路径读取文件，返回文件列表
  // tslint:disable-next-line:only-arrow-functions
  fs.readdir(filePath, (err, files) => {
    if (err) {
      console.warn(err);
    } else {
      // 遍历读取到的文件列表
      files.forEach((filename) => {
        // 获取当前文件的绝对路径
        const filedir = path.join(filePath, filename);
        // 根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir, (eror, stats) => {
          if (eror) {
            console.warn('获取文件stats失败');
          } else {
            const isFile = stats.isFile(); // 是文件
            const isDir = stats.isDirectory(); // 是文件夹
            if (isFile && !/\.delicate$/.test(filedir)) {
              // 控制器的js文件名称
              const routeDir = filedir
                .replace(socketsPath, '')
                .replace(/\.js$/, '');
              const Controller = require(filedir);
              const routes = Object.getOwnPropertyNames(
                Controller.prototype,
              ).filter((item) => item !== 'constructor');

              // 忽略index
              const igoreIndex = routeDir
                .split('/')
                .filter((item) => item !== 'index')
                .join('/');
              if (igoreIndex !== routeDir) {
                socket.of(igoreIndex).on('connection', (_socket: any) => {
                  const _C = new Controller(null, _socket);
                  _C.index.apply(_C);
                });
              }

              if (routes.length) {
                routes.map((item) => {
                  // js的类的属性方法名是index
                  if (item === 'index') {
                    createConnection(socket, routeDir, Controller, item);
                  }

                  // 完整路径
                  createConnection(
                    socket,
                    path.join(routeDir, item),
                    Controller,
                    item,
                  );
                });
              }
            }
            if (isDir) {
              fileDisplay(socket, filedir); // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
          }
        });
      });
    }
  });
}
