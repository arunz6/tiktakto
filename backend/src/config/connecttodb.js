import mongoose from "mongoose";
import config from "./config.js";

async function connecttodb(params) {


  try {
    const conn = await mongoose.connect(config.mongouri);
    console.log(`MongoDB connected `);
  } 
  
  catch (err) {
    throw new Error(`Can't connect to DB${err}`);
  }
}

export default connecttodb;
