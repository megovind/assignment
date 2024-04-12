const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const DB_URI = process.env.DB_URI;

const options = {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

mongoose.connect(DB_URI, options).then(() => {
    console.log("MongoDB connected!");
}).catch((err) => {
    console.log("MongoDB connection rejected!", err);
});

mongoose.connection.on("connected", () => {
    console.log('Mongoose connected');
})

mongoose.connection.on("error", (error) => {
    console.log(error.message)
})

mongoose.connection.on("disconnected", () => { console.log("Mongose disconnected") })

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
});