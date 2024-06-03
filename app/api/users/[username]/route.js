import connectMongoDB from "@/libs/mongoose"
import User from "@/models/users"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
    const { username } = params
    await connectMongoDB()
    const user = await User.findOne({ username: username })
    return NextResponse.json({user})
}
