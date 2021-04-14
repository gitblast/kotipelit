import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { Suspense, lazy } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import logoImg from './assets/images/logoTransparent.png';
import ChannelPage from './components/ChannelPage';
import CompanyInfo from './components/CompanyInfo';
import ConfirmationPage from './components/ConfirmationPage';
import Footer from './components/Footer';
import FrontPage from './components/FrontPage';
import LoginForm from './components/LoginForm/LoginForm';
import NotFoundPage from './components/NotFoundPage';
import QuestionsAnswers from './components/QuestionsAnswers';
import ScrollToTop from './components/ScrollToTop';
import UserControls from './components/UserControls';
import { initChannels } from './reducers/channels.reducer';
import { checkForUser } from './reducers/user.reducer';
import { HostChannel, State } from './types';
import Loader from './components/Loader';

// lazy load due to size

const RegisterPage = lazy(() =>
  import('./components/RegisterPage/RegisterPage')
);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navbar: {
      // marginBottom: theme.spacing(3),
      // maxWidth: 1230,
      margin: 'auto',
      backgroundColor: 'rgba(11, 43, 56, 1)',
      minHeight: '9vh',
      color: 'black',
    },
    logo: {
      maxHeight: 60,
      width: 'auto',
      marginTop: theme.spacing(1),
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    container: {
      width: '100%',
      minHeight: '80vh',
      overflow: 'hidden',
      background: 'rgba(11, 43, 56, 1)',
    },
    registerLink: {
      marginLeft: theme.spacing(1),
      underline: 'none',
    },
    flex: {
      display: 'flex',
    },
  })
);

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const user = useSelector((state: State) => state.user, shallowEqual);

  const channels = useSelector(
    (state: State) => state.channels.allChannels,
    shallowEqual
  );

  // init channels and check local storage for user
  React.useEffect(() => {
    dispatch(checkForUser());
    dispatch(initChannels());
  }, [dispatch]);

  const channelRoutes = (channels: HostChannel[]) => {
    return channels.map((channel) => (
      <Route key={channel.username} path={`/${channel.username}`}>
        <ChannelPage labelText={channel.channelName} />
      </Route>
    ));
  };

  return (
    <Router>
      <ScrollToTop />
      <AppBar position="static" className={classes.navbar}>
        <Toolbar className={classes.toolbar}>
          <Link to="/" className={classes.logo}>
            <img className={classes.logo} src={logoImg} alt="Kotipelit" />
          </Link>
          <div className={classes.flex}>
            <div>
              <UserControls user={user} />
            </div>
            {!user.loggedIn && (
              <div className={classes.registerLink}>
                <Link to="/rekisteroidy">
                  <Typography variant="body2">Rekisteröidy</Typography>
                </Link>
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.container}>
        <Suspense fallback={<Loader msg="Ladataan..." />}>
          <Switch>
            {channelRoutes(channels)}
            <Route path="/rekisteroidy">
              <RegisterPage />
            </Route>
            <Route path="/vahvista/:confirmationId">
              <ConfirmationPage />
            </Route>
            <Route path="/kirjaudu">
              <LoginForm />
            </Route>
            <Route path="/kysyttya">
              <QuestionsAnswers />
            </Route>
            <Route path="/yritys">
              <CompanyInfo />
            </Route>
            <Route exact path="/">
              <FrontPage />
            </Route>
            <Route path="*">
              <NotFoundPage />
            </Route>
          </Switch>
        </Suspense>
      </div>

      <Footer />
    </Router>
  );
};

export default App;
