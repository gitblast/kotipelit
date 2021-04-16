import { Checkbox, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { useKotitonniData } from '../context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrongAnswer: {
      position: 'absolute',
      top: 22,
      width: 'fit-content',
      backgroundColor: 'rgb(171 34 186)',
      padding: theme.spacing(0.8),
      margin: theme.spacing(0.5),
      boxShadow: '3px 3px 5px black',
    },
    answerText: {
      textTransform: 'capitalize',
      color: 'black',
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.2rem',
      },
    },
    correctAnswer: {
      position: 'absolute',
      top: 22,
      width: 'fit-content',
      padding: theme.spacing(0.8),
      margin: theme.spacing(0.5),
      boxShadow: '3px 3px 5px black',
      backgroundColor: 'rgb(41 174 170)',
    },
  })
);

interface AnswerBubbleProps {
  answer: string;
  playerId: string;
}

const AnswerBubble: React.FC<AnswerBubbleProps> = ({ answer, playerId }) => {
  const classes = useStyles();

  const { clickedMap, toggleClicked } = useKotitonniData();

  const checked = !!clickedMap[playerId];

  return (
    <Paper
      className={` ${checked ? classes.correctAnswer : classes.wrongAnswer}`}
    >
      <Typography variant="body1" className={classes.answerText}>
        {answer}
        <span>
          <Checkbox
            checked={checked}
            onChange={() => toggleClicked(playerId)}
          />
        </span>
      </Typography>
    </Paper>
  );
};

export default AnswerBubble;
