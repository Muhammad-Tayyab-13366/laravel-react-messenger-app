import { Link } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import { useEffect, useState } from "react";
import { useEventBus } from "@/EventBus";
import { v4 as uuidv4 } from "uuid";


export default function NewMessageNotification({}){

    const [toasts, setToasts] = useState([]);
    const {on} = useEventBus();

    useEffect(() => {
        on("newMessageNotification", ({message, user, group_id}) => {
            const uuid = uuidv4();


            setToasts((oldToast) => {
                return [...oldToast, {message, uuid, user, group_id}];
            })

            setTimeout(() => {
                setToasts((oldToast) => oldToast.filter((toast) => toast.uuid !== uuid));
            }, 5000)
        })
    }, [on])
    return (
        <div className="toast min-w-[280px] z-10 toast-top toast-end">
            {toasts.map((toast, index) => {
                return (
                    <div key={toast.uuid} className="alert alert-success py-3 px-4 text-gray-100 rounded-md">
                        <Link
                            className="flex items-center gap-2"
                            href={toast.group_id ? route("chat.group", toast.group_id) : route("chat.user", toast.user.id)}>
                            <UserAvatar user={toast.user} />
                            <span className="text-xl">{toast.message}</span>
                        </Link>
                        
                    </div>
                )
            })}
        </div>
    );
};