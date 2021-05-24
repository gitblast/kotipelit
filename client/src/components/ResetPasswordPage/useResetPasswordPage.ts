import { useLocation } from 'react-router-dom';
import React from 'react';
import * as Yup from 'yup';

import userService from '../../services/users';
import logger from '../../utils/logger';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const useResetPasswordPage = () => {
  const [error, setError] = React.useState('');
  const [passwordChanged, setPasswordChanged] = React.useState(false);

  const query = useQuery();

  const handleSubmit = React.useCallback(
    async (values: { password: string; passwordConfirm: string }) => {
      const { password } = values;

      try {
        const token = query.get('token');
        const userId = query.get('userId');

        if (!token || !userId) {
          logger.error('could not parse token or userId from query');
          throw new Error();
        }

        await userService.resetPassword(password, token, userId);

        setPasswordChanged(true);
      } catch (e) {
        const info = e.response?.data;

        const errorMsg = info
          ? `Salasanan vaihto epäonnistui: ${info}`
          : 'Salasanan vaihto epäonnistui. Yritä myöhemmin uudelleen.';

        setError(errorMsg);
      }
    },
    [query]
  );

  const fieldRequiredText = 'Pakollinen kenttä';

  const validator = React.useMemo(
    () =>
      Yup.object({
        password: Yup.string()
          .min(8, 'Vähintään 8 merkkiä')
          .required(fieldRequiredText),
        passwordConfirm: Yup.string()
          .oneOf([Yup.ref('password')], 'Salasanat eivät täsmää')
          .required(fieldRequiredText),
      }),
    []
  );

  return { validator, handleSubmit, error, passwordChanged };
};

export default useResetPasswordPage;
