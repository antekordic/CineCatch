"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//TODO: delete in production
console.log("JWT_SECRET:", process.env.JWT_SECRET); // Add this line to check
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var movie_router_1 = __importDefault(require("./routers/movie.router"));
var user_router_1 = __importDefault(require("./routers/user.router"));
var database_config_1 = require("./configs/database.config");
// Connect to the database
(0, database_config_1.dbConnect)();
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ credentials: true, origin: ["http://localhost:4200"] }));
app.use("/api/movies", movie_router_1.default);
app.use("/api/users", user_router_1.default);
app.use(express_1.default.static("public"));
app.get("*", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "public", "index.html"));
});
var port = process.env.PORT || 4201;
app.listen(port, function () {
    console.log("Website served on http://localhost:".concat(port));
});
