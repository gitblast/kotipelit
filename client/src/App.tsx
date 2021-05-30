import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ChannelPage from './components/ChannelPage';
import CompanyEvents from './components/CompanyEvents';
import CompanyInfo from './components/CompanyInfo';
import ConfirmationPage from './components/ConfirmationPage';
import Footer from './components/Footer';
import FrontPage from './components/FrontPage';
import Loader from './components/Loader';
import LoginForm from './components/LoginForm/LoginForm';
import NotFoundPage from './components/NotFoundPage';
import QuestionsAnswers from './components/QuestionsAnswers';
import ScrollToTop from './components/ScrollToTop';
import TopBar from './components/TopBar';
import UserProvider from './components/UserProvider';
import GamesProvider from './components/GamesProvider';

// lazy load due to size

const RegisterPage = lazy(() =>
  import('./components/RegisterPage/RegisterPage')
);

const ResetPasswordPage = lazy(() =>
  import('./components/PasswordChange/ResetPasswordPage')
);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      minHeight: '80vh',
      overflow: 'hidden',
      background: 'rgba(11, 43, 56, 1)',
    },
  })
);

const App = () => {
  const classes = useStyles();

  return (
    <Suspense fallback="Loading...">
      <Router>
        <UserProvider>
          <GamesProvider>
            <ScrollToTop />
            <TopBar />
            <div className={classes.container}>
              <Suspense fallback={<Loader msg="Ladataan..." />}>
                <Switch>
                  <Route path="/vaihdasalasana">
                    <ResetPasswordPage />
                  </Route>
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
                  <Route path="/yleista">
                    <CompanyInfo />
                  </Route>
                  <Route path="/yritystapahtumat">
                    <CompanyEvents />
                  </Route>
                  <Route path={`/:username`}>
                    <ChannelPage />
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
          </GamesProvider>
        </UserProvider>
      </Router>
    </Suspense>
  );
};

export default App;
