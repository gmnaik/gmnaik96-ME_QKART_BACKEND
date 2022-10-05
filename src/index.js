require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");

let server;
// const PORT=8082;
// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Create Mongo connection and get the express app to listen on config.port
//console.log("Port is",config.port);
app.listen(config.port , () => {
    console.log('Started to listen on port',config.port);
});

mongoose.connect(config.mongoose.url).then(() =>{
    console.log("Connected to Mongo DB at URL:",config.mongoose.url);
}).catch((err) => {
    console.log("Couldnot connect to MongoDB at URL:",config.mongoose.url);
});
