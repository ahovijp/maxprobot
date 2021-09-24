"use strict";

// Imports dependencies and set up http server
const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  app = express().use(body_parser.json()); // creates express http server

const path = require("path");
const fs = require('fs');

const venom = require("venom-bot");

venom
  .create(
  
  'max',
    (base64Qr, asciiQR, attempts, urlCode) => {
      console.log(asciiQR); // Optional to log the QR in the terminal
      var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }
      response.type = matches[1];
      response.data = new Buffer.from(matches[2], 'base64');

      var imageBuffer = response;
      require('fs').writeFile(
        'out.png',
        imageBuffer['data'],
        'binary',
        function (err) {
          if (err != null) {
            console.log(err);
          }
        }
      );
    },
    undefined,
    { logQR: false }

)
  .then(client => start(client))
  .catch(erro => {
    console.log(erro);
  });

function start(client) {
  client.onMessage(message => {
    if (message.body === "Hi" && message.isGroupMsg === false) {
      client
        .sendText(message.from, "Welcome Venom 🕷")
        .then(result => {
          console.log("Result: ", result); //return object success
        })
        .catch(erro => {
          console.error("Error when sending: ", erro); //return object error
        });
    }
  });
}

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get("/qr", (req, res) => {
  res.sendFile(path.join(__dirname+'/out.png'));
});
