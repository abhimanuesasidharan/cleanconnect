const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose")
const cors = require('cors') 
const app = express();
dotenv.config();

const connect = async ()=>{
  try {
      await mongoose.connect(process.env.DB_URL);
      console.log("connected to mongo")
  } catch (error) {
      console.log(error);
  }
}
mongoose.connection.on("disconnected", ()=>{
  console.log("Error on mongoDB connection")
})


//middlewares
app.use(cors())
app.use(express.json());

app.use("/v1/user", require("./routes/userRoutes"));
app.use("/v1/admin", require("./routes/adminRoutes"));
app.use("/v1/worker", require("./routes/workerRoutes"));

//port
app.use((err,req,res,next)=>{
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "something went wrong"
    return res.status(errorStatus).json({
      success: false, status: errorStatus, message: errorMessage, stack: err.stack
    })
  })


app.listen(5000, ()=>{
  connect()
    console.log("connected to BK")
})