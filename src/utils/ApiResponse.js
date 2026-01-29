const ApiResponse = (statusCode, data, message = "Success") =>{
    statusCode = statusCode
    data = data
    message = message
    success = statusCode < 400
};

module.exports = {
    ApiResponse,
    ApiError,
}