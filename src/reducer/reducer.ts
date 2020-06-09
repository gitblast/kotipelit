import { State, Action, SelectableGame, GameType } from '../types';

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
    case 'START_GAME': {
      return {
        games: state.games.map((game) =>
          game.id === action.payload ? { ...game, running: true } : game
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
        name: 'Risto',
        words: ['jojo', 'kasvi', 'hattu'],
      },
      {
        name: 'Jorma',
        words: ['sana', 'kirja', 'väline'],
      },
      {
        name: 'Kalevi',
        words: ['kaiutin', 'kuuloke', 'lasi'],
      },
      {
        name: 'Jenni',
        words: ['johto', 'hiiri', 'puhelin'],
      },
      {
        name: 'Petra',
        words: ['rasia', 'kuppi', 'vihko'],
      },
    ],
    startTime: new Date(),
    running: false,
  },
  {
    id: '2',
    type: 'sanakierto' as GameType,
    players: [
      {
        name: 'Matti',
        words: ['lamppu', 'pöytä', 'sohva'],
      },
      {
        name: 'Pertti',
        words: ['laulu', 'tuoli', 'peitto'],
      },
      {
        name: 'Lauri',
        words: ['naru', 'ikkuna', 'ovi'],
      },
      {
        name: 'Abraham',
        words: ['presidentti', 'päällikkö', 'lattia'],
      },
      {
        name: 'Sauli',
        words: ['sammakko', 'tikku', 'lanka'],
      },
    ],
    startTime: new Date(),
    running: false,
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

export const startGame = (id: string): Action => {
  return {
    type: 'START_GAME',
    payload: id,
  };
};

export default reducer;
