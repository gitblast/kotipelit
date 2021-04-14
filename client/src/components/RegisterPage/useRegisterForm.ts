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
  const [userAdded, setUserAdded] = React.useState(false);
  const [error, setError] = React.useState('');

  const fieldRequiredText = 'Pakollinen kenttä';

  const validator = Yup.object({
    username: Yup.string()
      .matches(/^\S*$/, 'Välilyöntejä ei sallita')
      .min(3, 'Vähintään 3 kirjainta')
      .max(16, 'Korkeintaan 16 kirjainta')
      .required(fieldRequiredText),
    firstName: Yup.string()
      .matches(/^\S*$/, 'Välilyöntejä ei sallita')
      .max(16, 'Korkeintaan 16 kirjainta')
      .required(fieldRequiredText),
    lastName: Yup.string()
      .matches(/^\S*$/, 'Välilyöntejä ei sallita')
      .max(25, 'Korkeintaan 25 kirjainta')
      .required(fieldRequiredText),
    email: Yup.string()
      .matches(/^\S*$/, 'Välilyöntejä ei sallita')
      .email('Virheellinen sähköpostiosoite')
      .required(fieldRequiredText),
    birthYear: Yup.string()
      .matches(/^\d+$/, 'Tulee olla numero')
      .required(fieldRequiredText),
    password: Yup.string()
      .min(8, 'Vähintään 8 merkkiä')
      .required(fieldRequiredText),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password')], 'Salasanat eivät täsmää')
      .required(fieldRequiredText),
  });

  const handleSubmit = React.useCallback(async (values: RegisterFormValues) => {
    const {
      username,
      password,
      email,
      birthYear,
      firstName,
      lastName,
    } = values;

    const userToAdd = {
      username,
      password,
      email,
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

      setError('Tilin luonti epäonnistui. Yritä myöhemmin uudestaan.');
    }
  }, []);

  return {
    handleSubmit,
    validator,
    error,
    userAdded,
  };
};

export default useRegisterForm;
