import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useUser } from '../context';
import { Role } from '../types';
import CancelPage from './CancelPage';
import Dashboard from './Dashboard/Dashboard';
import GameLobby from './GameLobby';
import NewGame from './NewGame/NewGame';
import NotFoundPage from './NotFoundPage';
import ChangePasswordPage from './PasswordChange/ChangePasswordPage';
import RTCGameRoom from './RTCGameRoom';
import TYFPPage from './TYFPPage';

const ChannelPage: React.FC = () => {
  const { user } = useUser();

  const basePath = '/:username';
  return (
    <Switch>
      <Route path={`${basePath}/asetukset`}>
        {user.loggedIn ? <ChangePasswordPage /> : <Redirect to="/kirjaudu" />}
      </Route>
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
