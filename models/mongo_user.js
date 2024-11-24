const { mongoose } = require('../db_manager/connect_db');

// Define Student Schema
const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true }
}, { collection: "Students" });

// Define Teacher Schema
const teacherSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true }
}, { collection: "Teachers" });

// Create Models with unique names
const User = mongoose.model('Student', userSchema);
const TeacherUser = mongoose.model('Teacher', teacherSchema);
const studentAssignmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    rollNumber: { type: String, required: true },
    assignments: [
        {
            subject: { type: String, required: true },
            files: [
                {
                    fileName: { type: String, required: true },
                    systemPath: { type: String, required: true },
                    uploadedAt: { type: Date, default: Date.now }
                }
            ]
        }
    ]
});
const studentAssignmentModel = mongoose.model('StudentAssignments', studentAssignmentSchema);
const teacherAssignmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    assignments: [
        {
            subject: { type: String, required: true },
            files: [
                {
                    fileName: { type: String, required: true },
                    systemPath: { type: String, required: true },
                    uploadedAt: { type: Date, default: Date.now }
                }
            ]
        }
    ]
});
const teacherAssignmentModel = mongoose.model('TeacherAssignments', teacherAssignmentSchema);
const teacherNotesModel = mongoose.model('TeacherNotes', teacherAssignmentSchema);
module.exports = { User, TeacherUser, studentAssignmentModel, teacherAssignmentModel, teacherNotesModel };
