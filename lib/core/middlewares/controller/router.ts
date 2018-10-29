import { IGlobal } from '../../../types/global';

export default (router: any, route: any, Controller: any, func: any) => {
  router.all(route, async (ctx: any, next: any) => {
    (global as IGlobal).$_POST = {};
    (global as IGlobal).$_GET = {};
    const _C = new Controller(ctx);
    const post = Object.assign({}, ctx.request.body);
    if (Object.keys(post).length) {
      // 有post请求
      for (const key in post) {
        if (post.hasOwnProperty(key)) {
          (global as IGlobal).$_POST[key] = post[key];
        }
      }
    }

    const get = Object.assign({}, ctx.request.query);
    if (Object.keys(get).length) {
      // get请求参数
      for (const key in get) {
        if (get.hasOwnProperty(key)) {
          (global as IGlobal).$_GET[key] = get[key];
        }
      }
    }

    await _C[func].apply(_C, (Object as any).values(ctx.params));
  });
};
