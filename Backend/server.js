import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRoutes from "./routes/chat.js"

const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.json());
app.use(cors());

app.use("/api" , chatRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

const connectDB = async() =>{
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log( "Error connecting to MongoDB:",err);
}
}
// app.post("/test" , async(req , res) => {
//     const option = {
//         method : "POST",
//         headers : {
//             "Content-Type" : "application/json",
//             "Authorization" : `Bearer ${process.env.OPENAI_KEY}`
//         },
//         body : JSON.stringify({
//             model : "gpt-4.o-mini",
//             messages : [
//                 {
//                     role : "user",
//                     content : req.body.message
//                 }]
//         })
//     };

//     try {
//       const response = await fetch("https://api.openai.com/v1/chat/completions", option);
//       const data = await response.json();
//       res.send(data.choices[0].message.content);
//     } catch (error) {
//       console.error("Error:", error);
//     } 
// })
