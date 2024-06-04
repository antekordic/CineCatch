"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
var mongoose_1 = require("mongoose");
var dbConnect = function () {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not defined in environment variables");
        process.exit(1);
    }
    (0, mongoose_1.connect)(process.env.MONGO_URI, {})
        .then(function () { return console.log("Database connected successfully"); })
        .catch(function (error) {
        console.error("Database connection error:", error);
        process.exit(1); // Exit the process with an error code
    });
};
exports.dbConnect = dbConnect;
