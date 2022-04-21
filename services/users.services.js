const Boom = require('@hapi/boom');
const db = require('mongoose');
const Model = require('../components/model');

//mongodb+srv://db_user_jumpstonik:Holamundo13579@cluster0.o8awd.mongodb.net/users_db?retryWrites=true&w=majority
db.Promise = global.Promise;
db.connect('mongodb+srv://db_user_jumpstonik:Holamundo13579@cluster0.o8awd.mongodb.net/users_db?retryWrites=true&w=majority',{
    useNewUrlParser: true
})
console.log('[DB] Conectada con exito')

class Users{

    USERS = {

    }

    async createUSer(user, name, email, password, rol){
        if (user != "" && name != "" && email != "" && password != "" && rol != "") {
            const verifyUser = await Model.find({"user": user})
            console.log(verifyUser)
            if (verifyUser.length === 0) {
                const newUser = new Model({
                    user,
                    name,
                    email,
                    rol,
                    password
                }) 
                newUser.save() 
                return {
                    user,
                    name,
                    email,
                    rol,
                }
            }else{
                throw Boom.conflict('User already exist')
            }
        }else{
            throw Boom.notAcceptable('Some params are missing')
        }
    }

    async signIn(user, password){
        if (user != "" && password != "") {
            const verifyUser = await Model.find({"user": user})
            if (verifyUser.length === 1) {
                // console.log()
                if (verifyUser[0].password === password) {
                    return true
                } else {
                    throw Boom.forbidden('Incorrect password')
                }
            }else{
                throw Boom.conflict('user with that username doesnt exist')
            }
        }else{
            throw Boom.notAcceptable('Some params are missing')
        }
    }

    async getUsers(user){
        if (user != "") {
            const verifyUser = await Model.find({"user": user})
            if (verifyUser.length === 1) {
                if (verifyUser[0].rol === 'admin') {
                    const usersList = await Model.find({ "user": { $ne: user } });
                    let allUsers = [];
                    usersList.forEach(item => allUsers.push(item.user) )
                    return allUsers
                } else {
                    throw Boom.forbidden('only admins can have access to see all users')
                }
            }else{
                throw Boom.conflict('This user or admin doesnt exist')
            }
        }else{
            throw Boom.notAcceptable('username is missing')
        }
    }

    async changedPassword(user,oldPassword, repeatPassword, newPassword){
        if (user != "" && oldPassword != "" && repeatPassword != '' && newPassword != '') {
            const verifyUser = await Model.findOne({"user": user})
            if (verifyUser) {
                if (verifyUser.password === oldPassword) {
                    if (oldPassword === repeatPassword) {
                        verifyUser.password = newPassword;
                        verifyUser.save()
                        return true
                    } else {
                        throw Boom.notAcceptable('The old password and repeated password are not the same')
                    }
                } else {
                    throw Boom.forbidden('Incorrect password. The password registered and the password submited dont match')
                }
            }else{
                throw Boom.conflict('user with that username doesnt exist')
            }
        }else{
            throw Boom.notAcceptable('Some params are missing')
        }
    }

    async updateUser(user, name, email, rol){
        if (user != "") {
            const verifyUser = await Model.findOne({"user": user})
            if (verifyUser) {
                if (name != '' && verifyUser.name != name) verifyUser.name = name;
                if (email != '' && verifyUser.email != email) verifyUser.email = email;
                if (rol != '' && verifyUser.rol != rol) verifyUser.rol = rol;
                verifyUser.save();
                console.log(verifyUser)
                return verifyUser
            }else{
                throw Boom.conflict('user with that username doesnt exist')
            }
        }else{
            throw Boom.notAcceptable('username is missing')
        }
    }

    async deleteUser(user){
        if (user != "") {
            const verifyUser = await Model.findOne({"user": user})
            if (verifyUser) {
                await Model.deleteOne({
                    "user": user
                })
                return verifyUser;
            }else{
                throw Boom.conflict('user has never existed')
            }
        }else{
            throw Boom.notAcceptable('username is missing')
        }
    }

    isKeyExists(obj,key){
        if( obj[key] == undefined ){
            return false;
        }else{
            return true;
        }
    }
}

module.exports = Users