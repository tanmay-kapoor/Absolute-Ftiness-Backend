const db = require("../util/database");

module.exports = class Staff {
    static getAllStaff() {
        return db.execute("CALL getAllStaff()");
    }

    static getStaff(staffId) {
        return db.execute("CALL getStaff(?)", [staffId]);
    }

    static async canDeleteStaff(staffId) {
        await db.execute("CALL admin_delete_check(?, @canDelete)", [staffId]);
        return db.execute("SELECT @canDelete as canDelete");
    }

    static addStaff(details) {
        const {
            staffId,
            name,
            phone,
            dob,
            sex,
            type,
            partTime,
            salary,
            description,
            password,
            gymId,
        } = details;

        return db.execute("CALL addStaff (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
            staffId,
            name,
            phone,
            dob,
            sex,
            type,
            partTime,
            salary,
            description,
            password,
            gymId,
        ]);
    }

    static updateStaff(details) {
        const {
            staffId,
            name,
            phone,
            dob,
            sex,
            type,
            partTime,
            salary,
            description,
            password,
        } = details;

        return db.execute("CALL updateStaff(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
            name,
            phone,
            dob,
            sex,
            type,
            partTime,
            salary,
            description,
            password,
            staffId,
        ]);
    }

    static promoteToAdmin(staffId) {
        return db.execute("CALL promoteStaffToAdmin(?)", [staffId]);
    }

    static deleteStaff(staffId) {
        return db.execute("CALL deleteStaff(?)", [staffId]);
    }
};
