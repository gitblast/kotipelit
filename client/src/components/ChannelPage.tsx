import React from 'react';

import { Route, Switch } from 'react-router-dom';

import NewGame from './NewGame/NewGame';
import RTCGameRoom from './RTCGameRoom';
import GameLobby from './GameLobby';
import Dashboard from './Dashboard';
import { useSelector } from 'react-redux';
import { Role, State /**BaseUser */ } from '../types';
import TYFPPage from './TYFPPage';
import NotFoundPage from './NotFoundPage';

interface ChannelPageProps {
  labelText: string;
}

const ChannelPage: React.FC<ChannelPageProps> = () => {
  const user = useSelector((state: State) => state.user);

  const basePath = '/:username';
  return (
    <Switch>
      <Route path={`${basePath}/kiitos`}>
        <TYFPPage />
      </Route>
      <Route path={`${basePath}/newgame`}>{user.loggedIn && <NewGame />}</Route>
      <Route path={`${basePath}/kutsut/:gameID`}>
        <GameLobby />
      </Route>
      <Route path={`${basePath}/live/:gameID`}>
        <RTCGameRoom role={Role.SPECTATOR} />
      </Route>
      <Route path={`${basePath}/pelit/:gameID`}>
        {user.loggedIn && <RTCGameRoom role={Role.HOST} />}
      </Route>
      <Route path={`${basePath}/:playerId`}>
        {!user.loggedIn && <RTCGameRoom role={Role.PLAYER} />}
      </Route>
      <Route exact path={`${basePath}`}>
        {user.loggedIn && <Dashboard user={user} />}
      </Route>
      <Route path="*">
        <NotFoundPage />
      </Route>
    </Switch>
  );
};

export default ChannelPage;
