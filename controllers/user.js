const User = require("../models/user");
const healthRecordController = require("./healthRecord");
const workoutPlanController = require("./workoutPlan");
const dietPlanController = require("./dietPlan");

const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

exports.getAllUsers = async (req, res) => {
    try {
        const [allUsers] = await User.getAllUsers();
        allUsers.map((user) => delete user["password"]);
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const email = req.params["email"];
        const [user] = await User.getUser(email);
        if (user.length === 0) {
            res.status(401).json({ msg: "User does not exist" });
        } else {
            delete user[0]["password"];
            res.json(user[0]);
        }
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.authenticate = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        let [user] = await User.getUser(username);
        if (user.length == 0) {
            res.status(404).json({
                msg: `User does not exist`,
            });
        } else {
            user = user[0];

            bcrypt.compare(password, user.password, (err, found) => {
                if (!found) {
                    res.status(401).json({ msg: "Incorrect password" });
                } else {
                    res.status(200).json({ msg: "Success" });
                    // jwt stuff
                }
            });
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
        await User.addUser(details);
        res.status(200).json({ msg: "Success" });
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
            password: bcrypt.hashSync(req.body.password, salt),
            dob: req.body.dob,
            sex: req.body.sex,
            gymId: req.body.gymId,
        };

        await User.updateUser(details);
        res.status(200).json({ msg: "Success" });
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

// exports.getHealthRecordsForUser = async (req, res) => {
//     return await healthRecordController.getHealthRecordsForUser(req, res);
// };

// exports.addHealthRecordForUser = async (req, res) => {
//     return await healthRecordController.addHealthRecord(req, res);
// };

// exports.getHealthPlan = async (req, res) => {
//     try {
//         const [healthPlan] = await User.getHealthPlan(req.params["email"]);
//         res.status(200).json(healthPlan[0]);
//     } catch (err) {
//         res.status(500).json({ msg: err.message });
//     }
// };

// exports.getWorkoutPlan = async (req, res) => {
//     return workoutPlanController.getWorkoutPlanForUser(req, res);
// };

// exports.getDietPlan = async (req, res) => {
//     return dietPlanController.getDietPlanForUser(req, res);
// };
