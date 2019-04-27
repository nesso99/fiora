const MaxCallPerMinutes = 20;
/**
 * Limiting the frequency of interface calls
 */
module.exports = function () {
    let callTimes = {};
    setInterval(() => callTimes = {}, 60000); // Emptying every 60 seconds

    return async (ctx, next) => {
        const { user } = ctx.socket;
        // robot10
        if (user && user.toString() === '5adad39555703565e7903f79') {
            return next();
        }

        const newUserList = global.mdb.get('newUserList');
        const socketId = ctx.socket.id;
        const count = callTimes[socketId] || 0;

        // 萌新限制
        if (user && newUserList.has(user.toString()) && count > 5) {
            return ctx.res = 'The interface call failed, you are in the new limit period, please do not operate frequently.';
        }
        // 普通用户限制
        if (count > MaxCallPerMinutes) {
            return ctx.res = 'Interface calls are frequent, please try again later';
        }
        callTimes[socketId] = count + 1;
        await next();
    };
};
