import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStop,
  faVolumeUp,
  faVolumeMute,
  faExpand,
  faCompress,
} from "@fortawesome/free-solid-svg-icons";

const CustomVideoPlayer = ({
  src,
  autoPlay = true,
  onNextVideo,
  thumbnail,
}) => {
  const [isPlaying, setIsPlaying] = useState(!autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [volume, setVolume] = useState(0.5); // Initial volume level
  const [hideVolumeControl, setHideVolumeControl] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);

    // Ensure video playback when autoPlay is true
    if (autoPlay && video.paused) {
      video
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Autoplay failed:", error);
        });
    }

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [autoPlay]);

  useEffect(() => {
    setDuration(videoRef.current.duration);
  }, [src]);

  useEffect(() => {
    // Set up event listeners for mouse enter and leave on the video player
    const player = document.querySelector(".custom-video-player");
    player.addEventListener("mouseenter", handleMouseEnter);
    player.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      player.removeEventListener("mouseenter", handleMouseEnter);
      player.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    // If controls are visible, start a timer to hide them after 3 seconds
    if (isControlsVisible) {
      const timeoutId = setTimeout(() => {
        setIsControlsVisible(false);
      }, 3000);

      // Clear the timeout when the component unmounts or when controls become visible again
      return () => clearTimeout(timeoutId);
    }
  }, [isControlsVisible]);

  useEffect(() => {
    let hideTimer;
    if (!isMuted && volume > 0) {
      // Set a timer to hide the volume control after a delay (e.g., 3000 milliseconds)
      hideTimer = setTimeout(() => {
        setHideVolumeControl(true);
      }, 5000); // Adjust the delay time as needed (3000 milliseconds = 3 seconds)
    } else {
      // If volume becomes zero or muted, clear the timer and show the volume control
      clearTimeout(hideTimer);
      setHideVolumeControl(false);
    }

    // Cleanup function to clear the timer when the component unmounts or conditions change
    return () => clearTimeout(hideTimer);
  }, [isMuted, volume]);

  const updateTime = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const updateDuration = () => {
    setDuration(videoRef.current.duration);
  };

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

  const handlePlayPauseClick = () => {
    togglePlayPause();
  };

  const handleVideoClick = () => {
    togglePlayPause();
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setIsMuted(newVolume === 0); // Set isMuted based on whether the volume is 0
    setVolume(newVolume);
    videoRef.current.volume = newVolume;

    // Unmute the video if volume is greater than 0
    if (newVolume > 0) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const handleStopClick = () => {
    const video = videoRef.current;
    video.pause();
    setIsPlaying(false);
    video.currentTime = 0; // Reset playback time to beginning
    setCurrentTime(0); // Update current time state
  };

  const handleVideoEnd = () => {
    onNextVideo(); // Call the callback function to proceed to the next video
  };

  const handleSpeedChange = (event) => {
    const newSpeed = parseFloat(event.target.value);
    setSpeed(newSpeed);
    videoRef.current.playbackRate = newSpeed;
  };

  const handleSeek = (event) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;
  };

  const handleMuteClick = () => {
    const video = videoRef.current;
    video.muted = !video.muted;

    if (video.muted) {
      setVolume(0); // If muted, set volume to 0
      video.volume = 0;
      setIsMuted(video.muted);
    } else {
      video.volume = 0.5;
      setVolume(0.5); // If unmuted, set volume to half
      setIsMuted(false); // If muted, set is muted
    }
  };

  const handleFullScreenClick = () => {
    const player = document.querySelector(".custom-video-player");

    // Function to toggle fullscreen
    const toggleFullScreen = () => {
      if (!isFullScreen) {
        if (player.requestFullscreen) {
          player.requestFullscreen();
        } else if (player.webkitRequestFullscreen) {
          player.webkitRequestFullscreen();
        } else if (player.msRequestFullscreen) {
          player.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
      setIsFullScreen(!isFullScreen);
    };

    toggleFullScreen();
  };

  const handleMouseEnter = () => {
    setIsControlsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsControlsVisible(false);
  };

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
      className={`custom-video-player ${
        isControlsVisible ? "show-controls" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        onClick={handleVideoClick}
        autoPlay={autoPlay}
        onEnded={handleVideoEnd}
        poster={thumbnail}
        className="w-full h-auto" // Set a fixed height for the video component
        style={{ objectFit: "cover" }} // Ensure the thumbnail fits within the fixed height without stretching
      ></video>

      <div
        className={`controls transition-opacity duration-300 ${
          isControlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        } ${isFullScreen ? "fixed bottom-0 left-0 w-full" : ""}`}
      >
        <input
          type="range"
          value={currentTime}
          max={duration}
          onChange={handleSeek}
          className="w-full accent-blue-500"
        />

        <div className="controls flex flex-wrap justify-between items-center mb-2">
          <div className="flex items-center">
            <button onClick={handlePlayPauseClick} className="mr-2 md:mr-4">
              {isPlaying ? (
                <FontAwesomeIcon icon={faPause} />
              ) : (
                <FontAwesomeIcon icon={faPlay} />
              )}
            </button>
            <button onClick={handleStopClick} className="mr-2 md:mr-4">
              <FontAwesomeIcon icon={faStop} />
            </button>
            <span className="text-xs md:text-base mr-2">
              {formatTime(currentTime)}
            </span>{" "}
            /{" "}
            <span className="text-xs md:text-base ml-2">
              {formatTime(duration)}
            </span>
            <button
              onClick={handleMuteClick}
              className="ml-2 md:ml-4 mr-2 md:mr-4"
            >
              {isMuted ? (
                <FontAwesomeIcon icon={faVolumeMute} />
              ) : (
                <FontAwesomeIcon icon={faVolumeUp} />
              )}
            </button>
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
          <div className="flex items-center">
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

export default CustomVideoPlayer;
