import React from 'react';

import useStatusChangeAudioRef from '../hooks/useStatusChangeAudioRef';
import usePointChangeAudioRef from '../hooks/usePointChangeAudioRef';
import useWinnerAudioRef from '../hooks/useWinnerAudioRef';
import useAudioOnIncreaseRef, {
  clickCountSelector,
  answerCountSelector,
} from '../hooks/useAudioOnIncreaseRef';

import Intro from '../assets/audio/ktIntro.mp3';
import Outro from '../assets/audio/ktOutro.mp3';
import HundredPoints from '../assets/audio/ktHundredpoints.mp3';
import ThirtyPoints from '../assets/audio/ktThirtypoints.mp3';
import TenPoints from '../assets/audio/ktTenpoints.mp3';
import MinusFiftyPoints from '../assets/audio/ktMinusFiftypoints.mp3';
import AnswerRecieved from '../assets/audio/ktAnswer.mp3';
import AnswerCorrect from '../assets/audio/ktAddpoints.mp3';
import Winner from '../assets/audio/ktWinner.mp3';

import { GameStatus, State } from '../types';
import { useSelector } from 'react-redux';

const KotitonniAudioHandler: React.FC = () => {
  const isHost = useSelector((state: State) => {
    return state.rtc.self && state.rtc.self.isHost;
  });

  const introRef = useStatusChangeAudioRef(
    React.useRef(null),
    GameStatus.WAITING,
    GameStatus.RUNNING
  );

  const outroRef = useStatusChangeAudioRef(
    React.useRef(null),
    GameStatus.RUNNING,
    GameStatus.FINISHED
  );

  const hundredPointsRef = usePointChangeAudioRef(React.useRef(null), 100);
  const thirtyPointsRef = usePointChangeAudioRef(React.useRef(null), 30);
  const tenPointsRef = usePointChangeAudioRef(React.useRef(null), 10);
  const minusFiftyPointsRef = usePointChangeAudioRef(React.useRef(null), -50);

  const answerRecievedRef = useAudioOnIncreaseRef(
    React.useRef(null),
    answerCountSelector
  );

  const answerCorrectRef = useAudioOnIncreaseRef(
    React.useRef(null),
    clickCountSelector
  );

  const winnerRef = useWinnerAudioRef(React.useRef(null));

  return (
    <>
      <audio src={Intro} ref={introRef} />
      <audio src={Outro} ref={outroRef} />

      <audio src={HundredPoints} ref={hundredPointsRef} />
      <audio src={ThirtyPoints} ref={thirtyPointsRef} />
      <audio src={TenPoints} ref={tenPointsRef} />
      <audio src={MinusFiftyPoints} ref={minusFiftyPointsRef} />

      {isHost && (
        <>
          <audio src={AnswerRecieved} ref={answerRecievedRef} />
          <audio src={AnswerCorrect} ref={answerCorrectRef} />
        </>
      )}

      {!isHost && (
        <>
          <audio src={Winner} ref={winnerRef} />
        </>
      )}
    </>
  );
};

export default KotitonniAudioHandler;
