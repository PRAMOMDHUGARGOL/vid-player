import React, { useState, useRef, useEffect } from "react"; // Import React
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesome Play icon
import {
  faPlay,
  faPause,
  faStop,
  faVolumeUp,
  faVolumeMute,
  faExpand,
  faCompress,
  faStepForward,
  faStepBackward,
} from "@fortawesome/free-solid-svg-icons";

//TODO: 1) return back to where user last left off
//TODO: 2) improve mobile view user experience

// Define CustomVideoPlayer component
const CustomVideoPlayer = ({
  src,
  autoPlay = true,
  onNextVideo,
  onPreviousVideo,
  thumbnail,
}) => {
  // State variables
  const [isPlaying, setIsPlaying] = useState(!autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [hideVolumeControl, setHideVolumeControl] = useState(false);

  // Ref for video element
  const videoRef = useRef(null);

  // Effect for setting up event listeners and autoplay
  useEffect(() => {
    const video = videoRef.current;
    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);

    if (autoPlay && video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error("Autoplay failed:", error));
    }

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [autoPlay]);

  // Effect for updating duration when src changes
  useEffect(() => {
    setDuration(videoRef.current.duration);
  }, [src]);

  // Effect for handling mouse enter and leave events
  useEffect(() => {
    const player = document.querySelector(".custom-video-player");
    player.addEventListener("mouseenter", handleMouseEnter);
    player.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      player.removeEventListener("mouseenter", handleMouseEnter);
      player.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Effect for hiding controls after a delay
  useEffect(() => {
    if (isControlsVisible) {
      const timeoutId = setTimeout(() => setIsControlsVisible(false), 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [isControlsVisible]);

  // Effect for hiding volume control after a delay
  useEffect(() => {
    let hideTimer;
    if (!isMuted && volume > 0) {
      hideTimer = setTimeout(() => setHideVolumeControl(true), 5000);
    } else {
      clearTimeout(hideTimer);
      setHideVolumeControl(false);
    }
    return () => clearTimeout(hideTimer);
  }, [isMuted, volume]);

  // Function to update current time
  const updateTime = () => setCurrentTime(videoRef.current.currentTime);

  // Function to update duration
  const updateDuration = () => setDuration(videoRef.current.duration);

  // Function to toggle play/pause
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
      setIsControlsVisible(true);
    }
  };

  // Function to handle video click
  const handleVideoClick = () => togglePlayPause();

  // Function to handle volume change
  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setIsMuted(newVolume === 0);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    if (newVolume > 0) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  // Function to handle stop click
  const handleStopClick = () => {
    const video = videoRef.current;
    video.pause();
    setIsPlaying(false);
    video.currentTime = 0;
    setCurrentTime(0);
  };

  // Function to handle video end
  const handleVideoEnd = () => onNextVideo();

  // Function to handle speed change
  const handleSpeedChange = (event) => {
    const newSpeed = parseFloat(event.target.value);
    setSpeed(newSpeed);
    videoRef.current.playbackRate = newSpeed;
  };

  // Function to handle seek
  const handleSeek = (event) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;

    if (isPlaying) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined && playPromise.catch) {
        playPromise.catch(() => videoRef.current.play());
      }
    }
  };

  // Function to handle mute/unmute
  const handleMuteClick = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    if (video.muted) {
      setVolume(0);
      video.volume = 0;
      setIsMuted(video.muted);
    } else {
      video.volume = 0.5;
      setVolume(0.5);
      setIsMuted(false);
    }
  };

  // Function to handle fullscreen
  const handleFullScreenClick = () => {
    const player = document.querySelector(".custom-video-player");
    const toggleFullScreen = () => {
      if (!isFullScreen) {
        if (player.requestFullscreen) {
          player.requestFullscreen();
        } else if (player.webkitRequestFullscreen) {
          player.webkitRequestFullscreen();
        } else if (player.msRequestFullscreen) {
          player.msRequestFullscreen();
        }
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock("landscape");
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      }
      setIsFullScreen(!isFullScreen);
    };
    toggleFullScreen();
  };

  // Function to handle mouse enter
  const handleMouseEnter = () => setIsControlsVisible(true);

  // Function to handle mouse leave
  const handleMouseLeave = () => setIsControlsVisible(false);

  // Function to format time
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div
      className={`custom-video-player relative ${
        isControlsVisible ? "show-controls" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        onClick={handleVideoClick}
        autoPlay={autoPlay}
        onEnded={handleVideoEnd}
        poster={thumbnail}
        className="w-full h-auto"
        style={{ objectFit: "cover" }}
      ></video>

      {/* Controls */}
      <div
        className={`controls transition-opacity duration-300 ${
          isControlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        } ${isFullScreen ? "fixed bottom-0 left-0 w-full" : ""}`}
      >
        {/* Progress Bar */}
        <input
          type="range"
          value={currentTime}
          max={duration}
          onChange={handleSeek}
          className="w-full accent-blue-500"
        />

        {/* Control Buttons */}
        <div className="controls flex flex-wrap justify-between items-center mb-2">
          <div className="flex items-center">
            {/* Play/Pause Button */}
            <button onClick={togglePlayPause} className="ml-1 mr-2 md:mr-5">
              {isPlaying ? (
                <FontAwesomeIcon icon={faPause} />
              ) : (
                <FontAwesomeIcon icon={faPlay} />
              )}
            </button>
            {/* Next Video Button */}
            <button onClick={onNextVideo} className="mr-2 md:mr-5">
              <FontAwesomeIcon icon={faStepForward} />
            </button>
            {/* Stop Button */}
            <button onClick={handleStopClick} className="mr-2 md:mr-5">
              <FontAwesomeIcon icon={faStop} />
            </button>
            {/* Current Time / Duration */}
            <span className="text-xs md:text-base mr-2">
              {formatTime(currentTime)}
            </span>{" "}
            /{" "}
            <span className="text-xs md:text-base ml-2">
              {formatTime(duration)}
            </span>
            {/* Mute Button */}
            <button
              onClick={handleMuteClick}
              className="ml-2 md:ml-5 mr-2 md:mr-5"
            >
              {isMuted ? (
                <FontAwesomeIcon icon={faVolumeMute} />
              ) : (
                <FontAwesomeIcon icon={faVolumeUp} />
              )}
            </button>
            {/* Volume Slider */}
            {!isMuted || volume > 0 ? (
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className={`w-16 md:w-24 accent-white ${
                  isMuted || hideVolumeControl ? "hidden" : ""
                }`}
              />
            ) : null}
          </div>
          {/* Speed Selector and Fullscreen Button */}
          <div className="flex items-center">
            {/* Speed Selector */}
            <select
              value={speed}
              onChange={handleSpeedChange}
              className="bg-transparent text-xs md:text-base px-1 md:px-2 py-1 rounded-md focus:outline-none mr-2 md:mr-4 mb-2 md:mb-0"
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
            {/* Fullscreen Button */}
            <button onClick={handleFullScreenClick}>
              {isFullScreen ? (
                <FontAwesomeIcon icon={faCompress} />
              ) : (
                <FontAwesomeIcon icon={faExpand} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer; // Export CustomVideoPlayer component
