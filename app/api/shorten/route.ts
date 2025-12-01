import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Url from "@/models/Url";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();
        if (!url || !isValidUrl(url))
            return NextResponse.json(
                { message: "Please provide a valid URL" },
                { status: 400 }
            );

        await dbConnect();

        let shortCode: string = "";
        let exists;
        let attempts = 0;
        const maxAttempts = 10;

        do {
            shortCode = nanoid(6);
            exists = await Url.findOne({ shortCode });
            attempts++;

            if (attempts >= maxAttempts) {
                shortCode = nanoid(8);
                break;
            }
        } while (exists);

        const newUrl = await Url.create({ originalUrl: url, shortCode });
        return NextResponse.json({ shortCode: newUrl.shortCode });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

function isValidUrl(url: string) {
    let _url;
    try {
        _url = new URL(url);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        return false;
    }
    return _url.protocol === "http:" || _url.protocol === "https:";
}
