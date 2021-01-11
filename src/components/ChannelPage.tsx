import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NewGameB from './host/NewGameB';
import KotitonniHostView from './kotitonni/KotitonniHostView';
import KotitonniPlayerView from './kotitonni/KotitonniPlayerView';
import RTCGameRoom from './RTCGameRoom';
import GameLobby from './GameLobby';
import Dashboard from './host/Dashboard';
import { useSelector } from 'react-redux';
import { State, BaseUser } from '../types';

interface ChannelPageProps {
  labelText: string;
}

const ChannelPage: React.FC<ChannelPageProps> = () => {
  const user = useSelector((state: State) => state.user);

  return (
    <Router>
      <Switch>
        <Route path="/:username/newgame">
          {user.loggedIn && <NewGameB username={user.username} />}
        </Route>
        <Route path="/:username/kutsut/:gameID">
          <GameLobby />
        </Route>
        <Route path="/:username/pelit/rtc/:gameID">
          {user.loggedIn && <RTCGameRoom isHost />}
        </Route>
        <Route path="/:username/pelit/:gameID">
          {user.loggedIn && <KotitonniHostView user={user} />}
        </Route>
        <Route path="/:username/rtc/:playerId">
          {!user.loggedIn && <RTCGameRoom />}
        </Route>
        <Route path="/:username/:playerId">
          {!user.loggedIn && <KotitonniPlayerView user={user as BaseUser} />}
        </Route>
        <Route path="/">{user.loggedIn && <Dashboard user={user} />}</Route>
      </Switch>
    </Router>
  );
};

export default ChannelPage;
