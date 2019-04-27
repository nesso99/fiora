/**
 * 拦截未登录请求
 */
module.exports = function () {
    const noUseLoginEvent = {
        register: true,
        login: true,
        loginByToken: true,
        guest: true,
        getDefalutGroupHistoryMessages: true,
        getDefaultGroupOnlineMembers: true,
    };
    return async (ctx, next) => {
        if (!noUseLoginEvent[ctx.event] && !ctx.socket.user) {
            ctx.res = 'Please log in and try again';
            return;
        }
        await next();
    };
};
