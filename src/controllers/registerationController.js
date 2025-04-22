const Registration = require("../models/Registrations");

const registerForEvent = async (req, res) => {
    const {eventId} = req.params;
    const attendeeId = req.user.id;     //custom field made by auth middleware

    const alreadyRegistred = await Registration.isRegistered(attendeeId, eventId);
    if(alreadyRegistred){
        return res.status(400).json({success: false, message: "You are already registred to this event."});
    }

    await Registration.register(attendeeId, eventId);
    return res.status(200).json({success: true, message: "You have been registered successfully"});
}

const cancelRegistration = async (req, res) => {
    const {eventId} = req.params;
    const attendeeId = req.user.id;

    await Registration.cancel(attendeeId, eventId);
    return res.status(200).json({success: true, message: "Registered Cancelled"});
}

const getMyRegistrations = async (req, res) => {
    const events = await Registration.getByAttendee(req.user.id);
    res.json({ success: true, events });
  };
  
module.exports = {
    registerForEvent,
    cancelRegistration,
    getMyRegistrations
}