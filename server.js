
/*
 * Project Name: BSNL_CONS_MIS.
 * Date: 13/04/2023
 * Author:Kajal Gulyani
 * Contact: Echelon Edge MIS Development Team.
 * Copyright: Echelon Edge Pvt. Ltd.
 */

const express = require('express');
const path = require('path');
const app = express();
const http = require("http").createServer(app);
const routes = require('./src/Server/routes/router');
//const uuid = require('uuid');
const fs = require('fs');
const io = require('socket.io')(http);
const socketService = require('./src/Server/CommonFiles/socket_server')

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const cors = require('cors');
const userSessions = {};
const chronJob = require('./src/Server/controller/chroneJob');
// chronJob.chronjobModule.jobExecute();
app.use(express.static(path.join(__dirname, "dist/Edge_MIS")));

app.use(function (req, res, next) {
   next();
});
app.use(cors());


//function socketConnect (){
io.on('connection', socket => {
   //console.log("Socket Connection id ", socket.id);

   socketService.socketConnection(socket)
   //console.log(socket,"socket")

   socket.on('disconnect', () => {
      //socketService.disconnectSocketConnection(socket)
      //console.log("Socket Disconnection id ", socket.id)

   })
});
//}



var debug = require("debug")("app");
var name = "Edge_MIS";
debug("booting %s", name);

app.use('/', routes);
app.use('/uploads', express.static('uploads'));
app.get("*", (req, res) => {
   res.sendFile(path.join(__dirname, "dist/edge_mis/index.html"));
});

/****Below created function used for redirection on 404  */
app.use(function (err, req, res, next) {
   if (err.statusCode == 400) {
      res.end(JSON.stringify({ 'error': 'X', 'msg': 'Syntax error ' + err }));
   } else if (err) {
      res.redirect(['404']);
   }
});


let port = process.env.PORT || 4085;

// Server Listen here
http.listen(port, "0.0.0.0", function () {
   console.log("Listening to port http:" + port);
});

// let data = fs.readFileSync('src/Server/CommonFiles/constant.json');
// let secretKey = JSON.parse(data.toString()).JWTSECRET;
// let uuidKey = `${uuid.v4()}`;
// let obj = JSON.parse(data.toString());
// obj.JWTSECRET = uuidKey;
// data = JSON.stringify(obj);

// fs.writeFile('src/Server/CommonFiles/constant.json', data, (err) => {
//    if (err)
//       console.log(err);
//    else {
//    }
// });

module.exports = app;
