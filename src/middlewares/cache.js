const cache = {};

const cacheMiddleware = (req, res, next) => {
    const key = req.originalUrl;
    if (cache[key]) {
        return res.send(cache[key]);
    }
    res.sendResponse = res.send;
    res.send = (body) => {
        cache[key] = body;
        res.sendResponse(body);
    };
    next();
};

module.exports = cacheMiddleware;