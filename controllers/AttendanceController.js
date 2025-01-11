const Hall = require('../models/Hall');
const Event = require('../models/Event');
const Designation = require('../models/Designation');
const Attendance = require('../models/Attendance');

const { pagination } = require('../helpers/index');

async function createHall(req, res) {
    try {
        const hall = new Hall(req.body);
        await hall.save();
        res.status(201).json({
            message: "Hall created successfully",
            data: hall
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function getHalls(req, res) {
    try {
        let userId = req.user._id;
        let filter = {};
        if(req.user.role === "Supervisor") {
            filter.supervisor = userId;
        }
        if(req.params.id) {
            filter.event = req.params.id;
        }
        if(req.query.hallNumber) {
            filter.hallNumber = req.query.hallNumber;
        }
        let { limit, skip } = pagination(req);
        const halls = await Hall.find(filter)
            .sort({
                createdAt: -1
            })
            .limit(limit)
            .skip(skip);
        const count = await Hall.countDocuments(filter);

        res.status(200).json({
            message: "Halls fetched successfully",
            data: halls,
            count
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}


async function updateHall(req, res) {
    try {
        const hall = await Hall.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!hall) {
            return res.status(404).json({ message: "Hall not found" });
        }
        res.status(200).json({
            message: "Hall updated successfully",
            data: hall
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function deleteHall(req, res) {
    try {
        let association = await Attendance.countDocuments({ hall: req.params.id });
        if (association>0) {
            return res.status(400).json({ message: "Hall has "+association+" associated with attendance" });
        }
        const hall = await Hall.findByIdAndDelete(req.params.id);
        if (!hall) {
            return res.status(404).json({ message: "Hall not found" });
        }
        
        res.status(200).json({ message: "Hall deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function createEvent(req, res) {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json({
            message: "Event created successfully",
            data: event
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function getEvents(req, res) {
    try {
        let filter = {};
        if (req.query.name) {
            filter.name = { $regex: req.query.name, $options: 'i' };
        };
        if (req.query.startDate) {
            filter.startDate = { $gte: req.query.startDate };
        }
        if (req.query.endDate) {
            filter.endDate = { $lte: req.query.endDate };
        }
        let {limit, skip} = pagination(req);
        const events = await Event.find(filter)
            .sort({
                createdAt: -1
            })
            .limit(limit)
            .skip(skip)
            .populate('halls')

        const count = await Event.countDocuments(filter);
        res.status(200).json({
            message: "Events fetched successfully",
            data: events,
            count
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}


async function updateEvent(req, res) {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({
            message: "Event updated successfully",
            data: event
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function deleteEvent(req, res) {
    try {
        
        let association = await Hall.countDocuments({ event: req.params.id });
        if (association>0) {
            return res.status(400).json({ message: "Event has "+association+" associated with Hall" });
        }
        const hall = await Hall.findByIdAndDelete(req.params.id);
        if (!hall) {
            return res.status(404).json({ message: "Event not found" });
        }
        
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}


async function createAttendance(req, res) {
    try {
        let userId = req.user._id;
        const attendance = new Attendance({...req.body , createdBy: userId});
        await attendance.save();
        res.status(201).json({
            message: "Attendance created successfully",
            data: attendance
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function getAttendances(req, res) {
    try {
        let userId = req.user._id;
        let { limit, skip } = pagination(req);
        let filter = {};
        if (req.query.designation) {
            filter.designation = req.query.designation;
        }
        if (req.params.hall) {
            filter.hall = req.params.hall;
        }
        if (req.query.date) {
            filter.date = req.query.date;
        }
        if (req.query.shift) {
            filter.shift = req.query.shift;
        }
        if(req.user.role === "Supervisor") {
            filter.createdBy = userId;
        }
        const attendances = await Attendance.find(filter)
            .sort({
                createdAt: -1
            })
            .limit(limit)
            .skip(skip)
            .populate('designation')
            .populate('createdBy')
            .populate('hall');

        const count = await Attendance.countDocuments(filter);

        res.status(200).json({
            message: "Attendances fetched successfully",
            data: attendances,
            count
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}


async function updateAttendance(req, res) {
    try {
        if(req.body.createdAt) {
            return res.status(400).json({ message: "Designation cannot be updated" });
        }
        const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found" });
        }
        res.status(200).json(attendance);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function deleteAttendance(req, res) {
    try {
        const attendance = await Attendance.findByIdAndDelete(req.params.id);
        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found" });
        }
        res.status(200).json({ message: "Attendance deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}


async function createDesignation(req, res) {
    try {
        const designation = new Designation(req.body);
        await designation.save();
        res.status(201).json({
            message: "Designation created successfully",
            data: designation
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function getDesignations(req, res) {
    try {
        let { limit, skip } = pagination(req);
        const designations = await Designation.find()
            .sort({
                createdAt: -1
            })
            .limit(limit)
            .skip(skip);
        const count = await Designation.countDocuments();
        res.status(200).json({ 
            message: "Designations fetched successfully",
            data: designations, 
            count 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}


async function updateDesignation(req, res) {
    try {
        const designation = await Designation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!designation) {
            return res.status(404).json({ message: "Designation not found" });
        }
        res.status(200).json(designation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function deleteDesignation(req, res) {
    try {
        const designation = await Designation.findByIdAndDelete(req.params.id);
        if (!designation) {
            return res.status(404).json({ message: "Designation not found" });
        }
        let association = await Attendance.countDocuments({ designation: req.params.id });
        if (association>0) {
            return res.status(400).json({ message: "Designation has "+association+" associated with attendance" });
        }
        res.status(200).json({ message: "Designation deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

module.exports = {
    createHall,
    getHalls,
    updateHall,
    deleteHall,
    
    createEvent,
    getEvents,
    updateEvent,
    deleteEvent,

    
    createAttendance,
    getAttendances,
    updateAttendance,
    deleteAttendance,

    
    createDesignation,
    getDesignations,
    updateDesignation,
    deleteDesignation
};