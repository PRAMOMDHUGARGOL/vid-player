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

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
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
      setVolume(0);
    } else {
      setVolume(0.5);
    }
    setIsMuted(video.muted);
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

    // Check if the device supports fullscreen
    const supportsFullscreen = () => {
      return (
        document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.msFullscreenEnabled
      );
    };

    // Toggle fullscreen if supported, else handle landscape mode
    if (supportsFullscreen()) {
      toggleFullScreen();
    } else {
      // Function to check if the device is in landscape mode
      const isLandscape = () => {
        return window.innerWidth > window.innerHeight;
      };

      // Toggle fullscreen when in landscape mode
      if (isLandscape()) {
        toggleFullScreen();
      } else {
        // Listen for orientation change event
        const handleOrientationChange = () => {
          if (isLandscape()) {
            toggleFullScreen();
            window.removeEventListener(
              "orientationchange",
              handleOrientationChange
            );
          }
        };
        window.addEventListener("orientationchange", handleOrientationChange);
      }
    }
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
        className="w-full h-auto" // Set a fixed height for the video component
        style={{ objectFit: "cover" }} // Ensure the thumbnail fits within the fixed height without stretching
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
          className="w-full  accent-blue-500"
        />

        <div className="controls flex items-center justify-between flex-wrap">
          <div className="flex items-center mb-2 md:mb-0">
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
            <span className="mr-2 md:mr-4">{formatTime(currentTime)}</span> /{" "}
            <span className="ml-2 md:ml-4">{formatTime(duration)}</span>
            <button onClick={handleMuteClick} className="mr-4 ml-auto md:ml-4">
              {isMuted ? (
                <FontAwesomeIcon icon={faVolumeMute} />
              ) : (
                <FontAwesomeIcon icon={faVolumeUp} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 accent-white"
            />
          </div>
          <div className="flex items-center">
            <select
              value={speed}
              onChange={handleSpeedChange}
              className="bg-transparent text-white px-2 py-1 rounded-md focus:outline-none mr-4 mb-2 md:mb-0"
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
