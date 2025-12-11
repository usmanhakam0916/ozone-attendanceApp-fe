import React, { createRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Row } from 'antd';
import PropTypes from 'prop-types';



const VideoPlay = ({ iconRowStyle, url }) => {
  const videoRef = createRef(ReactPlayer);
  const [showPlayControl, setShowPlayControl] = useState(false);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [paused, setPaused] = useState(true);
  const FORWARD_DURATION = 5;
  let newTime;
  useEffect(() => {
    let isMounted = true;
    if (showPlayControl) {
      setTimeout(() => {
        if (isMounted) {
          setShowPlayControl(false);
        }
      }, 5000);
    }

    return () => {
      isMounted = false;
    };
  }, [showPlayControl]);
  const handleProgress = (value) => {
    setCurrentVideoTime(value.playedSeconds);
  };
  const onBackward = () => {
    newTime = Math.max(currentVideoTime - FORWARD_DURATION, 0);
    if (newTime < 0 && videoRef.current) {
      videoRef.current.seekTo(0);
    } else {
      videoRef.current.seekTo(newTime);
      setCurrentVideoTime(newTime);
    }
  };

  const onForward = () => {
    newTime = Math.max(currentVideoTime + FORWARD_DURATION, 0);
    if (videoRef.current) {
      videoRef.current.seekTo(newTime);
    }
  };
  return (
    <div
    // style={{ width: 470 }}
    >
      <ReactPlayer
        ref={videoRef}
        url={url}
        config={{ file: { attributes: { controlsList: 'nodownload' } } }}
        playing={paused}
        controls={false}
        width={470}
        onProgress={handleProgress}
      />
    </div>
  );
};

VideoPlay.propTypes = {
  iconRowStyle: PropTypes.string
}

export default VideoPlay;
