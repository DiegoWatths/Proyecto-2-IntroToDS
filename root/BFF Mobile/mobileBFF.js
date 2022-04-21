const express = require('express');
const cors = require('cors')
const app = express();
const fetch = require('node-fetch');
require('dotenv').config({ path: '../.env' });
const morgan = require('morgan');
const path = require('path')

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "localhost";

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('combined', { stream: accessLogStream }));

var accessLogStream = fs.createWriteStream(path.join(__dirname, '..', 'logs', 'mobilebff.log'), { flags: 'a' })

app.use(cors({
    origin: "*",
    credentials: true,
}));

app.get('/', (req, res) => {
    res.send('Este es el BFF Mobile, diseñado para recibir y devolver peticiones para dispositvos móviles')
})

app.post('/proxy', async (req, res) => {
    try {
        const {route: route, method: meth, originalBody: ob, headers: head} = req.body;
        var response;
        
        await fetch(`${process.env.PROXY2_URI}/proxy`, {
            method: 'POST', //I send everything as a post request, such as I can have a body to send
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Request-Methods": "POST, OPTIONS"
            },
            body: JSON.stringify({ //<- this body contains everything that the previous request got that the next handlers will use
                route,
                method: meth,
                headers: head,
                originalBody: ob
            })
        })
        .then( respons => respons.json())
        .then( respons => response = respons)
        .catch(err => console.log(err.message))
    
        console.log(response);
        res.send(response);
    } catch (error) {
        console.log(error.message);
    }
})

app.listen(PORT, () => console.log(`Este servicio, el BFF Móvil, está en http://${HOST}:${PORT}`))