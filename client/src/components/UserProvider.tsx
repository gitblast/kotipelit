import React from 'react';
import { UserContextProvider } from '../context';
import { AppUser, LoggedInUser } from '../types';
import { DEFAULT_USER } from '../constants/index';
import userService from '../services/users';

interface UserProviderProps {
  children: React.ReactNode;
}

const getInitialUser = () => {
  // check local storage for user
  const loggedUser = window.localStorage.getItem('kotipelitUser');

  if (loggedUser) {
    const parsedUser: LoggedInUser = JSON.parse(loggedUser);

    userService.setToken(parsedUser.token);

    return parsedUser;
  }

  return DEFAULT_USER;
};

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = React.useState<AppUser>(getInitialUser);
  const [loading, setLoading] = React.useState(false);

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
