'use strict'

const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');

const APIKEY = process.env.GOOGLE_APIKEY;
service.get('/service/:location', (req, res, next) => {
  //console.log('incoming location = ' + req.params.location);
  request.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.params.location}&key=${APIKEY}`, (err, response) => {
    if(err) {
      console.log(err);
      return res.sendStatus(500);
    }
    const location = response.body.results[0].geometry.location;
    const timestamp = +moment().format('X');

    request.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + location.lat + ',' + location.lng + '&timestamp=' + timestamp + '&key=AIzaSyDA5cG3yA69OFSBt8WTxNmoJsDN8-cgRsY', (err, response) => {
      if(err) {
        console.log(err);
        return res.sendStatus(500);
      }

      const result = response.body;
      // the method below doesn't work.  had to remove the dstOffset and rawOffset properties
      //const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');

      // this timestamp is GMT with no offset, need to find out how to get it working
      // for different time zones
      // section 3, lecture 4, "Implement time calculation"
      const timeString = moment.unix(timestamp).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');

      res.json({result: timeString});
    });
  })
})

module.exports = service;