import { Checkbox, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { useKotitonniData } from '../context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    answerBubble: {
      // Shapes made with https://bennettfeely.com/clippy/
      clipPath:
        'polygon(0% 0%, 100% 0%, 100% 75%, 79% 75%, 80% 99%, 55% 76%, 0% 75%)',
      position: 'absolute',
      width: 'fit-content',
      padding: theme.spacing(1),
      paddingBottom: theme.spacing(3),
      margin: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
    },
    answerText: {
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.4rem',
      },
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
    <Paper className={classes.answerBubble}>
      <Typography variant="body1" className={classes.answerText}>
        {answer}
      </Typography>
      <Checkbox checked={checked} onChange={() => toggleClicked(playerId)} />
    </Paper>
  );
};

export default AnswerBubble;
