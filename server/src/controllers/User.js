const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const express = require("express") ///no need for express so commenting it out....
const dotenv = require("dotenv");
const cook = require("cookie-parser");
const session = require("express-session");
dotenv.config();

const registerUser = async (req, res) => {
    try {

        const data = await User.findOne({ email: req.body.email });
        if (data) {
            return res.status(200).json({
                message: "user already exist"
            })
        }
        const number = await User.findOne({ phone: req.body.phone });
        if (number) {
            return res.status(200).json({
                message: "mobile number already registered"
            })
        }

        const { userName, email, password, phone } = req.body;  //adding select as we gave it's default value as empty string
        bcrypt.hash(password, 10, async function (err, hash) {
            if (err) {
                return res.status(500).json({
                    status: "failed",
                    message: err.message
                })
            }
            const dataafterhash = await User.create({
                userName,
                email,
                password: hash,
                phone,
            })
            res.status(201).json({
                message: "registered successfully",
                dataafterhash

            })
        });
    }
    catch (err) {
        res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
}

const loginUser =async  (req, res) => {

    try {

        const { phone, password } = req.body;
        const user=await User.findOne({ phone });
        if(user)
        {
        
            bcrypt.compare(password, user.password, function (err, result) {
                if (err) {
                    return res.status(500).json({
                        status: "failed",
                        message: err.message
                    })
                }
                if (result) {
                    let tokenData = {
                        data: user,
                        date: new Date()  ///new date is for handling logout where we forcefully expire the token..
                    }
    
                    const jwtSecretKey = process.env.JWT_SECRET_KEY || "secret";
                    const token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),// 5 min
                        data: tokenData,
                    }, process.env.JWT_SECRET_KEY);
                    req.session.jwttoken = token
                    res.status(200).json({
                        status: "success",
                        message: "user logged in"
                    })
                }
                else {
                    res.status(200).json({
                        status: "failed",
                        message: "invalid credentials"
                    })
                }
                
            });
        }
        else{
            res.status(200).json({
                message:"user not registered"
            })
        }

   


    }
    catch (e) {
        res.status(400).json({
            status: "failed",
            message: e.message
        })
    }
}

const logoutUser = async (req, res) => {
    req.session.jwttoken = "";
    res.status(200).json({
        message: "Logged Out Successfully"
    })
}

const getUserInfo = async (req, res) => {                        //here we are getting req.result from authentication step
    if (req.result.vendorName === undefined) {
        const data = await User.findById(req.result._id)
        res.status(200).json({
            msg: "Success",
            result: data
        })

    } else {
        res.status(400).json({
            msg: "Failure"
        })
    }
}

const updateSelection = (req, res) => {

    User.findByIdAndUpdate(req.params.userId, req.body).then(data => {
        res.status(200).json({
            msg: "Success",
            result: data
        })
    }).catch(err => {
        res.status(400).json({
            msg: "Failure",
            result: err
        })
    })

}


module.exports = { registerUser, loginUser, logoutUser, getUserInfo, updateSelection };
