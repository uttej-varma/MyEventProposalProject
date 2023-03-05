const Vendor = require("../models/Vendor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express")
const dotenv = require("dotenv");
dotenv.config();

const registerVendor = async (req, res) => {
    try {
        const data = await Vendor.findOne({ email: req.body.email });
        if (data) {
            return res.status(200).json({
                message: "Vendor already exist"
            })
        }
        const number = await Vendor.findOne({ phone: req.body.phone });
        if (number) {
            return res.status(200).json({
                message: "Mobile number already registered"
            })
        }

        const { vendorName, email, password, phone } = req.body;  //adding select as we gave it's default value as empty string
        bcrypt.hash(password, 10, async function (err, hash) {
            if (err) {
                return res.status(500).json({
                    status: "failed",
                    message: err.message
                })
            }
            const dataafterhash = await Vendor.create({
                vendorName,
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
const loginVendor = async (req, res) => {
   try{
    const { phone, password } = req.body;
    const data=await Vendor.findOne({ phone: phone });
    if(data)
    {
        bcrypt.compare(password, data.password).then(result => {
            if (result) {
                let tokenData = {
                    data: data,
                    date: new Date()
                }
                const jwtSecretKey = process.env.JWT_SECRET_KEY || "secret";
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),// 60 min
                    data: tokenData,
                }, jwtSecretKey);
                req.session.jwttoken = token;
                res.status(200).json({
                    msg: "Success"
                })
            } else {
                res.status(200).json({
                    msg: "Unauthorized, Incorrect password"
                })
            }

    })
   }
   else{
    res.status(200).json({
        message:"vendor not registered"
    })
   }
}
catch(e){
    res.status(400).json({
        message:e.message
    })
}
}


const logoutVendor = async (req, res) => {
    req.session.jwttoken = "";
    res.status(200).json({
        msg: "Success",
        result: "Logged Out"
    })
}

const getVendorInfo = (req, res) => {
    if (req.result.vendorName !== undefined) {
        Vendor.findById(req.result._id).then(data => {
            res.status(200).json({
                msg: "Success",
                vendorName: data.vendorName,
                vendorId: data._id
            })
        })
    }

}

module.exports = { registerVendor, loginVendor, logoutVendor, getVendorInfo };
