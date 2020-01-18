const User = require('../models/user.model');
var fs = require('fs');
let mongodb = require('mongodb');
var path = require('path');
const crypto = require('crypto');
const async = require('async');
const nodemailer = require('nodemailer');

exports.user_forgot = function(req, res, next) {
    console.log(req.body)
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                let token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            console.log(req.body.email);
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                    //   console.log('error', 'No account with that email address exists.');
                    let message = 'No account with that email address exists.';
                    req.flash('error', message);
                    return res.redirect('./forgot');
                    // res.send({redirect: '/user/forgot'});
                }
                console.log('step 1')
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            console.log('step 2');

            let smtpTrans = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'mfmsouthchicago@gmail.com',
                    pass: 'S@lv@t1on1987'
                }
            });
            var mailOptions = {

                to: user.email,
                from: 'mfmsouthchicago@gmail.com',
                subject: 'Your Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'

            };
            console.log('step 3');

            smtpTrans.sendMail(mailOptions, function(err) {
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                console.log('sent');
                res.redirect('./forgot');
                // res.send({redirect: '/user/forgot'});
            });
        }
    ], function(err) {
        console.log('this err' + ' ' + err)
        res.redirect('/user/login');
        // res.send({redirect: '/login.html'});
    });
};

exports.user_get_forgot = function(req, res) {
    let errorMessage = req.flash('error');
    let successMessage = req.flash('success');
    let message = errorMessage.length > 0 ? errorMessage : successMessage;
    console.log('b4 render');
    res.render('./forgot', {information: message});//, {User: req.user}
};

exports.user_get_reset = function(req, res) {
    User.findOne({ resetPasswordToken: req.params["token"], resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        console.log(user);
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('../forgot');
        }
        req.flash('success', 'Token found!!, You can now reset your password by creating a new one.');

        let errorMessage = req.flash('error');
        let successMessage = req.flash('success');
        let message = errorMessage.length > 0 ? errorMessage : successMessage;
        console.log(message);

        res.render('reset-user', {information: message});//, {User: req.user}
    });
};

exports.user_reset = function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params["token"], resetPasswordExpires: { $gt: Date.now() } }, function(err, user, next) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('./forgot');
                    // res.send({redirect: '/forgot'});
                }

                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                console.log('password ' + user.password  + ' and the user is' + user)

                user.save(function(err) {
                    if (err) {
                        console.log('here');
                        res.redirect('./not-found');
                        // res.send({redirect: '/user/not-found'});
                    }

                    console.log('here2');
                    res.redirect('/user/login');
                    // res.send({redirect: '/login.html'});
                });
            });
        }, function(user, done) {
            // console.log('got this far 4')
            var smtpTrans = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'mfmsouthchicago@gmail.com',
                    pass: 'S@lv@t1on1987'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'mfmsouthchicago@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                ' - This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTrans.sendMail(mailOptions, function(err) {
                // req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function(err) {
        res.redirect('/');
        // res.send({redirect: '/'});
    });
};


exports.user_create = async (req, res, next) => {

    let userdetails = new User(
        {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        }
    );

    User.find({},function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        if (user.length === 0) {
            userdetails.roles[0] = {"role": "userAdminAnyDatabase", "db": "photoalbumdb"}
        }
        if(user.length > 0) {
            userdetails.roles[0] = {"role": "userOnly", "db": "photoalbumdb"}
        }

        userdetails.save(function (err) {
            if (err) {
                return next(err);
                // return res.status(500).send();
            }
        })
        res.send(userdetails._id);
        // return res.status(200).send();
    });
};

exports.user_login = function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    User.findOne({username: username, password: password}, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).redirect('../../Views/error-not-found');
        }
        if (!user) {
            return res.status(404).redirect('../../Views/not-found');
        }

        req.session.user = user;
        return res.status(200).send(req.session);
    });
};

exports.user_get_login = function (req, res, next) {
    res.redirect('../login.html');//, {User: req.user}
};

exports.user_logout = function (req, res, next) {
    req.session.destroy();
    return res.status(200).send(req.session);
};

exports.admin_dashboard = function (req, res, next) {
    if(!req.session.user){
        return res.status(401).redirect('../../Views/not-found');//user not found
    }

    res.sendFile(path.resolve('./admin', 'admin.html'));
// return res.status(200).send("Welcome");
};

exports.user_not_found = function (req, res, next) {
    res.sendFile(path.resolve('./Views', 'not-found.html'));
};

exports.user_all = function (req, res, next) {
    User.find({}, function (err, users) {
        if (err) return next(err);
        console.log(users);
        res.send(users);
    });
};

exports.user_by = function (req, res, next) {
    User.find({}, function (err, users) {
        if (err) return next(err);

        let foundUsers= [];
        if(req.params.user)
            foundUsers = users.filter((user) => user.username.startsWith(req.params.user));

        res.send(foundUsers);
    });
};

exports.user_details = function (req, res, next) {
    User.findById(req.params.id, function (err, user) {
        if (err) return next(err);
        res.send(user);
    })
};

exports.user_updateRoles = function (req, res, next) {
    var user = {};
    User.findOne({"_id": req.params.id},(err, user)=>{
        user.roles.push(req.body);
        console.log(user);
        user.save((err)=> {
            if (err) {
                return next(err);
            }
        });
        res.send("Role added successfully!!!");
    });
};

exports.user_update = function (req, res, next) {
    User.updateMany({"_id": req.params.id}, {
        $set: {
            "user" : req.body.user,
            "password" : req.body.password,
            // "roles" : [
            //     req.body.roles
            // ]
        }
    },{multi: true}, function (err, userdetails) {
        if (err) return next(err);
        res.send('User udpated.');
    });
};

exports.user_delete = function (req, res, next) {
    // User.findOneAndDelete (req.params.id, function (err) {
    User.deleteOne({_id: new mongodb.ObjectID(req.params.id)}, function(err, events){
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};