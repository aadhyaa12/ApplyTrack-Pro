
const express = require("express");
const router = express.Router();
const db = require("./db");
const authMiddleware = require("./middleware/authMiddleware");
console.log("Application routes loaded successfully!");
router.use(authMiddleware);
router.get("/applications", (req, res) => {
    res.json({
        message: "Applications route is working!"
    });
});
// Add a new job application
router.post("/applications", (req, res) => {
    
    const {
    company_name,
    job_role,
    location,
    application_date,
    status,
    job_description,
    interview_date,
    interview_notes
} = req.body;

    if (!company_name || !job_role) {
        return res.status(400).json({
            message: "Company name and job role are required"
        });
    }

    
    const sql = `
    INSERT INTO applications
    (company_name, job_role, location, application_date, status,
    job_description, interview_date, interview_notes, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
    const values = [
    company_name,
    job_role,
    location || null,
    application_date || null,
    status || "Applied",
    job_description || null,
    interview_date || null,
    interview_notes || null,
    req.user.id
];
    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Could not add application",
                error: err.message
            });
        }

        res.status(201).json({
            message: "Application added successfully!",
            applicationId: result.insertId
        });
    });
});
// Get all job applications
router.get("/applications/all", (req, res) => {
    const sql = `
        SELECT * FROM applications
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [req.user.id], (err, results) => {
        if (err) {
            console.log("GET applications error:", err.message);

            return res.status(500).json({
                message: "Could not fetch applications",
                error: err.message
            });
        }

        console.log("Applications fetched:", results.length);
        res.json(results);
    });
});

// Delete an application
router.delete("/applications/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM applications WHERE id = ? AND user_id = ?";

db.query(sql, [id, req.user.id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Could not delete application",
                error: err.message
            });

        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json({
            message: "Application deleted successfully!"
        });
    });
});


// Update an existing application
router.put("/applications/:id", (req, res) => {
    const { id } = req.params;
    console.log("UPDATE REQUEST DATA:", req.body);

    const {
    company_name,
    job_role,
    location,
    application_date,
    status,
    job_description,
    interview_date,
    interview_notes
} = req.body;

    if (!company_name || !job_role) {
        return res.status(400).json({
            message: "Company name and job role are required"
        });
    }

    const sql = `
    UPDATE applications
    SET company_name = ?,
        job_role = ?,
        location = ?,
        application_date = ?,
        status = ?,
        job_description = ?,
        interview_date = ?,
        interview_notes = ?
WHERE id = ? AND user_id = ?
`;
    const values = [
    company_name,
    job_role,
    location || null,
    application_date || null,
    status || "Applied",
    job_description || null,
    interview_date || null,
    interview_notes || null,
    id,
    req.user.id
];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Could not update application",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json({
            message: "Application updated successfully!"
        });
    });
});




module.exports = router;
