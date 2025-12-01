import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Url from "@/models/Url";

export async function DELETE(request: NextRequest) {
    try {
        const { shortCode } = await request.json();
        await dbConnect();
        await Url.deleteOne({ shortCode });
        return NextResponse.json({ message: "success" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
