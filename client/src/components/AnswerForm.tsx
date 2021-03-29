import { Fab, TextField, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btnContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        justifyContent: 'center',
      },
    },
    sendAnswerBtn: {
      background: 'linear-gradient(to bottom, rgb(36 170 167), rgb(33 36 36))',
      color: 'white',
      boxShadow: 'rgb(231 239 191) 4px 3px 18px',
      padding: theme.spacing(4),
      margin: theme.spacing(1),
      border: 'solid',
      borderColor: 'white',
    },
    answerField: {
      // backgroundColor: 'white',
    },
  })
);

interface AnswerFormProps {
  handleAnswer: (answer: string) => void;
  answeringDisabled: boolean;
  fetchLatestGameStatus: () => void;
}

const AnswerForm: React.FC<AnswerFormProps> = ({
  answeringDisabled,
  fetchLatestGameStatus,
  handleAnswer,
}) => {
  const classes = useStyles();
  const [answer, setAnswer] = React.useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleAnswer(answer);

    setAnswer('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (!answeringDisabled && event.key === 'Enter') {
      handleAnswer(answer);

      setAnswer('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onKeyPress={handleKeyPress}
      className={classes.btnContainer}
    >
      <div className={classes.answerField}>
        <TextField
          variant="filled"
          label="Vastaus.."
          value={answer}
          onChange={({ target }) => setAnswer(target.value)}
          disabled={answeringDisabled}
          onClick={fetchLatestGameStatus}
        />
      </div>

      <Fab
        className={classes.sendAnswerBtn}
        type="submit"
        variant="extended"
        disabled={answeringDisabled}
      >
        <Typography variant="body1">Vastaa</Typography>
      </Fab>
    </form>
  );
};

export default AnswerForm;
