const Registration = require("../models/Registrations");

const registerForEvent = async (req, res) => {
    try {
        const {eventId} = req.params;
        const attendeeId = req.user.id;     //custom field made by auth middleware

        const alreadyRegistred = await Registration.isRegistered(attendeeId, eventId);
        if(alreadyRegistred){
            return res.status(400).json({success: false, message: "You are already registred to this event."});
        }

        await Registration.register(attendeeId, eventId);
        return res.status(200).json({success: true, message: "You have been registered successfully"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}

const cancelRegistration = async (req, res) => {
    try {
        const {eventId} = req.params;
        const attendeeId = req.user.id;

        await Registration.cancel(attendeeId, eventId);
        return res.status(200).json({success: true, message: "Registration Cancelled"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}

const getMyRegistrations = async (req, res) => {
    try {
        const events = await Registration.getByAttendee(req.user.id);
        res.json({ success: true, events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getAllRegistrationsByOrganizer = async (req, res) => {
    try{
        const organizerId = req.params.organizerId;
        const registrations = await Registration.getAllRegistrationsByOrganizer(organizerId);
        res.json(registrations);
    } catch(err){
        res.status(500).json({success: false, message: "Failed to fetch registrations for organizer."})
    }
}
  
module.exports = {
    registerForEvent,
    cancelRegistration,
    getMyRegistrations,
    getAllRegistrationsByOrganizer
}