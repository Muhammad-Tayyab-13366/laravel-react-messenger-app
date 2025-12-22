import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import { use, useRef, useState } from "react";

const CustomAudioPlayer = ({file, showVolume = true}) => {

    const audioRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [volume, setVloume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);

    const togglePlayPause = () => {
        const audio = audioRef.current;

        if(isPlaying){
            audio.pause();
        }else {
            setDuration(audio.duration);
            audio.play();
        }

        setIsPlaying(!isPlaying);
    }

    const handleVolumeChange = (e) => {
        const audio =  audioRef.current;
        setDuration(audio.duration);
        setCurrentTime(e.target.currentTime);
    };

    const handleTimeUpdate = (e) => {
        const audio = audioRef.current;
        setDuration(audio.duration);
    } 

    const handleLoadedMetadata = (e) => {
        setDuration(e.target.duration);
    }

    const handleSeekChange = (e) => {
        const time = e.target.value;
        audioRef.current.currentTime = time;
    };

    return (
        <div className="w-full flex items-center gap-2 py-2 px-2 rounded-md bg-slate-800">
            <audio 
                src={file.url}
                ref={audioRef}
                controls
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                className="hidden"
                >

            </audio>

            <button onClick={togglePlayPause} className="w-6 text-gray-400">
                {isPlaying && <PauseCircleIcon className="w-6 text-gray-400" />}
                {isPlaying && <PlayCircleIcon className="w-6 text-gray-400" />}
            </button>
            {showVolume && (
                <input type="range" min="0" max="1" step="0.01" name="" id="" value={volume} onChange={handleVolumeChange}/>
            )}
            <input className="flex-1" type="range" min="0" max={duration} step="0.01" name="" id="" value={currentTime} onChange={handleSeekChange}/>
            
            
        </div>
    );
}

export default CustomAudioPlayer;