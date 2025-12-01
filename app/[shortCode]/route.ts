import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Url from "@/models/Url";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ shortCode: string }> }
) {
    try {
        await dbConnect();
        const { shortCode } = await params;
        const url = await Url.findOneAndUpdate(
            { shortCode: shortCode },
            { $inc: { clicks: 1 } }, // increment by 1
            { new: true } // return updated document
        );

        if (!url) {
            return new Response("URL not found", { status: 404 });
        }

        return Response.redirect(url.originalUrl); 
    } catch (error) {
        console.error("Redirect error:", error);
        return new Response("Server error", { status: 500 });
    }
}
