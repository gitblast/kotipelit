import { useTranslation } from 'react-i18next';
import React from 'react';

import * as Yup from 'yup';
import userService from '../../services/users';
import logger from '../../utils/logger';

interface RegisterFormValues {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthYear: string;
  password: string;
  passwordConfirm: string;
}

const useRegisterForm = () => {
  const { t } = useTranslation();
  const [userAdded, setUserAdded] = React.useState(false);
  const [error, setError] = React.useState('');

  const fieldRequiredText = t('validation.requiredField');

  const validator = Yup.object({
    username: Yup.string()
      .matches(/^\S*$/, t('validation.noSpaces'))
      .min(3, t('validation.minLength', { minLength: 3 }))
      .max(12, t('validation.maxLength', { maxLength: 12 }))
      .required(fieldRequiredText),
    firstName: Yup.string()
      .matches(/^\S*$/, t('validation.noSpaces'))
      .max(16, t('validation.maxLength', { maxLength: 16 }))
      .required(fieldRequiredText),
    lastName: Yup.string()
      .matches(/^\S*$/, t('validation.noSpaces'))
      .max(25, t('validation.maxLength', { maxLength: 25 }))
      .required(fieldRequiredText),
    email: Yup.string()
      .matches(/^\S*$/, t('validation.noSpaces'))
      .email(t('validation.invalidField', { fieldName: t('common.email') }))
      .required(fieldRequiredText),
    birthYear: Yup.string()
      .matches(/^\d+$/, t('validation.mustBeNumber'))
      .required(fieldRequiredText),
    password: Yup.string()
      .min(8, t('validation.minLength', { minLength: 8 }))
      .required(fieldRequiredText),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password')], t('validation.passwordsDontMatch'))
      .required(fieldRequiredText),
  });

  const handleSubmit = React.useCallback(
    async (values: RegisterFormValues) => {
      const {
        username,
        password,
        passwordConfirm,
        email,
        birthYear,
        firstName,
        lastName,
      } = values;

      if (password !== passwordConfirm) {
        logger.error('passwords do not match');

        return;
      }

      const userToAdd = {
        username,
        password,
        email: email.toLowerCase(),
        birthYear: Number(birthYear),
        firstName,
        lastName,
      };

      logger.log(`adding new user`, { ...userToAdd, password: '***' });

      try {
        await userService.addNew(userToAdd);

        setUserAdded(true);
      } catch (e) {
        logger.error(`error adding user: ${e.response?.data}`);

        setError(t('registerForm.creationFailed'));
      }
    },
    [t]
  );

  return {
    handleSubmit,
    validator,
    error,
    userAdded,
  };
};

export default useRegisterForm;
