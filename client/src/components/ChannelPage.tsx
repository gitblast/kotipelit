import React from 'react';

import { Route, Switch, Redirect } from 'react-router-dom';

import NewGame from './NewGame/NewGame';
import RTCGameRoom from './RTCGameRoom';
import GameLobby from './GameLobby';
import Dashboard from './Dashboard';
import { Role } from '../types';
import TYFPPage from './TYFPPage';
import NotFoundPage from './NotFoundPage';
import CancelPage from './CancelPage';
import { useUser } from '../context';

const ChannelPage: React.FC = () => {
  const { user } = useUser();

  const basePath = '/:username';
  return (
    <Switch>
      <Route path={`${basePath}/kiitos`}>
        <TYFPPage />
      </Route>
      <Route path={`${basePath}/newgame`}>
        {user.loggedIn ? <NewGame /> : <Redirect to="/kirjaudu" />}
      </Route>
      <Route path={`${basePath}/peruuta/:inviteCode`}>
        <CancelPage />
      </Route>
      <Route path={`${basePath}/kutsut/:gameID`}>
        <GameLobby />
      </Route>
      <Route path={`${basePath}/live/:gameID`}>
        <RTCGameRoom role={Role.SPECTATOR} />
      </Route>
      <Route path={`${basePath}/pelit/:gameID`}>
        {user.loggedIn ? (
          <RTCGameRoom role={Role.HOST} />
        ) : (
          <Redirect to="/kirjaudu" />
        )}
      </Route>
      <Route path={`${basePath}/:inviteCode`}>
        {<RTCGameRoom role={Role.PLAYER} />}
      </Route>
      <Route exact path={`${basePath}`}>
        {user.loggedIn ? (
          <Dashboard user={user} />
        ) : (
          <Redirect to="/kirjaudu" />
        )}
      </Route>
      <Route path="*">
        <NotFoundPage />
      </Route>
    </Switch>
  );
};

export default ChannelPage;
