import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Paper, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      width: '100%',
    },
    btnContainer: {
      margin: theme.spacing(1),
    },
  })
);

interface RTCPlayerControlsProps {
  handleUpdate: (answer: string) => void;
  disabled: boolean;
}

const RTCPlayerControls: React.FC<RTCPlayerControlsProps> = ({
  disabled,
  handleUpdate,
}) => {
  const classes = useStyles();
  const [answer, setAnswer] = React.useState<string>('');

  const handleClick = () => {
    if (answer.length) {
      handleUpdate(answer);

      setAnswer('');
    }
  };

  return (
    <Paper elevation={3} className={classes.container} square>
      <div>
        <TextField
          variant="outlined"
          label="Vastaus"
          value={answer}
          onChange={({ target }) => setAnswer(target.value)}
          disabled={disabled}
        />
      </div>
      <div className={classes.btnContainer}>
        <Fab
          variant="extended"
          color="primary"
          onClick={handleClick}
          disabled={disabled}
        >
          Vastaa
        </Fab>
      </div>
    </Paper>
  );
};

export default RTCPlayerControls;
