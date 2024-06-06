import React, { useState, useEffect} from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { useLazyGetUsersQuery,
  useLazyGetAllNewInstitutionsQuery,
  useDeleteUsersMutation, 
  useRegisterUserMutation } from '../../../features/resources/resources-api-slice';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CircularProgress from '@mui/material/CircularProgress';
import { useToast } from '@chakra-ui/react'
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import Grid from '@mui/material/Grid';

// ----------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};
export default function UserPage() {
  const toast = useToast()

  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [getusers, { data: response = [] }] = useLazyGetUsersQuery()
  const [getInstitutions, { data: res = [] }] = useLazyGetAllNewInstitutionsQuery()
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('')
  const [institution, setInstitution] = useState('');
  const [institutions, setInstitutions] = useState([]);
  const [addUser,  { isLoading, error }] = useRegisterUserMutation()
  const [deleteUser,  { isLoading: userLoading, error: userError }] = useDeleteUsersMutation()

  const [users, SetUsers] = useState([])
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDeleteOpen = (item) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };
    
  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setSelectedItem(null);
  }


  useEffect(() => {
    getusers();
}, [getusers]);

  useEffect(() => {
    getInstitutions();
}, [getInstitutions]);

useEffect(() => {
  if (response && Array.isArray(response.success_message)) {
    SetUsers(response.success_message);
  }
}, [response]);

useEffect(() => {
  if (res && Array.isArray(res.success_message)) {
    setInstitutions(res.success_message);
  }
}, [res]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.username);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, username) => {
    const selectedIndex = selected.indexOf(username);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, username);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  const handleInstitutionChange = (event) => {
    setInstitution(event.target.value);
  };

  
  // delete user
  const handleDeleteUser = async (event) => {
    event.preventDefault()
    const body = { 
      id: selectedItem?.id
    }
    try {
      const response = await deleteUser(body).unwrap()

      if (response['error_message'] != null) {
        toast({
            position: 'top-center',
            title: `An error occurred`,
            description: response["error_message"],
            status: 'error',
            duration: 5000,
            isClosable: true,
        })
    } else {
      toast({
        position: 'top-center',
        title: 'OTP Sent',
        description: response["success_message"],
        status: 'success',
        duration: 5000,
        isClosable: true,
    })
      SetUsers((prevTags) => prevTags.filter((user) => user.id !== selectedItem.id));
      handleDeleteClose()
    }
    } catch (err) {
      toast({
        position: 'top-center',
        title: `An error occurred`,
        description: err.originalStatus,
        status: 'error',
        duration: 2000,
        isClosable: true,
    })
    }

  }

  useEffect(() => {
    if (userError) {
      toast({
          position: 'top-center',
          title: `An error occurred: ${userError.originalStatus}`,
          description: userError.status,
          status: 'error',
          duration: 2000,
          isClosable: true,
      })
    }
  }, [userError, toast])


  // add user
  const handleAddUser = async (event) => {
    event.preventDefault()
    if (!institution || !password) {
      toast({
        position: 'top-center',
        title: 'Missing Fields',
        description: 'All fields are required',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return; // Stop the function from proceeding
    }
    const body = { 
        institution: institution, 
        password: password
    }

    try {
        const response = await addUser(body).unwrap()

        if (response['error_message'] != null) {
          toast({
              position: 'top-center',
              title: `An error occurred`,
              description: response["error_message"],
              status: 'error',
              duration: 5000,
              isClosable: true,
          })
      } else {
        toast({
          position: 'top-center',
          title: 'OTP Sent',
          description: "User added successfully",
          status: 'success',
          duration: 5000,
          isClosable: true,
      })
        SetUsers((prevUsers) => [response, ...prevUsers]);
        // Remove the used institution from the list
        setInstitutions((prevInstitutions) => 
          prevInstitutions.filter(inst => inst.id !== institution)
        );
        handleClose()
      }
      } catch (err) {
        toast({
          position: 'top-center',
          title: `An error occurred`,
          description: err.originalStatus,
          status: 'error',
          duration: 2000,
          isClosable: true,
      })
      }

  }

  useEffect(() => {
    if (error) {
        toast({
            position: 'top-center',
            title: `An error occurred: ${error.originalStatus}`,
            description: error.status,
            status: 'error',
            duration: 2000,
            isClosable: true,
        })
    }
}, [error, toast])

  // DELETE INSTITUTION
  const renderDeleteForm = (
    <Box  sx={{ my: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={4} >
          <Typography variant="subtitle1">Username:</Typography>
          <Typography variant="body1" >{selectedItem?.username || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={4} >
          <Typography variant="subtitle1">Institution Name:</Typography>
          <Typography variant="body1" >{selectedItem?.institution?.institution_name || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={4} >
          <Typography variant="subtitle1">Institution Type:</Typography>
          <Typography variant="body1" >{selectedItem?.institution?.institution_type || 'N/A'}</Typography>
        </Grid>
      </Grid>
    
      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="error"
        sx={{ my: 2 }}
        disabled={userLoading}
        onClick={handleDeleteUser}
      >
        {userLoading && <CircularProgress size={30}/>}
        Delete User
      </Button>

      <Button
        fullWidth
        size="large"
        type="button"
        variant="contained"
        color="inherit"
        onClick={handleDeleteClose}
        sx={{ my: 2 }}
      >
        Cancel
      </Button>
    </Box>
  );

  // ADD INSTITUTION
  const renderForm = (
    <>
      <Stack spacing={3} sx={{ my: 2 }}>
      
        <FormControl fullWidth required>
          <InputLabel id="location-label"> Select Institution </InputLabel>
          <Select
            labelId="location-label"
            id="location"
            label="Location"
            value={institution}
            onChange={handleInstitutionChange}

          >
           {institutions.map((institution) => (
          <MenuItem key={institution.id} value={institution.id}>
            {`${institution.institution_name} (${institution.username})`}
          </MenuItem>
        ))}
          </Select>
        </FormControl>

        <TextField
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          required
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Button 
      fullWidth size="large" 
      type="submit" 
      variant="contained" 
      color="inherit"
      disabled={isLoading}
      onClick={handleAddUser}
      >
        {isLoading && <CircularProgress size={30}/>}
        Add User
      </Button>
    </>
  );


  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Users</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpen}>
          New User
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}
          > 
            <Stack alignItems="center">
            <Typography variant="h4" sx={{ my: 1 }}>
                Add User Form
            </Typography>
            </Stack>
            {renderForm}
          </Box>
        </Modal>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[                  
                  { id: 'username', label: 'Username' },
                  { id: 'email', label: 'Email' },
                  { id: 'institution', label: 'Institution' },
                  { id: 'created_by', label: 'created_by', align: 'center' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      username={row.username}
                      email={row.email}
                      institution={row.institution?.institution_name}
                      created_by={row.created_by?.username}
                      selected={selected.indexOf(row.username) !== -1}
                      handleClick={(event) => handleClick(event, row.username)}
                      onDeleteClick={() => handleDeleteOpen(row)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      <Modal
      open={deleteOpen}
      onClose={handleDeleteClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box  sx={style}>
        <Stack >
          <Typography variant="h4" sx={{ my: 1, textAlign: 'center' }}>
            Are you sure you want to delete this user?
          </Typography>
        </Stack>
          {renderDeleteForm}
      </Box>
    </Modal>
    </Container>
  );
}
