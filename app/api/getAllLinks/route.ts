import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Url from "@/models/Url";

export async function GET() {
    try {
        await dbConnect();
        const allLinks = await Url.find().select(
            "originalUrl shortCode clicks -_id"
        );
        return NextResponse.json(allLinks);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
