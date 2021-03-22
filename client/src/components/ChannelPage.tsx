import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NewGame from './NewGame/NewGame';
import RTCGameRoom from './RTCGameRoom';
import GameLobby from './GameLobby';
import Dashboard from './Dashboard';
import { useSelector } from 'react-redux';
import { Role, State /**BaseUser */ } from '../types';
import TYFPPage from './TYFPPage';

interface ChannelPageProps {
  labelText: string;
}

const ChannelPage: React.FC<ChannelPageProps> = () => {
  const user = useSelector((state: State) => state.user);

  return (
    <Router>
      <Switch>
        <Route path="/:username/kiitos">
          <TYFPPage />
        </Route>
        <Route path="/:username/newgame">
          {user.loggedIn && <NewGame username={user.username} />}
        </Route>
        <Route path="/:username/kutsut/:gameID">
          <GameLobby />
        </Route>
        <Route path="/:username/live/:gameID">
          <RTCGameRoom role={Role.SPECTATOR} />
        </Route>
        <Route path="/:username/pelit/:gameID">
          {user.loggedIn && <RTCGameRoom role={Role.HOST} />}
        </Route>
        <Route path="/:username/:playerId">
          {!user.loggedIn && <RTCGameRoom role={Role.PLAYER} />}
        </Route>
        <Route path="/">{user.loggedIn && <Dashboard user={user} />}</Route>
      </Switch>
    </Router>
  );
};

export default ChannelPage;
