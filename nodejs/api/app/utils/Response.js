module.exports.success = function (body) {
  let response = {};
  response.code = 200;
  response.body = {data: body || true};
  return response;
};

module.exports.notAcceptable = function (body) {
  let err = {};
  err.code = 406;
  err.body = {data: body || {message: "Value not acceptable"}};
  return err;
};

module.exports.internalServerError = function (body) {
  let err = {};
  err.code = 500;
  err.body = {data: body || {message: "There was an error. Please try again later."}};
  return err;
};

module.exports.notFound = function (body) {
  let err = {};
  err.code = 404;
  err.body = {data: body || {message: "Data not found"}};
  return err;
};

