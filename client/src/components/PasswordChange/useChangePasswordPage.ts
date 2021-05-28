import React from 'react';

import userService from '../../services/users';

const useChangePasswordPage = () => {
  const [error, setError] = React.useState('');
  const [passwordChanged, setPasswordChanged] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (values: {
      password: string;
      passwordConfirm: string;
      oldPassword: string;
    }) => {
      const { password, passwordConfirm, oldPassword } = values;

      if (password !== passwordConfirm) {
        return;
      }

      try {
        await userService.changePassword(password, oldPassword);

        setPasswordChanged(true);
      } catch (e) {
        const info = e.response?.data;

        const errorMsg = info
          ? `Salasanan vaihto epäonnistui: ${info}`
          : 'Salasanan vaihto epäonnistui. Yritä myöhemmin uudelleen.';

        setError(errorMsg);
      }
    },
    []
  );

  return { handleSubmit, error, passwordChanged };
};

export default useChangePasswordPage;
