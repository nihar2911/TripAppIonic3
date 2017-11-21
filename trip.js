 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 var TripSchema = new Schema({
     //  text: String,
     tripName: {
         type: String,
         required: true
     },
     fund: {
         contribution: Number,
         expence: Number,
         perHead: Number
     },
     log: [{
         dateAndTime: {
             type: Date,
             default: Date.now
         },
         amount: Number,
         itemOrThing: String,
     }],
     users: [{
         username: String,
         TakeFromContri: Number,
         paidInCountri: Number
     }],
     created_at: Date,
 });

 TripSchema.pre('save', function (next) {
     var trip = this;

     //get the current date
     var currentDate = new Date();

     //if created_at donsent exist, add to that field

     if (!trip.created_at) {
         trip.created_at = currentDate;
     }
     next();
 });

 module.exports = mongoose.model('Trip', TripSchema);