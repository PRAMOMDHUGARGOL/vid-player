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
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

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
    setIsMuted(video.muted);
  };

  const handleFullScreenClick = () => {
    const player = document.querySelector(".custom-video-player");
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
    >
      <video
        ref={videoRef}
        src={src}
        onClick={handleVideoClick}
        autoPlay={autoPlay}
        onEnded={handleVideoEnd}
        poster={thumbnail}
        className="w-full h-auto" // Set a fixed width with auto height
      ></video>
      <div
        className={`controls transition-opacity duration-300 ${
          isControlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <input
          type="range"
          value={currentTime}
          max={duration}
          onChange={handleSeek}
          className="w-full"
        />
        <div className="controls flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={handlePlayPauseClick} className="mr-4">
              {isPlaying ? (
                <FontAwesomeIcon icon={faPause} />
              ) : (
                <FontAwesomeIcon icon={faPlay} />
              )}
            </button>
            <button onClick={handleStopClick} className="mr-4">
              <FontAwesomeIcon icon={faStop} />
            </button>
            <span className="mr-2">{formatTime(currentTime)}</span> /{" "}
            <span className="ml-2 mr-4">{formatTime(duration)}</span>
          </div>
          <div className="flex items-center">
            <select
              value={speed}
              onChange={handleSpeedChange}
              className="bg-transparent text-white px-2 py-1 rounded-md focus:outline-none mr-4"
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
            <button onClick={handleMuteClick} className="mr-4">
              {isMuted ? (
                <FontAwesomeIcon icon={faVolumeMute} />
              ) : (
                <FontAwesomeIcon icon={faVolumeUp} />
              )}
            </button>
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
