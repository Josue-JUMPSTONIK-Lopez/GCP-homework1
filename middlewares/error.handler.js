const logErrors = (err,req,res,next) =>{
    // console.log('logErrors\n\n\n\n')
    // console.log(err);
    next(err);
}

const errorHandler = (err,req,res,next) =>{
    // console.log('errorHandler')
    // console.log(err)
    res.status(500).json({
        message: err.message,
        stack: err.stack
    })
}

const boomErrorHandler = (err, req,res, next) =>{

    if (err.isBoom) {
        const {output} = err
        res.status(output.statusCode).json(output.payload);
    }
    next(err);
}

module.exports = {logErrors, errorHandler, boomErrorHandler}