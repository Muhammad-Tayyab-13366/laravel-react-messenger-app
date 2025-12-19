import {Link, usePage} from "@inertiajs/react";
import UserAvatar  from "@/Components/App/UserAvatar"; 
import GroupAvatar from "@/Components/App/GroupAvatar";
import UserOptionsDropdown from "@/Components/App/UserOptionsDropdown";
import { formatMessageDateShort } from "@/helpers";

const ConversationItem = ({
    conversation,
    online = null,
    selectedConversation = null
}) => {
    const page = usePage();
    const currentUser = page.props.auth.user;
    let classes = "border-transperent";

    if(selectedConversation){
        if(!selectedConversation.is_group && !conversation.is_group && selectedConversation.id == conversation.id){
            classes = " border-blue-500 bg-black/20";
        }

        if(selectedConversation.is_group && conversation.is_group && selectedConversation.id == conversation.id){
            classes = " border-blue-500 bg-black/20";
        }
    }

    return (
        <div className="flex items-center gap-2  hover:bg-black/30">
        <Link
          // href={route('dashboard')}
          href={`${conversation.is_user == true ? route("chat.user", conversation.id) : route("chat.group", conversation.id)}`}
          preserveState
          preserveScroll
          className={`${classes} flex items-center gap-2 p-2 text-gray-300 transition-all cursor-pointer hover:bg-black/30 flex-1 min-w-0`}
        >
            {/*  border-l-4 */}
          {conversation.is_user && <UserAvatar user={conversation} online={online} />}
         
          {conversation.is_group && <GroupAvatar />  } 
          <div className="flex-1 min-w-0 text-xs overflow-hidden">
            <div className="flex justify-between items-center gap-1">
              <h3 className="text-sm font-semibold truncate">{conversation.name}</h3>
              {conversation.last_message_date && (
                <span className="text-xs whitespace-nowrap">{formatMessageDateShort(conversation.last_message_date)}</span>
              )}
            </div>
            {conversation.last_message && (
              <p className="text-xs truncate">{conversation.last_message}</p>
            )}
          </div>
        </Link>
      
        {currentUser.is_admin && conversation.is_user && (
          <UserOptionsDropdown conversation={conversation} />
        )}
      </div>
      
       
        
    )

}

export default ConversationItem;
