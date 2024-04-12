const http = require("http");
const express = require("express");
const app = express();
const morgan = require('morgan');
const createError = require('http-errors');
const dotenv = require('dotenv');

const UserRouter = require("./src/routes/user")
const TradeRouter = require("./src/routes/trades")


dotenv.config();
require("./src/helpers/db_init")
require("./src/helpers/init_redis");

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


app.use("/user", UserRouter);
app.use("/trades", TradeRouter)

app.use(async (req, res, next) => {
    next(createError.NotFound('API does not exist!'))
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.send(error);
});

const port = process.env.PORT || 3001;
const server = http.createServer(app);

server.listen(port, () => console.log(`Server is listioning on port ${port}`));

module.exports = app;