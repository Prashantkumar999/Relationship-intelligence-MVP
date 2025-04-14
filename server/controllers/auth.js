const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

//sign up 
exports.signUp = async (req, res) => {
    try {
        // 1. Extract and trim data
        const { username, email, password, confirmPassword } = req.body;

        // 2. Validate all fields
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // 3. Check if user already exists
        const existingUser = await User.findOne({ email: email.trim() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists. Try logging in instead."
            });
        }

        // 4. Confirm password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        // 5. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6. Create user in DB
        const newUser = await User.create({
            name: username.trim(),
            email: email.trim(),
            password: hashedPassword
        });

        // 7. Hide password in console
        console.log({ ...newUser._doc, password: "********" });

        // 8. Send success response
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!"
        });
    }
};
//sign in 

exports.signIn = async (req, res) => {
    try {
        // 1. Extract email & password
        const { email, password } = req.body;

        // 2. Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Both email and password are required"
            });
        }

        // 3. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist"
            });
        }

        // 4. Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        // 5. Create JWT payload
        const payload = {
            id: user._id,
            email: user.email,
        };

        // 6. Sign token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h"
        });

        // 7. Set token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
            sameSite: "Lax", // Or "None" if frontend is on different domain
            secure: false // Set true in production with HTTPS
        });

        // 8. Hide password before sending response
        user.password = undefined;

        // 9. Send success response
        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            token,
            user
        });

    } catch (error) {
        console.error("Sign-in error:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong during sign-in"
        });
    }
};
