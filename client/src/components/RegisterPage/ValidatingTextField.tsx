import { InputAdornment, TextField as MUITextField } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';
import { fieldToTextField, TextFieldProps } from 'formik-material-ui';
import React from 'react';
import userService from '../../services/users';

const ValidatingTextField = (props: TextFieldProps) => {
  const [loading, setLoading] = React.useState(false);
  const [validated, setValidated] = React.useState(false);

  const {
    form: { handleBlur, values, errors, setFieldError, handleChange },
    field: { name },
  } = props;

  const onBlur = React.useCallback(
    (event) => {
      handleBlur(event);

      if (!errors[name]) {
        setLoading(true);

        userService
          .checkAvailability(name, values[name])
          .then(() => {
            setLoading(false);
            setValidated(true);
          })
          .catch(() => {
            setLoading(false);
            setFieldError(name, 'Varattu');
          });
      }
    },
    [handleBlur, name, values, errors, setFieldError]
  );

  const onChange = React.useCallback(
    (event) => {
      handleChange(event);

      setValidated(false);
    },
    [handleChange]
  );

  const getAdornment = () => {
    if (loading) {
      return (
        <InputAdornment position="end">
          <CircularProgress size={20} />
        </InputAdornment>
      );
    }

    if (validated) {
      return (
        <InputAdornment position="end">
          <CheckIcon />
        </InputAdornment>
      );
    }

    return null;
  };

  return (
    <>
      <MUITextField
        {...fieldToTextField(props)}
        onBlur={onBlur}
        onChange={onChange}
        InputProps={{
          endAdornment: getAdornment(),
        }}
      />
    </>
  );
};

export default ValidatingTextField;
