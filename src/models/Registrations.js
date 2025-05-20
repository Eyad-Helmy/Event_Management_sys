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
            "DELETE FROM registrations WHERE attendee_id = ? AND event_id = ?",
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
      },
    
    async getAllRegistrationsByOrganizer(organizerId) {
    const [rows] = await pool.query(`
      SELECT 
        r.id AS registration_id,
        r.event_id,
        r.attendee_id,
        r.registration_date,
        e.title AS event_title,
        e.date AS event_date,
        u.username AS attendee_name,
        u.email AS attendee_email
      FROM registrations r
      INNER JOIN events e ON r.event_id = e.id
      INNER JOIN users u ON r.attendee_id = u.id
      WHERE e.organizer_id = ?
      ORDER BY e.date ASC, r.registration_date ASC
    `, [organizerId]);
    return rows;
    },
    };

module.exports = Registration;