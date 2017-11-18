var express = require('express');

var app = module.exports = express.Router();

var Trip = require('./trip');

app.post('/trips', function (req, res) {
    // console.log(req.body);
    if (!req.body.tripName) {
        return res.status(400).send({
            "succcess": false,
            "msg": "You need to send the data in trip"
        });
    }

    // var log = [];
    // var users = [];
    // users.push({
    //     username: req.body.users[0].username,
    //     TakeFromContri: req.body.users[0].TakeFromContri,
    //     paidInCountri: req.body.users[0].paidInCountri
    // });
    // log.push({
    //     contribution: {
    //         amount: req.body.log[0].contribution.amount,
    //         userName: req.body.log[0].contribution.userName
    //     },
    //     // dateAndTime: req.body.log[0].dateAndTime,
    //     expence: {
    //         amount: req.body.log[0].expence.amount,
    //         itemOrThing: req.body.log[0].expence.itemOrThing,
    //         paidFor: req.body.log[0].expence.paidFor,
    //         paidby: req.body.log[0].expence.paidby
    //     }
    // });
    var newTrip = new Trip({
        // text: req.body.text,
        tripName: req.body.tripName,
        fund: {
            contribution: req.body.fund.contribution,
            expence: req.body.fund.expence,
            perHead: req.body.fund.perHead
        },
        // log: log,
        // users: users
    });
    // console.log("Sending DATA", newTrip);

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

app.get('/trips/:tripId', function (req, res) {
    var idLocation = req.params.tripId;
    Trip.find({
        _id: idLocation
    }, function (err, trips) {
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
    console.log(req.body, lectionId);
    var users = {
        username: req.body.username,
        TakeFromContri: req.body.TakeFromContri,
        paidInCountri: req.body.paidInCountri
    };
    var contribution = req.body.contribution;
    var perHead = req.body.perHead;
    var userContri = req.body.userContri;
    var userId = req.body.userId;
    var functionToPerform = function () {
        if (!req.body.username && req.body._id) {
            return 'deletUser';
        } else if (req.body.username) {
            return 'addUser';
        } else if (contribution) {
            return 'updateContribution'
        }
    };
    if (!lectionId || lectionId === "") {
        return res.json({
            "success": false,
            "msg": "You need the ID of the Trip",
            "error": err
        });
    }


    switch (functionToPerform()) {
        case 'addUser':
            console.log("user to push in arry", users);
            Trip.findByIdAndUpdate(lectionId, {
                $push: {
                    users: users
                }
            }, {
                upsert: true
            }, function (req, update, err) {
                // console.log(update)
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
            break;
        case 'deletUser':
            console.log("user to Delete in array", req.body._id);
            Trip.findByIdAndUpdate(lectionId, {
                $pull: {
                    users: {
                        _id: req.body._id
                    }
                }
            }, {
                upsert: true,
                multi: true
            }, function (req, update, err) {
                // console.log(update)
                if (err) {
                    return res.json({
                        "success": false,
                        "msg": "Error while deleting User",
                        "error": err
                    });
                }
                res.status(200).json({
                    "success": true,
                    "msg": "User Deleted"
                });
            });
            break;
        case 'updateContribution':
            console.log("Update Contribution", contribution + "  user contri", userContri);
            Trip.update({
                   _id: lectionId,
                    'users._id': userId
                }, {
                    $set: {
                        'fund.contribution': contribution,
                        'fund.perHead': perHead,
                        'users.$.paidInCountri': userContri
                    }
                }, {
                    upsert: false,
                    multi: true
                },
                function (req, update, err) {
                    // console.log(update)
                    if (err) {
                        return res.json({
                            "success": false,
                            "msg": "Error while Adding Contribution",
                            "error": err
                        });
                    }
                    res.status(200).json({
                        "success": true,
                        "msg": "Contribution updated"
                    });
                });
            break;
    }

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