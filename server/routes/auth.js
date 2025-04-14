const express = require("express")
const router = express.Router();

const { signUp, signIn } = require("../controllers/auth");

//sign-up route
router.post("/signup", signUp)

//sign-in route
router.post("/signin", signIn)

module.exports = router;