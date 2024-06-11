import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Permissions from '../../utils/permissions';
import { useSelector } from 'react-redux';

import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

export default function AssetTableRow({
  selected,
  tag_name,
  product_name,
  owner,
  status,
  created_at,
  created_by,
  handleClick,
  onEditClick,
  onDeleteClick,
  onStatusChangeClick
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const userPermissions = useSelector((state) => new Set(state.authentication.userPermissions));


  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {tag_name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{product_name}</TableCell>
        <TableCell>{owner}</TableCell>
        <TableCell>{status}</TableCell>
        <TableCell>{created_at}</TableCell>
        <TableCell>{created_by}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={() => onEditClick()}>
          <Iconify icon="eva:more-vertical-fill" sx={{ mr: 2 }} />
          More
        </MenuItem>

        <MenuItem onClick={() => onStatusChangeClick()}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        
        {userPermissions.has(Permissions.ADD_ASSET)?
          <MenuItem onClick={() => onDeleteClick()}  sx={{ color: 'error.main' }}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
          :""
        }
      </Popover>
    </>
  );
}

AssetTableRow.propTypes = {
    tag_name: PropTypes.any,
    handleClick: PropTypes.func,
    product_name: PropTypes.any,
    owner: PropTypes.any,
    status:PropTypes.any,
    created_at:PropTypes.any,
    selected: PropTypes.any,
    created_by: PropTypes.any,
    onEditClick:PropTypes.func,
    onDeleteClick:PropTypes.func,
    onStatusChangeClick:PropTypes.func,
};
