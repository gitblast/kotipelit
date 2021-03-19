import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography, Checkbox } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { setClicked } from '../reducers/kotitonni.local.reducer';
import { State } from '../types';

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
  })
);

interface AnswerBubbleProps {
  answer: string;
  playerId: string;
}

const AnswerBubble: React.FC<AnswerBubbleProps> = ({ answer, playerId }) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const checked = useSelector(
    (state: State) => !!state.rtc.localData.clickedMap[playerId]
  );

  const handleChange = () => {
    dispatch(setClicked(playerId, !checked));
  };

  return (
    <Paper className={classes.answerBubble}>
      <Typography variant="h6">{answer}</Typography>
      <Checkbox checked={checked} onChange={handleChange} />
    </Paper>
  );
};

export default AnswerBubble;
