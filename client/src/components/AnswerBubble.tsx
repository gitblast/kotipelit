import { Checkbox, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { useKotitonniData } from '../context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    answerBubble: {
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
        fontSize: '1.4rem',
      },
    },
    correctAnswer: {
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
      className={`${classes.answerBubble} ${
        checked ? classes.correctAnswer : classes.answerBubble
      }`}
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
