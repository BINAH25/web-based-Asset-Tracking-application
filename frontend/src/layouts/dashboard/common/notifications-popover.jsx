
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { fToNow } from '../../../utils/format-time';

import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------



export default function NotificationsPopover() {
  
  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} >
        <Badge badgeContent={2} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

    </>
  );
}

// ----------------------------------------------------------------------


