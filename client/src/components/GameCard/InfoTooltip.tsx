import { IconButton, Popover, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
      pointerEvents: 'none',
    },
    helpIcon: {
      // caption color
      color: 'rgb(135 135 135)',
      marginLeft: theme.spacing(0.5),
      fontSize: 19,
    },
    paper: {
      padding: theme.spacing(1),
      maxWidth: 300,
    },
  })
);

interface InfoTooltipProps {
  text: string;
}

const InfoTooltip = ({ text }: InfoTooltipProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <span>
      <IconButton
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        size="small"
        edge="end"
      >
        <HelpOutlineIcon className={classes.helpIcon}></HelpOutlineIcon>
      </IconButton>

      <Popover
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography variant="body2">{text}</Typography>
      </Popover>
    </span>
  );
};

export default InfoTooltip;
