import React from 'react';

import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../reducers/user.reducer';
import userService from '../../services/users';
import logger from '../../utils/logger';

const useLogin = () => {
  const dispatch = useDispatch();

  const [emailNotVerified, setEmailNotVerified] = React.useState(false);

  const handleLogin = React.useCallback(
    async (username: string, password: string) => {
      try {
        const user = await userService.login(username, password);

        userService.setToken(user.token);

        const loggedUser = {
          ...user,
        };

        window.localStorage.setItem(
          'kotipelitUser',
          JSON.stringify(loggedUser)
        );

        dispatch(loginSuccess(loggedUser));
      } catch (err) {
        const errBody = 'error logging in: ';

        switch (err?.response?.data) {
          case 'Invalid username or password': {
            logger.error(errBody + 'Invalid username or password');

            throw new Error('Väärä käyttäjätunnus tai salasana');
          }
          case 'Email not verified': {
            logger.error(errBody + 'Email not verified');

            setEmailNotVerified(true);

            break;
          }
          default: {
            logger.error(errBody + err.message);

            throw new Error(
              `Ongelma sisäänkirjautumisessa. Yritä myöhemmin uudelleen.`
            );
          }
        }
      }
    },
    [dispatch]
  );

  return {
    handleLogin,
    emailNotVerified,
  };
};

export default useLogin;
