import React from 'react';

import useStatusChangeAudioRef from './useStatusChangeAudioRef';
import useAnyPointChangeAudioRef from './useAnyPointChangeAudioRef';
import useWinnerAudioRef from './useWinnerAudioRef';
import useAudioOnIncreaseRef from './useAudioOnIncreaseRef';

import Intro from '../../assets/audio/ktIntro.mp3';
import Outro from '../../assets/audio/ktOutro.mp3';
import HundredPoints from '../../assets/audio/ktHundredpoints.mp3';
import ThirtyPoints from '../../assets/audio/ktThirtypoints.mp3';
import TenPoints from '../../assets/audio/ktTenpoints.mp3';
import MinusFiftyPoints from '../../assets/audio/ktMinusFiftypoints.mp3';
import AnswerRecieved from '../../assets/audio/ktAnswer.mp3';
import Winner from '../../assets/audio/ktWinner.mp3';
import TenSeconds from '../../assets/audio/ktTenSeconds.mp3';

import { GameStatus, Role } from '../../types';
import { useGameData } from '../../context';
import { getAnswerCount, selfIsWinner } from '../../helpers/games';
import useAudioOnTimerValue from './useAudioOnTimerValue';

const KotitonniAudioHandler: React.FC = () => {
  const { game, self } = useGameData();

  const isHost = self.role === Role.HOST;

  const answerCount = getAnswerCount(game);

  const introRef = useStatusChangeAudioRef(
    React.useRef(null),
    game.status,
    GameStatus.WAITING,
    GameStatus.RUNNING
  );

  const outroRef = useStatusChangeAudioRef(
    React.useRef(null),
    game.status,
    GameStatus.RUNNING,
    GameStatus.FINISHED
  );

  const currentPointsArray = game.players.map((player) => player.points);

  const hundredPointsRef = useAnyPointChangeAudioRef(
    currentPointsArray,
    React.useRef(null),
    100
  );
  const thirtyPointsRef = useAnyPointChangeAudioRef(
    currentPointsArray,
    React.useRef(null),
    30
  );
  const tenPointsRef = useAnyPointChangeAudioRef(
    currentPointsArray,
    React.useRef(null),
    10
  );
  const minusFiftyPointsRef = useAnyPointChangeAudioRef(
    currentPointsArray,
    React.useRef(null),
    -50
  );

  const answerRecievedRef = useAudioOnIncreaseRef(
    React.useRef(null),
    answerCount
  );

  const tenSecondsRef = useAudioOnTimerValue(React.useRef(null));

  /* answer correct audio:

  
  import AnswerCorrect from '../../assets/audio/ktAddpoints.mp3';

  import { useKotitonniData } from '../../context';
  
  const { clickedMap } = useKotitonniData();

  const clickCount = Object.values(clickedMap).reduce((total, next) => {
    return next ? total + 1 : total;
  }, 0);

  const answerCorrectRef = useAudioOnIncreaseRef(
    React.useRef(null),
    clickCount
  ); 
  
  
  */

  const selfDidWin = selfIsWinner(game, self);

  const winnerRef = useWinnerAudioRef(selfDidWin, React.useRef(null));

  return (
    <>
      <audio src={Intro} ref={introRef} />
      <audio src={Outro} ref={outroRef} />

      <audio src={HundredPoints} ref={hundredPointsRef} />
      <audio src={ThirtyPoints} ref={thirtyPointsRef} />
      <audio src={TenPoints} ref={tenPointsRef} />
      <audio src={MinusFiftyPoints} ref={minusFiftyPointsRef} />

      <audio src={TenSeconds} ref={tenSecondsRef} />

      {isHost && (
        <>
          <audio src={AnswerRecieved} ref={answerRecievedRef} />
          {/* <audio src={AnswerCorrect} ref={answerCorrectRef} /> */}
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
