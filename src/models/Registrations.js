const { pool } = require("../config/database");

const Registration = {
    async register(attendeeId, eventId){
        const [result] = await pool.query(
            "INSERT INTO registrations (attendee_id, event_id) VALUES (?, ?)",
            [attendeeId, eventId]
        );
        return result.insertId;
    },

    async cancel(attendeeId, eventId){
        await pool.query(
            "DELETE FROM registrations WHERE attendee_id = ?, event_id = ?",
            [attendeeId, eventId]
        );
    },

    async isRegistered(attendeeId, eventId) {
        const [rows] = await pool.query(
          'SELECT * FROM registrations WHERE attendee_id = ? AND event_id = ?',
          [attendeeId, eventId]
        );
        return rows.length > 0;
    },

      async getByAttendee(attendeeId) {         //shows all the events the attendee is registered in
        const [rows] = await pool.query(
          `SELECT e.* FROM events e
           JOIN registrations r ON e.id = r.event_id
           WHERE r.attendee_id = ?`,
          [attendeeId]
        );
        return rows;
      }
    };

module.exports = Registration;