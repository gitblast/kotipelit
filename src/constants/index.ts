import { GameInfo, GameStatus, GameType, HostChannel, RTCGame } from '../types';

export const hardcodedGames: RTCGame[] = [
  {
    price: 2,
    id: '1',
    host: {
      id: 'hostid',
      socketId: null,
    },
    info: {} as GameInfo,
    type: GameType.KOTITONNI,
    players: [
      {
        id: '1',
        name: 'Risto',
        privateData: {
          words: ['jojo', 'kasvi', 'hattu'],
          answers: {},
          socketId: null,
          inviteCode: 'code1',
          twilioToken: null,
        },
        points: 0,
      },
      {
        id: '2',
        name: 'Jorma',
        privateData: {
          words: ['sana', 'kirja', 'väline'],
          answers: {},
          socketId: null,
          inviteCode: 'code1',
          twilioToken: null,
        },
        points: 0,
      },
      {
        id: '3',
        name: 'Kalevi',
        privateData: {
          words: ['kaiutin', 'kuuloke', 'lasi'],
          answers: {},
          socketId: null,
          inviteCode: 'code1',
          twilioToken: null,
        },
        points: 0,
      },
      {
        id: '4',
        name: 'Jenni',
        privateData: {
          words: ['johto', 'hiiri', 'puhelin'],
          answers: {},
          socketId: null,
          inviteCode: 'code1',
          twilioToken: null,
        },
        points: 0,
      },
      {
        id: '5',
        name: 'Petra',
        privateData: {
          words: ['rasia', 'kuppi', 'vihko'],
          answers: {},
          socketId: null,
          inviteCode: 'code1',
          twilioToken: null,
        },
        points: 0,
      },
    ],
    startTime: new Date(),
    status: GameStatus.UPCOMING,
    rounds: 3,
  },
  {
    price: 2,
    id: '2',
    type: GameType.KOTITONNI,
    host: {
      id: 'hostid',
      socketId: null,
    },
    info: {} as GameInfo,
    players: [
      {
        id: '6',
        name: 'Matti',
        privateData: {
          words: ['lamppu', 'pöytä', 'sohva'],
          answers: {},
          socketId: null,
          inviteCode: 'code1',
          twilioToken: null,
        },
        points: 0,
      },
      {
        id: '7',
        name: 'Pertti',
        privateData: {
          words: ['laulu', 'tuoli', 'peitto'],
          answers: {},
          socketId: null,
          inviteCode: 'code1',
          twilioToken: null,
        },
        points: 0,
      },
      {
        id: '8',
        name: 'Lauri',
        privateData: {
          words: ['naru', 'ikkuna', 'ovi'],
          answers: {},
          socketId: null,
          inviteCode: 'code1',
          twilioToken: null,
        },
        points: 0,
      },
      {
        id: '9',
        name: 'Abraham',
        privateData: {
          words: ['presidentti', 'päällikkö', 'lattia'],
          answers: {},
          socketId: null,
          inviteCode: 'code1',
          twilioToken: null,
        },
        points: 0,
      },
      {
        id: '10',
        name: 'Sauli',
        privateData: {
          words: ['sammakko', 'tikku', 'lanka'],
          answers: {},
          socketId: null,
          inviteCode: 'code1',
          twilioToken: null,
        },
        points: 0,
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

export const hardcodedActiveSanakierto: RTCGame = {
  id: '1',
  type: GameType.KOTITONNI,
  price: 2,
  players: [
    {
      id: '1',
      name: 'Risto',
      privateData: {
        words: ['jojo', 'kasvi', 'hattu'],
        answers: {},
        socketId: null,
        inviteCode: 'code1',
        twilioToken: null,
      },
      points: 0,
    },
    {
      id: '2',
      name: 'Jorma',
      privateData: {
        words: ['sana', 'kirja', 'väline'],
        answers: {},
        socketId: null,
        inviteCode: 'code1',
        twilioToken: null,
      },
      points: 0,
    },
    {
      id: '3',
      name: 'Kalevi',
      privateData: {
        words: ['kaiutin', 'kuuloke', 'lasi'],
        answers: {},
        socketId: null,
        inviteCode: 'code1',
        twilioToken: null,
      },
      points: 0,
    },
    {
      id: '4',
      name: 'Jenni',
      privateData: {
        words: ['johto', 'hiiri', 'puhelin'],
        answers: {},
        socketId: null,
        inviteCode: 'code1',
        twilioToken: null,
      },
      points: 0,
    },
    {
      id: '5',
      name: 'Petra',
      privateData: {
        words: ['rasia', 'kuppi', 'vihko'],
        answers: {},
        socketId: null,
        inviteCode: 'code1',
        twilioToken: null,
      },
      points: 0,
    },
  ],
  startTime: new Date(),
  status: GameStatus.UPCOMING,
  rounds: 3,
  info: {
    turn: '1',
    round: 1,
    answeringOpen: false,
  },
  host: {
    id: 'id',
    socketId: 'string',
  },
};
