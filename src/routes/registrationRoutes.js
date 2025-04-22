const expess = require("express");
const router = expess.Router();
const {authenticateUser, authorizeRole} = require("../middleware/auth.js");
const registrationController = require("../controllers/registerationController.js");

router.post(
    '/:eventId',
    authenticateUser,
    authorizeRole("attendee"),
    registrationController.registerForEvent
);

router.delete(
    '/:eventId',
    authenticateUser,
    authorizeRole("attendee"),
    registrationController.cancelRegistration
);

router.get(
    '/my-events',
    authenticateUser,
    authorizeRole('attendee'),
    registrationController.getMyRegistrations
);
  
module.exports = router;