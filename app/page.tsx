"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ButtonGroup } from "@/components/ui/button-group";
import { Copy, Trash } from "lucide-react";
import { copiedToast, deletedToast, errorToast } from "@/lib/custom-toasts";
import { toast } from "sonner";

type Link = {
    originalUrl: string;
    shortCode: string;
    clicks: number;
};

export default function Home() {
    const [longURL, setLongURL] = useState("");
    const [updated, setUpdated] = useState(new Date());
    const [links, setLinks] = useState<Link[]>([]);

    async function getAllLinks() {
        const res = await fetch("/api/getAllLinks");
        const allLinks = (await res.json()) as Link[];
        return allLinks;
    }

    useEffect(() => {
        getAllLinks().then((data) => setLinks(data));
    }, [updated]);

    async function shorten() {
        toast.promise(
            () => {
                return new Promise<{ message: string }>(
                    async (resolve, reject) => {
                        try {
                            const res = await fetch("/api/shorten", {
                                method: "POST",
                                body: JSON.stringify({ url: longURL }),
                            });
                            if (res.status === 400) {
                                reject({
                                    message: "Please provide a valid URL!",
                                });
                            } else if (res.status === 500) {
                                reject({ message: "Server error!" });
                            }
                            // const data = await res.json();
                            setUpdated(new Date());
                            resolve({ message: "Short Link created!" });
                        } catch (error) {
                            console.error(error);
                            reject({ message: "Server error!" });
                        }
                    }
                );
            },
            {
                loading: "Loading...",
                success: (data) => data.message,
                error: (data) => data.message,
            }
        );
    }

    async function copyText(text: string) {
        try {
            await navigator.clipboard.writeText(text);
            copiedToast("Copied to clipboard!");
        } catch (error) {
            console.error(error);
            errorToast("Failed to copy!");
        }
    }

    async function deleteLink(shortCode: string) {
        try {
            const res = await fetch("/api/deleteLink", {
                method: "DELETE",
                body: JSON.stringify({ shortCode }),
            });
            const { message } = await res.json();
            if (message && message === "success") {
                setUpdated(new Date());
                deletedToast("Deleted successfully!");
            } else {
                errorToast("Failed to delete!");
            }
        } catch (error) {
            console.error(error);
            errorToast("Failed to delete!");
        }
    }

    return (
        <>
            <div className="flex flex-row gap-4">
                <Input
                    className="w-sm"
                    placeholder="Enter url to shorten..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            shorten();
                            setLongURL("");
                        }
                    }}
                    onChange={(e) => {
                        setLongURL(e.target.value);
                    }}
                    value={longURL}
                />
                <Button onClick={shorten}>Shorten</Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Original URL</TableHead>
                        <TableHead>Short URL</TableHead>
                        <TableHead>Clicks</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {links.map((link, i) => {
                        const shortenedUrl =
                            (new URL(window.location.href + link.shortCode)).toString();
                        return (
                            <TableRow key={link.shortCode}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{link.originalUrl}</TableCell>
                                <TableCell>{shortenedUrl}</TableCell>
                                <TableCell>{link.clicks}</TableCell>
                                <TableCell>
                                    <ButtonGroup>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                copyText(shortenedUrl)
                                            }
                                        >
                                            <Copy />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                deleteLink(link.shortCode)
                                            }
                                        >
                                            <Trash />
                                        </Button>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
}
