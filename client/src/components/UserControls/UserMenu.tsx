import { IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useUser } from '../../context';
import { LoggedInUser } from '../../types';

interface UserMenuProps {
  user: LoggedInUser;
}

const UserMenu = ({ user }: UserMenuProps) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { logout } = useUser();

  const history = useHistory();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    logout();

    history.push('/');
  };

  const handleMenuClick = () => {
    // So far hard coded routing to profile

    history.push(`/${user.username}`);
    setAnchorEl(null);
  };

  const handleSettingsClick = () => {
    history.push(`/${user.username}/asetukset`);
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleOpen}
      >
        <AccountCircleIcon></AccountCircleIcon>
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleMenuClick}>{t('common.profile')}</MenuItem>
        <MenuItem onClick={handleSettingsClick}>
          {t('common.settings')}
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography variant="body1">{t('common.signOut')}</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserMenu;
