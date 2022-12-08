const db = require("../util/database");

module.exports = class Gym {
    static getAllGyms() {
        return db.execute("SELECT * FROM gyms");
        // return db.execute("CALL getAllGyms");
    }

    static getGym(gymId) {
        return db.execute("SELECT * FROM gyms WHERE gym_id = ?", [gymId]);
        // return db.execute("CALL getGym(?)", [gymId]);
    }

    static addGym(details) {
        const { imageUrl, phone, location, membershipFee } = details;
        return db.execute(
            "INSERT INTO gyms (image_url, phone, location, membership_fee) VALUES (?, ?, ?, ?)",
            [imageUrl, phone, location, membershipFee]
        );
        // return db.execute(
        //     "CALL addGym (?, ?, ?, ?)",
        //     [imageUrl, phone, location, membershipFee]
        // );
    }

    static updateGym(details) {
        const { gymId, imageUrl, phone, location, membershipFee } = details;

        const query =
            "UPDATE gyms SET " +
            "image_url = ?, phone = ?, location = ?, membership_fee = ? " +
            "WHERE gym_id = ?";

        // const query = "CALL updateGym(?, ?, ?, ?, ?)";

        return db.execute(query, [
            imageUrl,
            phone,
            location,
            membershipFee,
            gymId,
        ]);
    }

    static deleteGym(gymId) {
        return db.execute("DELETE FROM gyms WHERE gym_id = ?", [gymId]);
        // return db.execute("CALL deleteGym(?)", [gymId]);
    }
};
