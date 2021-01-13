import {
  GameStatus,
  GameType,
  HostChannel,
  SelectableGame,
  KotitonniActive,
} from '../types';

export const hardcodedGames: SelectableGame[] = [
  {
    hostOnline: true,
    price: 2,
    id: '1',
    type: GameType.KOTITONNI,
    players: [
      {
        id: '1',
        name: 'Risto',
        data: {
          words: ['jojo', 'kasvi', 'hattu'],
          answers: {},
        },
        points: 0,
        online: false,
      },
      {
        id: '2',
        name: 'Jorma',
        data: {
          words: ['sana', 'kirja', 'väline'],
          answers: {},
        },
        points: 0,
        online: false,
      },
      {
        id: '3',
        name: 'Kalevi',
        data: {
          words: ['kaiutin', 'kuuloke', 'lasi'],
          answers: {},
        },
        points: 0,
        online: false,
      },
      {
        id: '4',
        name: 'Jenni',
        data: {
          words: ['johto', 'hiiri', 'puhelin'],
          answers: {},
        },
        points: 0,
        online: false,
      },
      {
        id: '5',
        name: 'Petra',
        data: {
          words: ['rasia', 'kuppi', 'vihko'],
          answers: {},
        },
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
    price: 2,
    id: '2',
    type: GameType.KOTITONNI,
    players: [
      {
        id: '6',
        name: 'Matti',
        data: {
          words: ['lamppu', 'pöytä', 'sohva'],
          answers: {},
        },
        points: 0,
        online: false,
      },
      {
        id: '7',
        name: 'Pertti',
        data: {
          words: ['laulu', 'tuoli', 'peitto'],
          answers: {},
        },
        points: 0,
        online: false,
      },
      {
        id: '8',
        name: 'Lauri',
        data: {
          words: ['naru', 'ikkuna', 'ovi'],
          answers: {},
        },
        points: 0,
        online: false,
      },
      {
        id: '9',
        name: 'Abraham',
        data: {
          words: ['presidentti', 'päällikkö', 'lattia'],
          answers: {},
        },
        points: 0,
        online: false,
      },
      {
        id: '10',
        name: 'Sauli',
        data: {
          words: ['sammakko', 'tikku', 'lanka'],
          answers: {},
        },
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

export const hardcodedActiveSanakierto: KotitonniActive = {
  id: '1',
  type: GameType.KOTITONNI,
  hostOnline: true,
  price: 2,
  players: [
    {
      id: '1',
      name: 'Risto',
      data: {
        words: ['jojo', 'kasvi', 'hattu'],
        answers: {},
      },
      points: 0,
      online: false,
    },
    {
      id: '2',
      name: 'Jorma',
      data: {
        words: ['sana', 'kirja', 'väline'],
        answers: {},
      },
      points: 0,
      online: false,
    },
    {
      id: '3',
      name: 'Kalevi',
      data: {
        words: ['kaiutin', 'kuuloke', 'lasi'],
        answers: {},
      },
      points: 0,
      online: false,
    },
    {
      id: '4',
      name: 'Jenni',
      data: {
        words: ['johto', 'hiiri', 'puhelin'],
        answers: {},
      },
      points: 0,
      online: false,
    },
    {
      id: '5',
      name: 'Petra',
      data: {
        words: ['rasia', 'kuppi', 'vihko'],
        answers: {},
      },
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
