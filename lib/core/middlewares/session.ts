import session from 'koa-session';

export default (app: any) => {
  app.use(
    session(
      {
        key: 'koa:sess',
        maxAge: 86400000,
        overwrite: true,
        httpOnly: true,
        signed: false,
        rolling: true,
        renew: false,
      },
      app,
    ),
  );
};
