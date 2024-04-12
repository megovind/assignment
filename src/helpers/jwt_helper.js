const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const client = require("./init_redis");

module.exports = {
    signInAccessToken: async (uid) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.SECRET_KEY
            const options = {
                expiresIn: "10m",
                issuer: "govind.com",
                audience: uid.toString()
            };

            JWT.sign(payload, secret, options, (error, token) => {
                console.log("ERRO", error);
                if (error) return reject(createError.InternalServerError(error.message));
                resolve(token);
            });
        })
    },
    verifyAccessToken: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return next(createError.Unauthorized());
        const jwtToken = authHeader.split(" ");
        const token = jwtToken[1];
        JWT.verify(token, process.env.SECRET_KEY, (error, payload) => {
            if (error) return next(createError.Unauthorized('Unauthorized'))
            req.payload = payload;
            next();
        })
    },

    signInRefreshToken: (uid) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.REFRESH_TOKEN_SECRET_KEY
            const options = {
                expiresIn: "1y",
                issuer: 'govind.com',
                audience: uid.toString()
            }
            JWT.sign(payload, secret, options, (error, token) => {
                if (error) return reject(createError.InternalServerError());
                client.SET(uid, token, 'EX', 360 * 24 * 60 * 60, (error, result) => {
                    if (error) return reject(createError.InternalServerError(error.message))
                    resolve(token);
                })
            })
        })
    },

    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, (err, payload) => {
                if (err) return reject(createError.Unauthorized());
                const userId = payload.aud;
                client.GET(userId, (error, result) => {
                    if (error) return reject(createError.InternalServerError());
                    if (refreshToken === result) return resolve(userId);
                    return reject(createError.Unauthorized());
                });
                resolve(userId);
            })
        });
    }
}