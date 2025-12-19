import ConversationHeader from '@/Components/App/ConversationHeader';
import MessageItem from '@/Components/App/MessageItem';
import MessageInput from '@/Components/App/MessageInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatLayout from '@/Layouts/ChatLayout';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { Head } from '@inertiajs/react';
import { use, useCallback, useEffect, useRef, useState } from 'react';
import { useEventBus } from '@/EventBus';
import axios from 'axios';

function Home({messages=null, selectedConversation=null}) {
    //console.log("messages", messages);
    const [localMessages, setLocalMessages] = useState([]);
    const messagesCtrRef = useRef(null);
    const loadMoreIntersect = useRef(null);
    const [scrollFromBottom, setScrollFromBottom] = useState();
    const [noMoreMessages, setnoMoreMessages] = useState(false);
    const { on } = useEventBus();

    const loadMoreMessages = useCallback(() => {
        const firstMessage = localMessages[0];
        axios.get(route('message.loadOlder', firstMessage.id))
        .then(({data}) => {
            if(data.data.length === 0){
                setnoMoreMessages(true);
                return;
            }
            const scrollHeight = messagesCtrRef.current.scrollHeight;
            const scrollTop = messagesCtrRef.current.scrollTop;
            const clientHeight = messagesCtrRef.current.clientHeight;

            const tmpScrollFromBottom = scrollHeight - scrollTop - clientHeight;

            console.log("tmpScrollFromBottom", tmpScrollFromBottom);
            setScrollFromBottom(tmpScrollFromBottom);

            setLocalMessages((prevMessage) => {
                return [...data.data.reverse(), ...prevMessage];
            })
        })
    }, [localMessages]);

    const messageCreated = (message) => {
        if(selectedConversation && selectedConversation.is_group && selectedConversation.id == message.group_id){
            setLocalMessages((prevMessage) => [...prevMessage, message]);
        }

        if(selectedConversation && selectedConversation.is_user 
            && (selectedConversation.id == message.sender_id || selectedConversation.id == message.receiver_id)){
            setLocalMessages((prevMessage) => [...prevMessage, message]);
        }
    }

    
    
    useEffect(() => {
        if(messagesCtrRef.current && scrollFromBottom !== null){
            messagesCtrRef.current.scrollTop = 
            messagesCtrRef.current.scrollHeight -
            messagesCtrRef.current.offsetHeight - 
            scrollFromBottom;
        }

        if(noMoreMessages) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach(
                    (entry) => entry.isIntersecting && loadMoreMessages()
                ),
            {
                rootMargin: "0px 0px 250px 0px",
            }
        );

        if(loadMoreIntersect.current){
            setTimeout(() => {
               observer.observe(loadMoreIntersect.current)
            }, 100);
        }

        return () => {
            observer.disconnect();
        }
    }, [localMessages, noMoreMessages])
    
    useEffect(() => {
        setTimeout(() => {
            if(messagesCtrRef.current){
                messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
            }
        },10);

        const offCreated = on("message.created", messageCreated);
        setScrollFromBottom(0);
        setnoMoreMessages(false)
        return () => {
            offCreated();
        }
        
    },[selectedConversation]);

    useEffect(()=>{
        setLocalMessages(messages ? messages.data.reverse() : []);
    }, [messages]);
    return (
        <>
            {!messages && (
                <div className='flex flex-col gap-8 justify-center items-center text-center h-full opacity-35'>
                    <div className='text-2xl md:text-4xl p-16 text-slate-200'>
                        Please select conversation to see messages
                    </div>
                    <ChatBubbleLeftRightIcon className='w-32 h-32 inline-block' />
                </div>
            ) }

            {messages && (
                <>
                <ConversationHeader selectedConversation={selectedConversation} />
                <div ref={messagesCtrRef} className='flex-1 overflow-y-auto p-5'>
                   
                    {localMessages.length === 0 && (
                        <div className='text-lg text-slate-200'>
                            No Messages found
                        </div>
                    )}

                    {localMessages.length > 0 && (
                        <div className='flex-1 flex flex-col'>
                            <div  ref={loadMoreIntersect}></div>
                            {
                                localMessages.map((message) => {
                                    return <MessageItem key={message.id} message={message} />
                                })
                            }
                        </div>
                    )}

                </div>
                <MessageInput conversation={selectedConversation} />
                </>
            )}
        </>
        
    );
}

Home.layout = (page) => {
    return (
        <AuthenticatedLayout>
            <ChatLayout children={page}/>
        </AuthenticatedLayout>
    )
}

export default Home;
