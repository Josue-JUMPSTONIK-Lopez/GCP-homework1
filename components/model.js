const mongoose = require('mongoose');

const Schema =  mongoose.Schema;

const mySchema =  new Schema({
    user: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    },
});

const Model = mongoose.model("Users", mySchema);

module.exports = Model;