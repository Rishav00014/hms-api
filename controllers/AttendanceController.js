const Hall = require('../models/Hall');
const Event = require('../models/Event');
const Designation = require('../models/Designation');
const Attendance = require('../models/Attendance');
const VenderCode = require('../models/VenderCode');
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
        if (req.user.role === "Supervisor") {
            filter.supervisor = userId;
        }
        if (req.params.id) {
            filter.event = req.params.id;
        }
        if (req.query.hallNumber) {
            filter.hallNumber = req.query.hallNumber;
        }
        let { limit, skip } = pagination(req);
        const halls = await Hall.find(filter)
            .sort({
                createdAt: -1
            })
            .limit(limit)
            .skip(skip)
            .populate("supervisor")
            .populate("event");

        const count = await Hall.countDocuments(filter)
            .populate("event");

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
        if (association > 0) {
            return res.status(400).json({ message: "Hall has " + association + " associated with attendance" });
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
        let { limit, skip } = pagination(req);
        const events = await Event.find(filter)
            .sort({
                createdAt: -1
            })
            .limit(limit)
            .skip(skip);

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
        if (association > 0) {
            return res.status(400).json({ message: "Event has " + association + " associated with Hall" });
        }
        const hall = await Event.findByIdAndDelete(req.params.id);
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
        let designation = await Designation.findById(req.body.designation);
        let identifier = `${req.body.venderCode.toLowerCase().trim()}-${req.body.name.toLowerCase().trim()}-${designation.title.toLowerCase().trim()}`;
        const attendance = new Attendance({
            ...req.body,
            createdBy: userId,
            identifier
        });
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
        if (req.query.createdAt) {
            // should contain all attendance of that day 
            filter.createdAt = {
                $gte: new Date(req.query.createdAt).setHours(0, 0, 0, 0),
                $lt: new Date(req.query.createdAt).setHours(23, 59, 59, 999)
            }
        }
        if (req.query.shift) {
            filter.shift = req.query.shift;
        }
        if (req.user.role === "Supervisor") {
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
            .populate('hall')
            .populate('venderCode');

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
        if (req.body.createdAt) {
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
        if (association > 0) {
            return res.status(400).json({ message: "Designation has " + association + " associated with attendance" });
        }
        res.status(200).json({ message: "Designation deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function getAllEvents(req, res) {
    try {
        let events = await Event.find()
            .sort({
                createdAt: -1
            });
        res.status(200).json({
            message: "Events fetched successfully",
            data: events
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

async function getAllDesignations(req, res) {
    try {
        let designations = await Designation.find()
            .sort({
                createdAt: -1
            });
        res.status(200).json({
            message: "Designations fetched successfully",
            data: designations
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function getAllVendorCodes(req, res) {
    try {
        let vendorCodes = await VenderCode.find()
            .sort({
                createdAt: -1
            });
        res.status(200).json({
            message: "Vendor Codes fetched successfully",
            data: vendorCodes
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}


async function generateEventReport(req, res) {
    try {
        let eventId = req.params.id;
        if (!eventId) {
            return res.status(400).json({ message: "Event id is required" });
        }
        let reportData = [];

        let eventDetails = await Event.find({
            _id: eventId
        })

        let filter = {
            event: eventId
        };
        let hallList = await Hall.find(filter);

        filter = {};
        if (req.query.createdAt) {
            // should contain all attendance of that day 
            filter.createdAt = {
                $gte: new Date(req.query.createdAt).setHours(0, 0, 0, 0),
                $lt: new Date(req.query.createdAt).setHours(23, 59, 59, 999)
            }
        }
        if (req.query.shift && req.query.shift !== "all") {
            filter.shift = req.query.shift;
        }
        if (req.query.designation && req.query.designation !== "all") {
            filter.designation = req.query.designation;
        }

        if (req.query.venderCode && req.query.venderCode !== "all") {
            filter.venderCode = req.query.venderCode;
        }

        for (let i = 0; i < hallList.length; i++) {
            filter.hall = hallList[i]._id;
            let attendance = await Attendance.find(filter)
                .populate("venderCode")
                .populate("designation")
                .sort({
                    createdAt: -1
                })
                .lean();

            for (let j = 0; j < attendance.length; j++) {
                let data = {
                    hall: hallList[i].hallNumber,
                    vendorCode: attendance[j].venderCode.code,
                    image: attendance[j].image,
                    name: attendance[j].name,
                    position: attendance[j].position,
                    designation: attendance[j].designation.title,
                    date: attendance[j].date,
                    shift: attendance[j].shift
                };
                reportData.push(data);
            }
        }

        res.status(200).json({
            message: "Events fetched successfully",
            data: reportData,
            event: eventDetails
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


const getDateRangeWithShifts = (startDate, endDate) => {
    const result = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        const formattedDate = currentDate.toISOString().split("T")[0];
        result.push(`${formattedDate}-day`);
        result.push(`${formattedDate}-night`);

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
};
const formatDate = (date) => {
    const [day, month, year] = [
        date.getDate(),
        date.getMonth() + 1,
        date.getFullYear(),
    ].map(num => String(num).padStart(2, '0'));

    return `${year}-${month}-${day}`;
};

async function generateAttendanceSheet(req, res) {
    try {
        const eventId = req.params.id;
        if (!eventId) {
            return res.status(400).json({ message: "Event id is required" });
        }

        const event = await Event.findById(eventId).lean();
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        let halls = await Hall.find({ event: eventId }).lean();
        let hallIds = halls.map(hall => hall._id);
        const attendances = await Attendance.find({ hall: { $in: hallIds } })
            .populate('venderCode', 'code')
            .populate('designation', 'title')
            .lean();
        console.log(attendances.length);
        const dateShiftColumns = getDateRangeWithShifts(event.startDate, event.endDate);
        const register = [];
        const attendanceMap = new Map();

        // Pre-group attendances by identifier
        for (const attendance of attendances) {
            if (!attendanceMap.has(attendance.identifier)) {
                attendanceMap.set(attendance.identifier, {
                    "Vendor Code": attendance.venderCode?.code || "",
                    "Designation": attendance.designation?.title || "",
                    "Name": attendance.name,
                    "Total": 0
                });

                // Initialize date shift columns to 0
                for (const col of dateShiftColumns) {
                    attendanceMap.get(attendance.identifier)[col] = 0;
                }
            }
        }

        // Populate the date-shift columns
        for (const attendance of attendances) {
            const identifier = attendance.identifier;
            const dateShiftKey = `${formatDate(attendance.createdAt)}-${attendance.shift}`;

            if (attendanceMap.has(identifier)) {
                const record = attendanceMap.get(identifier);
                if (record.hasOwnProperty(dateShiftKey)) {
                    record[dateShiftKey] = 1;
                    record["Total"] += 1;
                }
            }
        }

        // Convert map values to array
        res.status(200).json({
            message: "Attendance sheet generated successfully",
            data: Array.from(attendanceMap.values())
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}



async function createVendorCode(req, res) {
    try {
        const vendorCode = new VenderCode(req.body);
        await vendorCode.save();
        res.status(201).json({
            message: "Vendor Code created successfully",
            data: vendorCode
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function getVendorCodes(req, res) {
    try {
        let { limit, skip } = pagination(req);
        const vendorCodes = await VenderCode.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);
        const count = await VenderCode.countDocuments();
        res.status(200).json({
            message: "Vendor Codes fetched successfully",
            data: vendorCodes,
            count
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function updateVendorCode(req, res) {
    try {
        const vendorCode = await VenderCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vendorCode) {
            return res.status(404).json({ message: "Vendor Code not found" });
        }
        res.status(200).json(vendorCode);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function deleteVendorCode(req, res) {
    try {
        const vendorCode = await VenderCode.findByIdAndDelete(req.params.id);
        if (!vendorCode) {
            return res.status(404).json({ message: "Vendor Code not found" });
        }
        res.status(200).json({ message: "Vendor Code deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}


module.exports = {
    createHall, getHalls, updateHall, deleteHall,
    createEvent, getEvents, updateEvent, deleteEvent,
    createAttendance, getAttendances, updateAttendance, deleteAttendance,
    createDesignation, getDesignations, updateDesignation, deleteDesignation,
    createVendorCode, getVendorCodes, updateVendorCode, deleteVendorCode,
    getAllEvents,getAllDesignations,getAllVendorCodes,
    generateEventReport, generateAttendanceSheet
};