class ApiResponse
{
    constructor(statusCode, message = "Success", data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }
}


export { ApiResponse };
// ApiResponse is a class that standardizes how successful API responses are structured.
// When you create a new ApiResponse object, you provide:
// statusCode → HTTP status code (like 200 for success, 404 for not found)
// message → A brief message about the response (default is "Success")
// data → The actual data you want to send back to the client (like user info, list of items, etc.)