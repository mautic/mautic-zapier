const http = require('http');
const https = require('https');
const dotenv = require('dotenv');
const url = require('url');
const querystring = require('querystring');

dotenv.config({ path: '.environment'});

const serverUrl = `http://localhost:8081`;
const baseUrl = process.env.TEST_BASE_URL;
const oauthId = process.env.TEST_OAUTH2_CLIENT_ID;
const oauthSecret = process.env.TEST_OAUTH2_CLIENT_SECRET;

const requestListener = function (req, res) {
  const queryObject = url.parse(req.url,true).query;
  res.writeHead(200);

  if (typeof queryObject.code != 'undefined') {
    getAccessToken(baseUrl, oauthId, oauthSecret, serverUrl, queryObject.code, function(accessToken) {
        let message = `The access token is: ${accessToken}`;
        console.log(message);
        res.end(message);
    });
  }
}

const server = http.createServer(requestListener);

server.listen(8081);

const path = `/oauth/v2/authorize?client_id=${oauthId}&grant_type=authorization_code&redirect_uri=${querystring.escape(serverUrl)}&response_type=code`;

console.log(`Click on this URL to authenticate and get your access token: ${baseUrl+path}`);


function getAccessToken(baseUrl, clientId, clientSecret, reditectUrl, code, resolve) {

    const data = querystring.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: reditectUrl,
        code: code,
    });

    const host = baseUrl.replace(/(^\w+:|^)\/\//, '');

    const req = https.request({
        host: host,
        port: 443,
        path: '/oauth/v2/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Content-Length': Buffer.byteLength(data)
        },
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    }, res => {
        const body = []
        
        res.on('data', chunk => {
            body.push(chunk);
        })

        res.on('end', () => {
            const resString = Buffer.concat(body).toString()
            resolve(JSON.parse(resString).access_token)
        })
    })
    
    req.on('error', error => {
        console.error(error)
        resolve('error happened:' + error);
    })
    
    req.write(data)
    req.end()
}
