import React from 'react';
import { UserContextProvider } from '../context';
import { AppUser, LoggedInUser } from '../types';
import { DEFAULT_USER } from '../constants/index';
import userService from '../services/users';

interface UserProviderProps {
  children: React.ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = React.useState<AppUser>(DEFAULT_USER);
  const [loading, setLoading] = React.useState(false);

  // check local storage for user
  React.useEffect(() => {
    const loggedUser = window.localStorage.getItem('kotipelitUser');

    if (loggedUser) {
      const parsedUser: LoggedInUser = JSON.parse(loggedUser);

      userService.setToken(parsedUser.token);

      setUser(parsedUser);
    }
  }, []);

  const logout = React.useCallback(() => {
    window.localStorage.removeItem('kotipelitUser');

    setUser(DEFAULT_USER);
  }, []);

  const data = React.useMemo(
    () => ({
      user,
      setUser,
      logout,
      loading,
      setLoading,
    }),
    [user, logout, loading]
  );

  return <UserContextProvider value={data}>{children}</UserContextProvider>;
};

export default UserProvider;
