const jwt = require("jsonwebtoken");

const getAuthenticate = (req, res, next) => {
    try{
        const cookie = req.session.jwttoken
        const jwtSecretKey = process.env.JWT_SECRET_KEY || "secret" //Is or condition really required??
        const result = jwt.verify(cookie, jwtSecretKey);
        req.result = result.data.data;
        if(result){
            next();
        }
        else{
            res.status(200).json({
                msg:"Re-login"
            })
        }
    }
    catch(e){
        res.status(200).json({
            msg:"Re-login"
        });
    }
}

module.exports = { getAuthenticate };
