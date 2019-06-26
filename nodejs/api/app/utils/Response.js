module.exports.success = function(body){
    let response = {};
    response.code = 200;
    response.body = {data:body};
    return response;
};

module.exports.notAcceptable = function(body){
    let err = {};
    err.code = 406;
    err.body = {data:body};
    return err;
};

module.exports.internalServerError = function(body){
    let err = {};
    err.code = 500;
    err.body = {data:body};
    return err;
};

module.exports.notFound = function(body) {
    let err = {};
    err.code = 404;
    err.body = {data: body};
    return err;
};

