var express = require('express');

var app = module.exports = express.Router();

var Trip = require('./trip');


app.post('/trips', function (req, res) {
    // console.log(req.body.users[0].username);
    if (!req.body.text) {
        return res.status(400).send({
            "succcess": false,
            "msg": "You need to send the data in trip"
        });
    }
    var log = [];
    var users = [];
    users.push({
        username: req.body.users[0].username,
        TakeFromContri: req.body.users[0].TakeFromContri,
        paidInCountri: req.body.users[0].paidInCountri
    });
    log.push({
        contribution: {
            amount: req.body.log[0].contribution.amount,
            userName: req.body.log[0].contribution.userName
        },
        // dateAndTime: req.body.log[0].dateAndTime,
        expence: {
            amount: req.body.log[0].expence.amount,
            itemOrThing: req.body.log[0].expence.itemOrThing,
            paidFor: req.body.log[0].expence.paidFor,
            paidby: req.body.log[0].expence.paidby
        }
    });
    var newTrip = new Trip({
        text: req.body.text,
        tripName: req.body.tripName,
        fund: {
            contribution: req.body.fund.contribution,
            expence: req.body.fund.expence,
            perHead: req.body.fund.perHead
        },
        log: log,
        users: users
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

app.put('/trips/:tripId', function (req, res) {
    var lectionId = req.params.tripId;
    if (!lectionId || lectionId === "") {
        return res.json({
            "success": false,
            "msg": "You need the ID of the Trip",
            "error": err
        });
    }
    Trip.findByIdAndUpdate(lectionId, {
        $set: {
            tripName: req.body.tripName,
            text: req.body.text,
        }
    }, {
        upsert: true
    }, function (req, update, err) {
        console.log(update)
        if (err) {
            return res.json({
                "success": false,
                "msg": "Error while deleting Trips",
                "error": err
            });
        }
        res.status(200).json({
            "success": true,
            "msg": "Trip udated"
        });
    });
});


app.delete('/trips/:tripId', function (req, res) {
    var lectionId = req.params.tripId;
    if (!lectionId || lectionId === "") {
        return res.json({
            "success": false,
            "msg": "You need the ID of the Trip",
            "error": err
        });
    }
    Trip.findByIdAndRemove(lectionId, function (err, removed) {
        console.log(removed)
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