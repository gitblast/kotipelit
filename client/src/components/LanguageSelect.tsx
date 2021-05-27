import { makeStyles, Theme, createStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      paddingRight: theme.spacing(1),
    },
    clickable: {
      cursor: 'pointer',
    },
  })
);
/* 
interface Language {
  short: string;
  full: string;


}

Language[] = [
  { short: 'fi', full: 'Suomi' },
  {
    short: 'en',
    full: 'English',
  },
]; */

const languageMap: Record<string, string> = {
  fi: 'suomi',
  en: 'english',
};

const LanguageSelect = () => {
  const classes = useStyles();

  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    if (i18n.language === 'fi') {
      i18n.changeLanguage('en');
    } else {
      i18n.changeLanguage('fi');
    }
  };

  return (
    <div className={classes.container}>
      <Typography
        className={classes.clickable}
        variant="body2"
        color="primary"
        onClick={toggleLanguage}
      >
        {languageMap[i18n.language]}
      </Typography>
    </div>
  );
};

export default LanguageSelect;
