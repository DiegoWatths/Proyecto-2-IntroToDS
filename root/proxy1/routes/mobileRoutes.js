const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv').config({ path: '../.env' });

const MOBILE_BFF_URI = process.env.MOBILE_BFF_URI;

router.use(express.json());

// api/ that retunrs all vg
router.get('/mobile', async (req, res) => {
    await sendFetch('/', 'GET', null, req.headers, res)
});

// all the post request between de api and authApi
router.post('/mobile/:route', async (req, res) =>{
    await sendFetch(`/${req.params.route}`, 'POST', req.body, req.headers, res)
})

// the rest of the routes, that includes the only-1 get, the patch and delete of the api
router.route('/mobile/:route/:apisParams')
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
      var response;
      console.log(`${route} - ${method} - ${body} - ${headers} - ${MOBILE_BFF_URI}`);
        await fetch(`${MOBILE_BFF_URI}/proxy`, {
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
        .then( respons => respons.json())
        .then( respons => response = respons)
        .catch(err => console.log(err.message))

        console.log(response);
        res.send(response)
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = router;