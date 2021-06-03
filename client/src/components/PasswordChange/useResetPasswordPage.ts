import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import React from 'react';

import userService from '../../services/users';
import logger from '../../utils/logger';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const useResetPasswordPage = () => {
  const { t } = useTranslation();
  const [error, setError] = React.useState('');
  const [passwordChanged, setPasswordChanged] = React.useState(false);

  const query = useQuery();

  const handleSubmit = React.useCallback(
    async (values: { password: string; passwordConfirm: string }) => {
      const { password, passwordConfirm } = values;

      if (password !== passwordConfirm) {
        return;
      }

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

        if (info) {
          logger.error(info);
        }

        setError(t('changePwForm.changeFailed'));
      }
    },
    [query, t]
  );

  return { handleSubmit, error, passwordChanged };
};

export default useResetPasswordPage;
