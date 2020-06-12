import { GameStatus, GameType } from '../types';

export const hardcodedGames = [
  {
    id: '1',
    type: GameType.SANAKIERTO,
    players: [
      {
        id: '1',
        name: 'Risto',
        words: ['jojo', 'kasvi', 'hattu'],
        points: 0,
      },
      {
        id: '2',
        name: 'Jorma',
        words: ['sana', 'kirja', 'väline'],
        points: 0,
      },
      {
        id: '3',
        name: 'Kalevi',
        words: ['kaiutin', 'kuuloke', 'lasi'],
        points: 0,
      },
      {
        id: '4',
        name: 'Jenni',
        words: ['johto', 'hiiri', 'puhelin'],
        points: 0,
      },
      {
        id: '5',
        name: 'Petra',
        words: ['rasia', 'kuppi', 'vihko'],
        points: 0,
      },
    ],
    startTime: new Date(),
    status: GameStatus.UPCOMING,
    rounds: 3,
    winner: null,
  },
  {
    id: '2',
    type: GameType.SANAKIERTO,
    players: [
      {
        id: '6',
        name: 'Matti',
        words: ['lamppu', 'pöytä', 'sohva'],
        points: 0,
      },
      {
        id: '7',
        name: 'Pertti',
        words: ['laulu', 'tuoli', 'peitto'],
        points: 0,
      },
      {
        id: '8',
        name: 'Lauri',
        words: ['naru', 'ikkuna', 'ovi'],
        points: 0,
      },
      {
        id: '9',
        name: 'Abraham',
        words: ['presidentti', 'päällikkö', 'lattia'],
        points: 0,
      },
      {
        id: '10',
        name: 'Sauli',
        words: ['sammakko', 'tikku', 'lanka'],
        points: 0,
      },
    ],
    startTime: new Date(),
    status: GameStatus.UPCOMING,
    rounds: 3,
    winner: null,
  },
];
