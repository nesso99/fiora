function noop() {}

/**
 * Routing processing
 * @param {IO} io koa socket io Instance
 * @param {Object} routes routing
 */
module.exports = function (io, _io, routes) {
    Object.keys(routes).forEach((route) => {
        io.on(route, noop); // Registration issue
    });

    return async (ctx) => {
        // Determine if the route exists
        if (routes[ctx.event]) {
            const { event, data, socket } = ctx;
            // Execute routing and get return data
            ctx.res = await routes[ctx.event]({
                event, // 事件名
                data, // 请求数据
                socket, // 用户socket实例
                io, // koa-socket实例
                _io, // socket.io实例
            });
        }
    };
};
