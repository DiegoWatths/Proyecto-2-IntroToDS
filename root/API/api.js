#!/usr/bin/env

const express = require("express");
const app = express();
const cors = require('cors')
require('dotenv').config({ path: '../.env' });
const morgan = require('morgan');
const path = require('path')

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

const VideoGame = require("./utils/videogameSchema")
require('./utils/videogameDatabase').connect();

const {VerifyToken, isAdmin} = require('../Auth API/utils/authMiddleware' )

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('combined', { stream: accessLogStream }));

var accessLogStream = fs.createWriteStream(path.join(__dirname, '..', 'logs', 'videogames.log'), { flags: 'a' })

app.use(cors({
    origin: "*",
    credentials: true,
}));

//all
app.get("/",  VerifyToken, async (req, res) =>{
    try {
        const videogames = await VideoGame.find()
        console.log("Videogames collection is being sent...")
        res.json(videogames)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }  
})

//only 1
app.get("/vg/:title",  VerifyToken, getVideoGame, (req, res) =>{
    console.log("Videogame Found")
    res.json(res.videogame)
})

//Create videogames
app.post("/create",  VerifyToken,  isAdmin, async (req, res) =>{
    const vg = new VideoGame({
        title: req.body.title,
        genre: req.body.genre,
        developers: req.body.developers,
        sales: req.body.sales,
    })

    try {
       await vg.save();

        const {title: tit, genre: gen, developers: dev, sales: money} = vg; //<- Destructure the object onto several constants
        console.log("New Videogame added:")
        console.table({title: tit, genre: gen, developers: dev, sales: money}); //<- Show the object in a table very fancy indeed

        res.status(201).send("Videogame added to database!")
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//update videogames collection
app.patch("/update/:title",  VerifyToken,  isAdmin, getVideoGame, async (req, res) =>{
    if(req.body.title != null){
        console.log(`Changed the title ${res.videogame.title} to ${req.body.title}`);
        res.videogame.title = req.body.title;
    }

    if(req.body.genre != null){
        console.log(`Changed the genre ${res.videogame.genre} to ${req.body.genre}`);
        res.videogame.genre = req.body.genre;
    }

    if(req.body.developers != null){
        console.log(`Changed the developers ${res.videogame.developers} to ${req.body.developers}`);
        res.videogame.developers = req.body.developers;
    }

    if(req.body.sales != null){
        console.log(`Changed the sales ${res.videogame.sales} to ${req.body.sales}`);
        res.videogame.sales = req.body.sales;
    }

    try {
        await res.videogame.save();
        console.log("Videogame Updated:")

        const {title: tit, genre: gen, developers: dev, sales: money} = res.videogame;
        console.table({title: tit, genre: gen, developers: dev, sales: money})
        res.status(200).send("Videogame Updated Succesfully!")
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//delete
app.delete("/delete/:title",  VerifyToken,  isAdmin, getVideoGame, async (req, res) =>{
    try {
        await res.videogame.delete();
        console.log("Videogame Deleted T-T")
        res.status(400).json("Deleted Videogame :o oops...")
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

async function getVideoGame(req, res, next) {
    let videogame
    try {
        console.log(req.params.id);
        videogame = await VideoGame.findOne({title: req.params.title});
        if (videogame == null) {
            return res.status(404).json({ message: "Cannot find Videogame"})
        }
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  
    res.videogame = videogame
    next()
}

app.listen(PORT, () => console.log(`Este servicio, el backend, está en http://${HOST}:${PORT}`))