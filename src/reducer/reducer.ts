import { State, Action, SelectableGame, GameType, GameStatus } from '../types';

const initialState = {
  games: [],
};

const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case 'INIT_GAMES': {
      return {
        games: action.payload,
      };
    }
    case 'ADD_GAME': {
      return {
        games: state.games.concat(action.payload),
      };
    }
    case 'DELETE_GAME': {
      return {
        games: state.games.filter((game) => game.id !== action.payload),
      };
    }
    case 'LAUNCH_GAME': {
      return {
        games: state.games.map((game) =>
          game.id === action.payload
            ? { ...game, status: GameStatus.WAITING }
            : game
        ),
      };
    }
    default:
      return state;
  }
};

const hardcodedGames = [
  {
    id: '1',
    type: 'sanakierto' as GameType,
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
    type: 'sanakierto' as GameType,
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

export const initGames = (): Action => {
  return {
    type: 'INIT_GAMES',
    payload: hardcodedGames,
  };
};

export const addGame = (game: SelectableGame): Action => {
  return {
    type: 'ADD_GAME',
    payload: game,
  };
};

export const deleteGame = (id: string): Action => {
  return {
    type: 'DELETE_GAME',
    payload: id,
  };
};

export const launchGame = (id: string): Action => {
  return {
    type: 'LAUNCH_GAME',
    payload: id,
  };
};

export default reducer;
