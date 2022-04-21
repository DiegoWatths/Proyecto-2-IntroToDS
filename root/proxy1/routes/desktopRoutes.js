const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv').config({ path: '../.env' });

const DESKTOP_BFF_URI = process.env.DESKTOP_BFF_URI;

router.use(express.json());

// api/ that retunrs all vg
router.get('/desktop', async (req, res) => {
    await sendFetch('/', 'GET', null, req.headers, res)
});

// all the post request between de api and authApi
router.post('/desktop/:route', async (req, res) =>{
    await sendFetch(`/${req.params.route}`, 'POST', req.body, req.headers, res)
})

// the rest of the routes, that includes the only-1 get, the patch and delete of the api
router.route('/desktop/:route/:apisParams')
  .get(async (req, res) => {
    await sendFetch(`/${req.params.route}/${req.params.apisParams}`, 'GET', null, req.headers, res)
  })
  .patch(async (req, res) => {
    await sendFetch(`/${req.params.route}/${req.params.apisParams}`, 'PATCH', req.body, req.headers, res)
  })
  .delete(async (req, res) => {
    await sendFetch(`/${req.params.route}/${req.params.apisParams}`, 'DELETE', req.body, req.headers, res)
  })

async function sendFetch(route, method, body, headers, res) {
    try {
        await fetch(`${DESKTOP_BFF_URI}/proxy`, {
            method: 'POST', //I send everything as a post request, such as I can have a body to send
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Request-Methods": "POST, OPTIONS"
            },
            body: JSON.stringify({ //<- this body contains everything that the previous request got that the next handlers will use
                route,
                method,
                headers,
                originalBody: body
            })
        })
        .then(rez => rez.json())
        .then( response => res.json(response))
        .catch(err => console.log(err.message))
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = router;