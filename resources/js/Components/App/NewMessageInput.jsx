import { useEffect, useRef } from "react";

const NewMessageInput = ({value, onChange, onSend}) => {

    const input = useRef();

    const onInputKeyDown = (e) => {
        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            onSend();
        }
    }

    const onChangeEvent = (e) => {
        
        setTimeout(() => {
            adjustHeight();
        },10);
        onChange(e);
    }

    const adjustHeight = () => {
        setTimeout(()=> {
            input.current.style.height = "auto";
            input.current.style.height = input.current.scrollHeight + 1 + "px";
        }, 100)
        
    }

    useEffect(() => {
        adjustHeight();
    }, [value]);

    return (
        <textarea className="input input-bordered w-full rounded-r-none rounded-lg resize-none overflow-y-auto max-h-40 color-black text-black" 
        ref={input} 
        value={value} 
        rows={1} 
        onChange={ (e) => { onChangeEvent(e); }}
        onKeyDown={ (e) => { onInputKeyDown(e); }}
        placeholder="Type a message" ></textarea>
    )
}

export default NewMessageInput;