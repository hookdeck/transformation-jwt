const jwt = require("jsonwebtoken");

const JWT_SECRET = "__your__secret__";

console.log(jwt.sign({ hello: process.argv[2] ?? "world" }, JWT_SECRET));
