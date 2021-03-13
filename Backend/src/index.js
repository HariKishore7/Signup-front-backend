const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const fs = require("fs"); 

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mongoose.createConnection("mongodb://localhost:27017/financepeer", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const jsonSchema = new mongoose.Schema({
  userId: Number,
  id: Number,
  title: String,
  body: String
});

const fileModel = db.model("user", jsonSchema);

app.post("/fileUpload", async (req, res) => {
    const fileName = req.body;
    fs.readFile(fileName, async function(err, data) { 
        if (err) throw err; 
        const fileData = JSON.parse(data); 
        const newFile = new fileModel({fileData});
        await newFile.save();
        res.status(201).send("File uploaded to database");
    }); 
});

app.get("/fileData",async(req,res)=>{
    const fileData = await fileModel;
    res.send(fileData);
});

app.listen(9999);