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

module.exports = { User, TeacherUser };
