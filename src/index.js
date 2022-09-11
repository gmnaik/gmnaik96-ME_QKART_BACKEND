require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");

let server;
// const PORT=8082;
// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Create Mongo connection and get the express app to listen on config.port
// const MONGODB_URL = "mongodb://127.0.0.1:27017/qkart";

// app.get("/", (req,res) => {
//     res.send('<h1>Hello hi how are you </h1>');
// })

mongoose.connect(config.mongoose.url).then(()=> {console.log('Connected to DB at',config.port)}).catch((err) =>{
    console.log('Unable to connect to DB',config.port)
});

app.listen(config.port, () => {
    console.log(`server running on port ${config.port}`)
})