const req = require("express/lib/request");
const res = require("express/lib/response");

const errorHandler = (err, req, res, next) =>{
    const statusCode =  res.statusCode  ? res.statusCode : 500

    res.status(statusCode)
        res.json({
            message: err.message, 
        })
}


module.exports = {errorHandler,}