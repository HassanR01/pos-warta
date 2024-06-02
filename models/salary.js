import mongoose, { Schema } from "mongoose";

const salarySchema = new Schema({
    for: String,
    user: String,
    salary: Number,
    branch: String,
}, { timestamps: true })

const Salary = mongoose.models.Salary || mongoose.model('Salary', salarySchema)

export default Salary;