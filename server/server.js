const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const promisify = require('es6-promisify');
const expressValidator = require('express-validator');
const parseurl = require('parseurl');

// create our Express app
const app = express();

// var srcpath = path.join(__dirname,'/public') ;  
// var srcpath = `pacochat/public/index.html`

// app.use(express.static(path.join(__dirname,'public')));  
// app.use(bodyParser.json({limit:'5mb'}));    
// app.use(bodyParser.urlencoded({extended:true, limit:'5mb'}));  

// app.use(express.static('./public'))
app.use(express.static(__dirname + '/scripts'))
app.use(express.static(__dirname + '/styles'))
// app.use(express.static(__dirname + '/scripts'))
// app.use(express.static('styles'))

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html')
})

app.set('port', process.env.PORT || 7777)
const server = app.listen(app.get('port'), () => {
  console.log(`Hi Paco, express is running on PORT ${server.address().port}`)
})