import React from 'react';
import videojs from 'video.js';
import 'videojs-youtube/dist/Youtube';
import 'video.js/dist/video-js.css';
import playerStyle from './player.module.css';
import { YouTubeIcon } from '../icons/social';
import { PlayIcon } from '../icons/social/player';

export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const overlayRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const { options, thumbnail } = props;

  React.useEffect(() => {
    const handlePlayerReady = (player) => {
      playerRef.current = player;

      // You can handle player events here, for example:
      player.on('waiting', () => {
        videojs.log('player is waiting');
      });

      player.on('pause', () => {
        overlayRef.current.style.display = 'flex';
      });

      player.on('play', () => {
        overlayRef.current.style.display = 'none';
      });

      player.on('dispose', () => {
        videojs.log('player will dispose');
      });
    };

    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement('video-js');

      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready');
        const iframeBlocker =
          document.getElementsByClassName('vjs-iframe-blocker')[0];
        iframeBlocker.className = playerStyle.newBlockerStyle;
        console.log(iframeBlocker);
        handlePlayerReady && handlePlayerReady(player);
      }));

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  function playClickHandler() {
    const player = playerRef.current;
    overlayRef.current.style.display = 'none';
    player.play();
  }

  return (
    <div className={playerStyle.containerDiv}>
      <div
        onClick={playClickHandler}
        ref={overlayRef}
        style={{ backgroundImage: `url('${thumbnail}')` }}
        className={playerStyle.overlayDiv}
      >
        <PlayIcon width={'100px'} height={'100px'} />
      </div>
      <div ref={videoRef}></div>
    </div>
  );
};

export default VideoJS;
