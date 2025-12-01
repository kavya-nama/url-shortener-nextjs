import { toast } from "sonner";
import {
    CheckCircle,
    XCircle,
    Info,
    AlertTriangle,
    Copy,
    Trash,
} from "lucide-react";

export function successToast(message: string) {
    return toast(message, {
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    });
}

export function errorToast(message: string) {
    return toast(message, {
        icon: <XCircle className="w-5 h-5 text-red-500" />,
    });
}

export function infoToast(message: string) {
    return toast(message, {
        icon: <Info className="w-5 h-5 text-blue-500" />,
    });
}

export function warningToast(message: string) {
    return toast(message, {
        icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    });
}

export function deletedToast(message: string) {
    return toast(message, {
        icon: <Trash className="w-5 h-5 text-red-500" />,
    });
}

export function copiedToast(message: string) {
    return toast(message, {
        icon: <Copy className="w-5 h-5 text-sky-500" />,
    });
}
