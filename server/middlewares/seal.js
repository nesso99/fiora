/**
 * Refusing to seal user requests
 */
module.exports = function () {
    return async (ctx, next) => {
        const sealList = global.mdb.get('sealList');
        if (ctx.socket.user && sealList.has(ctx.socket.user.toString())) {
            return ctx.res = 'You have been locked into the dark room, please reflect and try again';
        }

        await next();
    };
};
