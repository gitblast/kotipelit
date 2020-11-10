import React from 'react';

import useStatusChangeRef from '../hooks/useStatusChangeRef';

import Intro from '../assets/audio/ktIntro.mp3';
import Outro from '../assets/audio/ktOutro.mp3';
import { GameStatus } from '../types';

const KotitonniAudioHandler: React.FC = () => {
  const introRef = useStatusChangeRef(
    React.useRef(null),
    GameStatus.WAITING,
    GameStatus.RUNNING
  );
  const outroRef = useStatusChangeRef(
    React.useRef(null),
    GameStatus.RUNNING,
    GameStatus.FINISHED
  );

  return (
    <>
      <audio src={Intro} ref={introRef} />
      <audio src={Outro} ref={outroRef} />
    </>
  );
};

export default KotitonniAudioHandler;
