#!/usr/bin/env

const express = require("express");
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt')
require('dotenv').config({ path: '../.env' });
const morgan = require('morgan');
const path = require('path')

const User = require('./utils/userSchema')
require('./utils/userDatabase').connect();

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3001;
const SECRET = process.env.SECRET;

//MIDDLEWARE
app.use(morgan('combined', { stream: accessLogStream }));

var accessLogStream = fs.createWriteStream(path.join(__dirname, '..', 'logs', 'users.log'), { flags: 'a' })

app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(express.json());

app.post('/register', async (req, res) => {
    var error = [];
    const {username: user, password: pass} = req.body;

    //Verifying username (unique)
    try {
       let newUsern = await User.findOne({username: user});
       if(!(newUsern == null)){
           error.push("Ese nombre de usuario ya existe. Por favor ingrese un nombre de usuario diferente.")
       }
    } catch (err) {
        console.log(err.message);
    }

    if(error.length == 0){
        try {
            /*Register logic to the mongo database*/ 
            if (user == 'admin') { //<- Code that happens only in the initial registry of the admin
                const newUser = new User({username: user, password: pass, role: 'Admin'});
                newUser.password = await newUser.encryptPassword(newUser.password);
                
                await newUser.save();
            } else { //<- Everyone else
                const newUser = new User({username: user, password: pass, role: 'Reader'});
                newUser.password = await newUser.encryptPassword(newUser.password);
                
                await newUser.save();
            }

            res.json({message: 'Se ha registrado exitosamente! Por favor inicie sesión con este usuario'});
        } catch (err) {
            console.log(err.message);
        }
    }else{
        res.status(400).json({error});
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({username});
    if (!user) return res.status(401).send('Nombre de usuario inválido. Por favor inténtelo de nuevo');

    const match = await bcrypt.compare(password, user.password);

    if(!(match)){
        return res.status(401).send('La contraseña ingresada para este usuario es inválida. Por favor inténtelo de nuevo');
    }

    jwt.sign({_id: user._id}, SECRET, (err, token) => {
        err? console.log(err.message)
        : res.status(200).json({
            Mensaje: 'Inicio de sesión exitoso! Para poder acceder a los recursos de la API debes colocar esto dentro de tu header: "Authorization: Bearer <tu token>"',
            token
        })
    })
})

app.listen(PORT, () => console.log(`Este servicio, el de autenticación, está en http://${HOST}:${PORT}`))