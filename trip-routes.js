var express = require('express');

var app = module.exports = express.Router();

var Trip = require('./trip');


app.post('/trips', function (req, res) {
    if (!req.body.text) {
        return res.status(400).send({
            "succcess": false,
            "msg": "You need to send the data in trip"
        });
    }

    var newTrip = new Trip({
        text: req.body.text
    });

    newTrip.save(function (err) {
        if (err) {
            console.log("some error", err);
            return res.json({
                "success": false,
                "msg": "Error while creating Trips",
                "error": err
            });
        }
        res.status(201).send({
            "succcess": true,
            "msg": "Successful created new Trip"
        });
    });
});


app.get('/trips', function (req, res) {
    Trip.find({}, function (err, trips) {
        if (err) {
            return res.json({
                "success": false,
                "msg": "Error while retriving Trips",
                "error": err
            });
        }

        res.status(200).send({
            "succcess": true,
            "result": trips
        })
    });
});


app.delete('/trips/:tripId', function (req, res) {
    var lectionId = req.param.tripId;
    if (!lectionId || lectionId === "") {
        return res.json({
            "success": false,
            "msg": "You need the ID of the Trip",
            "error": err
        });
    }
    Trip.findByIdAndRemove(lectionId, function (err, removed) {
        if (err) {
            return res.json({
                "success": false,
                "msg": "Error while deleting Trips",
                "error": err
            });
        }
        res.status(200).json({
            "success": true,
            "msg": "Trip Deleted"
        });
    });
});