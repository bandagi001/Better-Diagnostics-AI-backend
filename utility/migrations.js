const { executeQuery } = require('./dbqueries');

async function ensureVoiceTranscriptionTable() {
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS VoiceTranscription (
            _id INT NOT NULL AUTO_INCREMENT UNIQUE,
            patientId INT NOT NULL,
            recognizedText LONGTEXT,
            aiFormattedNotes LONGTEXT,
            summary LONGTEXT,
            PRIMARY KEY (_id),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
    `;
    // Add FK separately to avoid failing if Patient table differs or missing permissions
    const addFkSql = `
        ALTER TABLE VoiceTranscription
        ADD CONSTRAINT IF NOT EXISTS fk_patient_transcription
        FOREIGN KEY (patientId) REFERENCES Patient(_id);
    `;
    try {
        await executeQuery(createTableSql);
        try {
            await executeQuery(addFkSql);
        } catch (e) {
            // ignore if FK already exists or insufficient privileges
        }
    } catch (e) {
        console.error('Failed to ensure VoiceTranscription table:', e);
    }
}

module.exports = {
    ensureVoiceTranscriptionTable
};


