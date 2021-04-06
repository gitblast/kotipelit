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
      top: 22,
      width: 'fit-content',
      padding: theme.spacing(1),
      paddingBottom: theme.spacing(3),
      margin: theme.spacing(0.5),
    },
    answerText: {
      textTransform: 'capitalize',
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
