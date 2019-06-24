module.exports.notAcceptable = function(body){
    let err = {};
    err.code = 406;
    err.body = body;
    return err;
};

module.exports.internalServerError = function(body){
    let err = {};
    err.code = 500;
    err.body = body;
    return err;
};
