import mongoose from "mongoose"

export default async conn_str => {
   try {
      await mongoose.connect(conn_str)
   } catch (err) {
      console.log(err)
   }
}