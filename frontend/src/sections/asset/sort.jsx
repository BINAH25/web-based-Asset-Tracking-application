import PropTypes from 'prop-types';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

Sort.propTypes = {
  options: PropTypes.array,
  onFilter: PropTypes.func,
  filter: PropTypes.any,
};

export default function Sort({ options,onFilter,filter }) {
  return (
    <TextField 
    select size="small" 
    value={filter} 
    sx={{ marginRight: 3 }}
    onChange={onFilter}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
