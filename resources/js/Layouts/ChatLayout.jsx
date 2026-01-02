import { router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from "react";
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import TextInput from "@/Components/TextInput";
import ConversationItem from "@/Components/App/ConversationItem";
import { useEventBus } from "@/EventBus";
import GroupModal from "@/Components/App/GroupModal";

const ChatLayout = ({children}) => {

    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [onlineUsers, setOnlineUsers] = useState({});
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const { on, emit} = useEventBus();
    const isOnlineUser = (userId) => onlineUsers[userId];

    const onSearch = (e) => {
        const search = e.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversation)=>{
                return (
                    conversation.name.toLowerCase().inlcude(search)
                )
            })
        )
    }
   
    const messageCreated = (message) => {
        setLocalConversations((oldUsers) => {
            return oldUsers.map((u) => {
                if(message.receiver_id && !u.is_group && (u.id == message.sender_id || u.id == message.receiver_id)){
                    u.last_message = message.message; 
                    u.last_message_date = message.created_at;
                    return u;
                }

                if(message.group_id && !u.is_group && u.id == message.group_id){
                    u.last_message = message.message; 
                    u.last_message_date = message.created_at;
                    return u;
                }

                return u;
            });
        });
    }

    const messageDeleted = ({message,  prevMessage}) => {
        if(!prevMessage){
            return ;
        }

        setLocalConversations((oldUsers) => {
            return oldUsers.map((u) => {
                if(prevMessage.receiver_id && !u.is_group && (u.id == prevMessage.sender_id || u.id == prevMessage.receiver_id)){
                    u.last_message = prevMessage.message; 
                    u.last_message_date = prevMessage.created_at;
                    return u;
                }

                if(prevMessage.group_id && !u.is_group && u.id == prevMessage.group_id){
                    u.last_message = prevMessage.message; 
                    u.last_message_date = prevMessage.created_at;
                    return u;
                }

                return u;
            });
        });
    }

    useEffect(() => {
        
        const offCreated = on("message.created", messageCreated);
        const offDeleted = on("message.deleted", messageDeleted);
        const offConversationUpdatedRole = on("conversation.updated.role", ({id, is_admin}) => {
           
            setLocalConversations((prev) =>
                prev.map((c) =>
                    c.id === id
                        ? { ...c, is_admin: is_admin }
                        : c
                )
            );
        });

        const offConversationUpdatedStatus = on("conversation.updated.block_unblock", ({id, blocked_at}) => {
           
            setLocalConversations((prev) =>
                prev.map((c) =>
                    c.id === id
                        ? { ...c, blocked_at: blocked_at }
                        : c
                )
            );
        });
        const offModalShow = on("GroupModal.show", (group) => { setShowGroupModal(true) });
        const offGroupDelete = on("group.deleted", ({id, name}) => {
            setLocalConversations((oldConversations) => {
                return oldConversations.filter((conversation) => conversation.id !== id);
            });

            emit("toast.show", `Group "${name}" has been deleted.`);

            if(!selectedConversation || selectedConversation.is_group && selectedConversation.id == id){
                router.visit(route('dashboard'));
            }
        });

        return () => {
            offCreated();
            offDeleted();
            offModalShow();
            offConversationUpdatedRole();
            offConversationUpdatedStatus();
        }
    }, [on])

    useEffect(() => {
        setLocalConversations(conversations)
    },[conversations])

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a,b) => {
                if(a.blocked_at && b.blocked_at){
                    return a.blocked_at > b.blocked_at ? 1 : -1
                }else if(a.blocked_at){
                    return 1
                }else if(b.blocked_at){
                    return -1
                }
                if(a.last_message_date && b.last_message_date){    
                    return b.last_message_date.localeCompare(
                        a.last_message_date
                    );
                }else if(a.last_message_date){
                    return -1;
                }
                else if(b.last_message_date){
                    return 1
                }
                else {
                    return 0;
                }
            })
        )
    },[localConversations])


    useEffect(() => {
        Echo.join('online')
        .here((users)=>{
            //console.log('here', users);
            const onlineUsersObj = Object.fromEntries(
                users.map((user) => [user.id, user])
            );

            setOnlineUsers((previousOnlineUsers) =>{
                return {...previousOnlineUsers, ...onlineUsersObj};
            });
        })
        .joining((user)=>{
            //console.log('joining', user);
            setOnlineUsers((previousOnlineUsers) => {
                const updatedUsers = {...previousOnlineUsers};
                updatedUsers[user.id] = user;
                return updatedUsers;
            });
        })
        .leaving((user)=>{
            //console.log('leaving', user);
            setOnlineUsers((previousOnlineUsers) => {
                const updatedUsers = {...previousOnlineUsers};
                delete updatedUsers[user.id];
                return updatedUsers;
            });
        }).error((errors)=>{
            console.log('errors', errors);
        })
    },[])

   
    return (
        
        <>
        <div className="flex-1 w-full flex overflow-hidden">
            {/* */}
            <div className={`transition-all w-full sm:w-[220px] md:w-[400px] bg-slate-800  flex flex-col overflow-hidden
                
                ${selectedConversation ? "-ml-[100%] sm:ml-0" : ""} `}>
                <div className="flex item-center justify-between py-2 px-3 text-xl font-medium">
                    <span className="text-gray-300">My Conversations</span>
                    <div className="tooltip tooltip-left" data-tip="Create new Group">
                        <span className="tooltip-content">Create new Group</span>
                        <button className="text-gray-400 hover:text-gray-200" onClick={ (ev) => setShowGroupModal(true)}>
                            <PencilSquareIcon className="w-4 h-4 inline-block ml-2"/>
                        </button>
                    </div>
                </div>
                <div className="p-3">
                    {/*   */}
                    <TextInput placeholder="Filter users and groups" className="w-full" onKeyUp={onSearch}/>
                </div>
                <div className="flex-1 overflow-auto">
                    {
                        sortedConversations && sortedConversations.map((conversation) => {
                            return (
                                <ConversationItem 
                                    key={`${conversation.is_group ? "group_" : "user_"}${conversation.id}_${Math.random().toString(36).slice(2)}`}
                                    conversation={conversation}
                                    online={!!isOnlineUser(conversation.id)}
                                    selectedConversation={selectedConversation}
                                />
                            );
                        })
                    }
                </div>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-800 border-l-2">
                {children}
            </div>
        </div>
        <GroupModal show={showGroupModal} onClose={ () => setShowGroupModal(false) } />
        </>
      
    )
}

export default ChatLayout;