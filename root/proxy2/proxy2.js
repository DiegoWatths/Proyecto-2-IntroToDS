const express = require('express');
const cors = require('cors');
const app = express();
const fetch = require('node-fetch');

require('dotenv').config({ path: '../.env' });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || "localhost";

app.post('/proxy', async (req, res) =>{
    try {
        const {route: route, method: meth, originalBody: ob, headers: head} = req.body;
        
        switch (route) {
            case '/register':
            case '/login':
                await fetch(`${process.env.AUTH_API_URI}${route}`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Request-Methods": "POST, OPTIONS"
                    },
                    body: JSON.stringify({originalBody: ob})
                })
                .then(resp => resp.json())
                .then(resp => res.send(resp))
                .catch(error => console.log(error.message))
                break;

            default:
                switch (meth) {
                    case 'GET':
                        await fetch(`${process.env.API_URI}${route}`, {
                            mode: 'cors',
                            headers: {
                                "Access-Control-Request-Methods": "GET, OPTIONS",
                                "Autherization": head.autherization
                            },
                        })
                        .then(resp => resp.json())
                        .then(resp => res.send(resp))
                        .catch(error => console.log(error.message))
                        break;

                    case 'POST':
                        await fetch(`${process.env.API_URI}${route}`, {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                "Content-Type": "application/json",
                                "Access-Control-Request-Methods": "POST, OPTIONS",
                                "Autherization": head.autherization
                            },
                            body: JSON.stringify({originalBody: ob})
                        })
                        .then(resp => resp.json())
                        .then(resp => res.send(resp))
                        .catch(error => console.log(error.message))
                        break;

                    case 'PATCH':
                        await fetch(`${process.env.API_URI}${route}`, {
                            method: 'PATCH',
                            mode: 'cors',
                            headers: {
                                "Content-Type": "application/json",
                                "Access-Control-Request-Methods": "PATCH, OPTIONS",
                                "Autherization": head.autherization
                            },
                            body: JSON.stringify({originalBody: ob})
                        })
                        .then(resp => resp.json())
                        .then(resp => res.send(resp))
                        .catch(error => console.log(error.message))
                        break;

                    case 'DELETE':
                        await fetch(`${process.env.API_URI}${route}`, {
                            method: 'DELETE',
                            mode: 'cors',
                            headers: {
                                "Content-Type": "application/json",
                                "Access-Control-Request-Methods": "DELETE, OPTIONS",
                                "Autherization": head.autherization
                            },
                            body: JSON.stringify({originalBody: ob})
                        })
                        .then(resp => resp.json())
                        .then(resp => res.send(resp))
                        .catch(error => console.log(error.message))
                        break;

                    default:
                        break;
                }
                break;
        }

        //Logs
    } catch (error) {
        console.log(error.message);
    }
})

app.listen(PORT, () => console.log(`El servicio del proxy 1 está en http://${HOST}:${PORT}`))