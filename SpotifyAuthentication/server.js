let express = require('express')
let request = require('request')
let querystring = require('querystring');
const { nextTick } = require('process');

const clientId = '31f9bdda21ad4a3cb4a2f5f03e256948';
const clientSecret = '3f978bf71a834a78ad26865460a0f6c1';

let bearerToken = '';

let app = express()

let redirect_uri = 
  process.env.REDIRECT_URI || 
  'http://localhost:8888/callback'

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next()
})

app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: 'user-modify-playback-state',
      redirect_uri: 'http://localhost:8888/callback'
    }))
})

app.get('/callback', function(req, res) {
  let code = req.query.code || null
  console.log(req.query);
  console.log('hi there');
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        clientId + ':' + clientSecret
      ).toString('base64'))
    },
    json: true
  }
  console.log(code);
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    console.log(access_token);
    bearerToken = access_token;
    console.log('bearer Token: ', bearerToken);
    res.json(bearerToken);
    // var txtFile =new File("token.txt"); 
    // txtFile.writeln(access_token);
    // txtFile.close();
    // let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
    // res.redirect(uri + '?access_token=' + access_token)
  })
})

app.get('/token', function(req, res) {
  res.json(bearerToken);
})

let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)