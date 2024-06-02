import { Schema } from "mongoose";

const itemSchema = new Schema({
    title: String,
    prices: [{
        branch: String,
        price: Number,
    }],
    category: String,
    description: String,
})