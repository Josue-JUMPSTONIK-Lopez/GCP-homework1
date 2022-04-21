// Importing the express module
const express = require('express');
const cors = require('cors');
const Users = require('./services/users.services');
const {logErrors, errorHandler, boomErrorHandler} = require('./middlewares/error.handler');

// Initializing the express and port number
var app = express();
var PORT = process.env.PORT || 4000;

// Calling the express.json() method for parsing
app.use(express.json());
app.use(cors())

//Intialize services
const userService = new Users();

// Create user
app.post('/users', async(req, res, next) => {
    try {
        const user = req.body.user;
        const name = req.body.name
        const email = req.body.email;
        const password = req.body.password;
        const rol = req.body.rol;
        const newUser=  await userService.createUSer(user,name,email,password,rol);
        res.status(200).send(
            {message: "User created",
            newUser})
    } catch (error) {
        next(error)
    }
})

app.get('/users/signin/', async(req,res,next) =>{
    try {
        const user = req.query.user;
        const password = req.query.password;
        console.log('hey')
        const isAccepted = await userService.signIn(user, password);
        res.status(200).send({
            message: "Password is correct",
            isAccepted
        })
    } catch (error) {
        next(error)
    }
})

app.get('/users/:user', async(req, res, next)=>{
    try {
        const user = req.params.user;
        const users = await userService.getUsers(user)
        res.status(200).send({
            message: "All users were obtained successfully",
            users
        })
    } catch (error) {
        next(error)
    }
})

app.put('/users/password', async(req, res, next)=>{
    try {
        const user = req.body.user;
        const oldPassword = req.body.oldPassword;
        const repeatPassword = req.body.repeatPassword;
        const newPassword = req.body.newPassword;
        const wasChanged = await userService.changedPassword(user, oldPassword, repeatPassword, newPassword);
        res.status(200).send({
            message: "Password was changed successfully",
            wasChanged
        })
    } catch (error) {
        next(error)
    }
})

app.put('/users', async(req, res, next) =>{
    try {
        const user = req.body.user;
        const name = req.body.name;
        const email = req.body.email;
        const rol = req.body.rol;
        const userUpdated = await userService.updateUser(user, name, email, rol)
        res.status(200).send({
            message: "Your user was updated",
            userUpdated
        })
    } catch (error) {
        next(error)
    }
})

app.delete('/users', async(req, res, next)=>{
    try {
        const user = req.body.user;
        const userDeleted = await userService.deleteUser(user);
        res.status(200).send({
            message: "user was deleted successfully",
            userDeleted
        })
    } catch (error) {
        next(error)
    }
})

app.get('/api', async(req, res, next) =>{
    try {
        res.status(200).send({version: "v1.0.0"})
    } catch (error) {
        next(error)
    }
})

app.use(logErrors);
app.use(boomErrorHandler)
app.use(errorHandler)

// Listening to the port
app.listen(PORT, function(err){
   if (err) console.log(err);
   console.log("Server listening on PORT", PORT);
});