import { FaceSmileIcon, HandThumbUpIcon, PaperAirplaneIcon, PaperClipIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { use, useState } from "react";
import NewMessageInput from "./NewMessageInput";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { Popover, PopoverPanel, Transition } from '@headlessui/react';
import { Fragment } from 'react'

const MessageInput = ({conversation = null}) => {
    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessage, setNewErrorMessage] = useState("");
    const [messageSending, setMessageSending] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const onLikeClick = () => {
        if(messageSending){
            return 
        }

        const data = {
            message : "👍",

        }
      
        if(conversation.is_user){
            data["receiver_id"] =  conversation.id;
        }else if(conversation.is_group){
            data["group_id"] =  conversation.id;
        }

        axios.post(route('message.store'), data)

    }
    const onSendClick = () => {
        if(newMessage.trim() === ""){
            setNewErrorMessage("Please provide a message or upload the attachments. ")
            setTimeout(() => {
                setNewErrorMessage("")
            }, 3000)
            return;
        }

        const  formData = new FormData();
        formData.append("message", newMessage);
        if(conversation.is_user){
            formData.append("receiver_id", conversation.id);
        }else if(conversation.is_group){
            formData.append("group_id", conversation.id);
        }

        setMessageSending(true);

        axios.post(route('message.store'), formData, {
            onUploadProgress: (processEvent) => {
                console.log(processEvent.loaded, processEvent.total);
                const progress = Math.round(
                    (processEvent.loaded/processEvent.total) * 100
                );
                console.log(progress);
            }
        })
        .then((res) => {
            setNewMessage("");
            setNewErrorMessage("");
            setMessageSending(false);
        }).catch((err) => {
            setMessageSending(false);
        });
    }
    
    return (
        <div className="flex flex-wrap items-start border-t border-slate-700 py-3">
            <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2">
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PaperClipIcon className="w-6"/>
                    <input type="file" multiple className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PhotoIcon className="w-6" />
                    <input type="file" multiple accept="image/*" className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer" />
                </button>
            </div>
            
            <div className="order-1 px-3 xs:p-0 min-w-[200px] basis-full xs:basis-0 xs:order-2 flex-1 relative">
                <div className="flex">
                    <NewMessageInput value={newMessage} onChange={ (e) => setNewMessage(e.target.value)} onSend={onSendClick} />
                    <button 
                        disabled={messageSending}
                        className="btn btn-info rounded-tr-lg rounded-br-lg rounded-tl-none rounded-bl-none p-5 " 
                        onClick={onSendClick}>
                        {messageSending && (
                            <span className="loading loading-spinner loading-xs"></span>
                        )}
                        <PaperAirplaneIcon className="w-6 " />
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </div>
                {inputErrorMessage && (
                    <p className="text-xs text-red-400">{inputErrorMessage}</p>
                )}
                
            </div>
               
            <div className="order-3 xs:order-3 p-2 flex">
                <Popover className="relative">
                    <Popover.Button className="p-1 text-gray-400 hover:text-gray-300">
                        <FaceSmileIcon className="w-6 h-6" />
                    </Popover.Button>
                    <Popover.Panel className={`absolute z-10 right-0 bottom-full`}>
                        <EmojiPicker  theme="dark" onEmojiClick={ ev => setNewMessage(newMessage + ev.emoji)} >

                        </EmojiPicker>

                    </Popover.Panel>
                </Popover>
                <button className="p-1 text-gray-400 hover:text-gray-300" onClick={onLikeClick}>
                    <HandThumbUpIcon className="w-6 h-6" />
                </button>
            </div>

        </div>
    )
}

export default MessageInput;