/*
  DON'T MESS WITH THIS UNLESS YOU KNOW WHAT YOU'RE DOING
*/

// Data
const redis = require("redis");
const asyncredis = require("async-redis");

const express = require("express");
const app = express();
const bodyparser = require("body-parser");



app.use(bodyparser.json());
app.set("env", "production");
app.use(bodyparser.urlencoded({ extended: true }));

async function api(client){


  client.getData = async (key) => {
    let data = await client.redisClient.get(key)
    return JSON.parse(data)
  }
  
  client.setData = async (key, val, toSet) => {
    let data = await client.redisClient.set(key, JSON.stringify(val, null, 2))
    return data 
  }

// Set the auto-pinger
app.get("/", function(err, res) {
  res.sendStatus(200);
});

app.get("/ping", function(err, res) {
  console.log("vibe check");
  res.sendStatus(200);
  // vibe check
});


app.post("/verifyHostAssistant", async function(req, res) {
  let body = req.body
  console.log(body)
  if (!body) {
    console.log("no body invlid request")
    return res.sendStatus(400)
  }
  if (!body.key) {
    console.log("forbidden")
    return res.sendStatus(403)  
  }
  let keyData = await client.getData(body.key)
  if (!keyData) {return res.sendStatus(403)}
  if (keyData.product == "sidemenu") {
    let creatorId = String(body.creator)
    if (keyData.allowedIds[creatorId]) {
      res.sendStatus(200)
    } else {
      console.log("forbidden not allowed creatorid")
      res.sendStatus(403)
    }
  } else {
    console.log("forbidden (incorrect keytype)")
    res.sendStatus(403)
  }
});



app.post("/verifyRankRequest", async function(req, res) {
  let body = req.body
  console.log(body)
  if (!body) {
    console.log("no body invlid request")
    return res.sendStatus(400);
  }
  if (!body.key) {
    console.log("forbidden")
    return res.sendStatus(403)  
  }
  let keyData = await client.getData(body.key)
  if (keyData.product == "autoranking") {
    let creatorId = String(body.creator)
    if (keyData.allowedIds[creatorId]) {
      res.sendStatus(200)
    } else {
      console.log("forbidden not allowed creatorid")
      res.sendStatus(403)
    }
  } else {
    console.log("forbidden (incorrect keytype)")
    res.sendStatus(403)
  }
});

app.post("/verifyHosting", async function(req, res) {
  let body = req.body
  console.log(body)
  if (!body) {
    console.log("no body invlid request")
    return res.sendStatus(400)
  }
  if (!body.key) {
    console.log("forbidden")
    return res.sendStatus(403)  
  }
  let keyData = await client.getData(body.key)
  if (!keyData) {return res.sendStatus(403)}
  if (keyData.product == "hostingassistant"){
    let creatorId = String(body.creator)
    if (keyData.allowedIds[creatorId]) {
      res.sendStatus(200)
    } else {
      console.log("forbidden not allowed creatorid")
      res.sendStatus(403)
    }
  } else {
    console.log("forbidden (incorrect keytype)")
    res.sendStatus(403)
  }
});



app.post("/verifyBusKey", async function(req, res) {
  let body = req.body
  console.log(body)
  if (!body) {
    console.log("no body invlid request")
    return res.sendStatus(400)
  }
  if (!body.key) {
    console.log("forbidden")
    return res.sendStatus(403)  
  }
  let keyData = await client.getData(body.key)
  if (!keyData) {return res.sendStatus(403)}
  if (keyData.product == "busstop") {
    let creatorId = String(body.creator)
    if (keyData.allowedIds[creatorId]) {
      res.sendStatus(200)
    } else {
      console.log("forbidden not allowed creatorid")
      res.sendStatus(403)
    }
  } else {
    console.log("forbidden (incorrect keytype)")
    res.sendStatus(403)
  }
});

const listener = app.listen(2212, function() {
  console.log("Bot is listening on port " + listener.address().port);
});

}

module.exports = api;