import {
  State,
  Action,
  SelectableGame,
  GameType,
  GameStatus,
  ActiveGame,
} from '../types';

const initialState = {
  games: [],
  activeGame: null,
};

const activate = (game: SelectableGame): ActiveGame => {
  switch (game.type) {
    case GameType.SANAKIERTO:
      return {
        ...game,
        turn: 0,
        round: 1,
      };
    default: {
      console.error(
        'Something went wrong, expected a selectable game, got ',
        game
      );
      throw new Error(
        `Something went wrong, expected a selectable game, got ${game}`
      );
    }
  }
};

const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case 'INIT_GAMES': {
      return {
        ...state,
        games: action.payload,
      };
    }
    case 'ADD_GAME': {
      return {
        ...state,
        games: state.games.concat(action.payload),
      };
    }
    case 'DELETE_GAME': {
      return {
        ...state,
        games: state.games.filter((game) => game.id !== action.payload),
      };
    }
    case 'LAUNCH_GAME': {
      const gameToActivate = state.games.find(
        (game) => game.id === action.payload
      );

      if (!gameToActivate) throw new Error(`Game not found`);

      const activatedGame = activate(gameToActivate);

      return {
        activeGame: activatedGame,
        games: state.games.map((game) =>
          game.id === action.payload
            ? { ...game, status: GameStatus.WAITING }
            : game
        ),
      };
    }
    case 'UPDATE_ACTIVE_GAME': {
      return {
        ...state,
        activeGame: action.payload,
      };
    }
    default:
      return state;
  }
};

const hardcodedGames = [
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

export const updateGame = (updatedGame: ActiveGame): Action => {
  return {
    type: 'UPDATE_ACTIVE_GAME',
    payload: updatedGame,
  };
};

export default reducer;
