const Leave = require("../modeles/Leavemodel");
// Get All Leaves Records
const getAllLeave = async (req, res, next) => {
    let leaves;
    try {
        leaves = await Leave.find();
    } catch (error) {
        console.log(err);
    }

    // If no records found
    if (!leaves) {
        return res.status(404).json({ message: "Leaves records not found" });
    }

    return res.status(200).json({ leaves });
};
// Add a Leave Record
const addLeave = async (req, res, next) => {
    const { name, leaveType, department, position, status } = req.body;
    let leaves;

    try {
        leaves = new Leave({ name, leaveType, department, position, status });
        await leaves.save();
    } catch (err) {
        console.log(err);
    }

    if (!leaves) {
        return res.status(400).json({ message: "Unable to add leave record" });
    }

    return res.status(201).json({ leaves });
};

// Get Leave Record by ID
const getLeaveById = async (req, res, next) => {
    const id = req.params.id;
    let leaves;

    try {
        leaves = await Leave.findById(id);
    } catch (err) {
        console.log(err);
    }

    if (!leaves) {
        return res.status(404).json({ message: "Leave record not found" });
    }

    return res.status(200).json({ leaves });
};

// Update a Leave Record
const updateLeave = async (req, res, next) => {
    const id = req.params.id;
    const { name, leaveType, department, position, status } = req.body;
    let leaves;

    try {
        leaves = await Leave.findByIdAndUpdate(id, { name, leaveType, department, position, status }, { new: true });
    } catch (err) {
        console.log(err);
    }

    if (!leaves) {
        return res.status(404).json({ message: "Unable to update leave record" });
    }

    return res.status(200).json({ leaves });
};

// Delete a Leave Record
const deleteLeave = async (req, res, next) => {
    const id = req.params.id;
    let leaves;

    try {
        leaves = await Leave.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }

    if (!leaves) {
        return res.status(404).json({ message: "Unable to delete leave record" });
    }

    return res.status(200).json({ message: "Leave record deleted successfully" });
};

// Export Functions
exports.getAllLeave = getAllLeave;
exports.addLeave = addLeave;
exports.getLeaveById = getLeaveById;
exports.updateLeave = updateLeave;
exports.deleteLeave = deleteLeave;
