import React from 'react';

import useStatusChangeAudioRef from '../hooks/useStatusChangeAudioRef';
import useAnyPointChangeAudioRef from '../hooks/useAnyPointChangeAudioRef';
import useWinnerAudioRef from '../hooks/useWinnerAudioRef';
import useAudioOnIncreaseRef from '../hooks/useAudioOnIncreaseRef';

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
import { useKotitonniData } from '../context';

const answerCountSelector = (state: State) => {
  if (!state.rtc.game) {
    return null;
  }

  let answerCount = 0;

  state.rtc.game.players.forEach((player) => {
    if (!player.privateData) {
      return;
    }

    Object.values(player.privateData.answers).forEach((answerMap) => {
      answerCount += Object.values(answerMap).length;
    });
  });

  return answerCount;
};

const KotitonniAudioHandler: React.FC = () => {
  const isHost = useSelector((state: State) => {
    return state.rtc.self && state.rtc.self.isHost;
  });

  const { clickedMap } = useKotitonniData();

  const clickCount = Object.values(clickedMap).reduce((total, next) => {
    return next ? total + 1 : total;
  }, 0);

  const answerCount = useSelector(answerCountSelector);

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

  const hundredPointsRef = useAnyPointChangeAudioRef(React.useRef(null), 100);
  const thirtyPointsRef = useAnyPointChangeAudioRef(React.useRef(null), 30);
  const tenPointsRef = useAnyPointChangeAudioRef(React.useRef(null), 10);
  const minusFiftyPointsRef = useAnyPointChangeAudioRef(
    React.useRef(null),
    -50
  );

  const answerRecievedRef = useAudioOnIncreaseRef(
    React.useRef(null),
    answerCount
  );

  const answerCorrectRef = useAudioOnIncreaseRef(
    React.useRef(null),
    clickCount
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
