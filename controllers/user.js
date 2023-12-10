const User = require("../models/user");
const ResetToken = require("../models/resetToken");
const helpers = require("../util/helpers");
const { NODE_ENV } = require("../util/constants");

const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

exports.getAllUsers = async (req, res) => {
    try {
        const [[allUsers]] = await User.getAllUsers();
        allUsers.map((user) => delete user["password"]);
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const email = req.params["email"];
        const [[user]] = await User.getUser(email);
        if (user.length === 0) {
            res.status(401).json({ msg: "User does not exist" });
        } else {
            const detailsToSend = user[0];
            delete detailsToSend["password"];
            detailsToSend["type"] = "member";
            res.json(detailsToSend);
        }
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.addUser = async (req, res) => {
    try {
        const details = {
            email: req.body.email,
            name: req.body.name,
            phone: req.body.phone,
            password: bcrypt.hashSync(req.body.password, salt),
            dob: req.body.dob,
            sex: req.body.sex,
            gymId: req.body.gymId,
        };
        const [[user]] = await User.getUser(details.email);
        if (user.length === 0) {
            await User.addUser(details);

            if (NODE_ENV !== "development") {
                await User.randomlyAssignHealthPlan({
                    gymId: details.gymId,
                    email: details.email,
                });
            }

            const accessToken = helpers.generateAccessToken({
                username: details.email,
                type: "member",
                subscribed: false,
                gymId: details.gymId,
            });

            const [[[newUser]]] = await User.getUser(details.email);
            newUser.username = newUser.email;
            delete newUser["email"];
            res.status(200).json({
                ...newUser,
                accessToken,
            });
        } else {
            res.status(409).json({
                msg: "User with this email already exists",
            });
        }
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.promoteToPayingCustomer = async (req, res) => {
    try {
        const email = req.user.username;
        await User.promoteToPayingCustomer(email);
        const accessToken = helpers.generateAccessToken({
            username: email,
            gymId: req.user.gymId,
            type: "member",
            subscribed: true,
        });
        res.status(200).json({ accessToken });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const details = {
            email: req.params["email"],
            name: req.body.name,
            phone: req.body.phone,
            dob: req.body.dob.substring(0, 10),
            sex: req.body.sex,
            gymId: req.body.gym_id,
        };
        const updatedUser = { ...details };
        if (!req.body.password) {
            const [[user]] = await User.getUser(details.email);
            details.password = user[0].password;
        } else {
            details.password = bcrypt.hashSync(req.body.password, salt);
        }

        await User.updateUser(details);
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const email = req.params["email"];
        await User.deleteUser(email);
        res.status(200).json({ msg: "Success" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
