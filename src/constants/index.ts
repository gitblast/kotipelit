import {
  GameStatus,
  GameType,
  HostChannel,
  SelectableGame,
  SanakiertoActive,
} from '../types';

export const hardcodedGames: SelectableGame[] = [
  {
    hostOnline: true,
    id: '1',
    type: GameType.SANAKIERTO,
    players: [
      {
        id: '1',
        name: 'Risto',
        words: ['jojo', 'kasvi', 'hattu'],
        points: 0,
        online: false,
      },
      {
        id: '2',
        name: 'Jorma',
        words: ['sana', 'kirja', 'väline'],
        points: 0,
        online: false,
      },
      {
        id: '3',
        name: 'Kalevi',
        words: ['kaiutin', 'kuuloke', 'lasi'],
        points: 0,
        online: false,
      },
      {
        id: '4',
        name: 'Jenni',
        words: ['johto', 'hiiri', 'puhelin'],
        points: 0,
        online: false,
      },
      {
        id: '5',
        name: 'Petra',
        words: ['rasia', 'kuppi', 'vihko'],
        points: 0,
        online: false,
      },
    ],
    startTime: new Date(),
    status: GameStatus.UPCOMING,
    rounds: 3,
  },
  {
    hostOnline: true,
    id: '2',
    type: GameType.SANAKIERTO,
    players: [
      {
        id: '6',
        name: 'Matti',
        words: ['lamppu', 'pöytä', 'sohva'],
        points: 0,
        online: false,
      },
      {
        id: '7',
        name: 'Pertti',
        words: ['laulu', 'tuoli', 'peitto'],
        points: 0,
        online: false,
      },
      {
        id: '8',
        name: 'Lauri',
        words: ['naru', 'ikkuna', 'ovi'],
        points: 0,
        online: false,
      },
      {
        id: '9',
        name: 'Abraham',
        words: ['presidentti', 'päällikkö', 'lattia'],
        points: 0,
        online: false,
      },
      {
        id: '10',
        name: 'Sauli',
        words: ['sammakko', 'tikku', 'lanka'],
        points: 0,
        online: false,
      },
    ],
    startTime: new Date(),
    status: GameStatus.UPCOMING,
    rounds: 3,
  },
];

export const hardcodedChannels: HostChannel[] = [
  {
    username: 'user1',
    channelName: 'channel1',
  },
  {
    username: 'user2',
    channelName: 'channel2',
  },
  {
    username: 'user3',
    channelName: 'channel3',
  },
];

export const hardcodedActiveSanakierto: SanakiertoActive = {
  id: '1',
  type: GameType.SANAKIERTO,
  hostOnline: true,
  players: [
    {
      id: '1',
      name: 'Risto',
      words: ['jojo', 'kasvi', 'hattu'],
      points: 0,
      online: false,
    },
    {
      id: '2',
      name: 'Jorma',
      words: ['sana', 'kirja', 'väline'],
      points: 0,
      online: false,
    },
    {
      id: '3',
      name: 'Kalevi',
      words: ['kaiutin', 'kuuloke', 'lasi'],
      points: 0,
      online: false,
    },
    {
      id: '4',
      name: 'Jenni',
      words: ['johto', 'hiiri', 'puhelin'],
      points: 0,
      online: false,
    },
    {
      id: '5',
      name: 'Petra',
      words: ['rasia', 'kuppi', 'vihko'],
      points: 0,
      online: false,
    },
  ],
  startTime: new Date(),
  status: GameStatus.UPCOMING,
  rounds: 3,
  info: {
    turn: '1',
    round: 1,
  },
};
