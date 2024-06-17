import React, { useState,useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useLazyGetAllInstitutionsQuery,
  usePutInstitutionMutation,
  useDeleteInstitutionsMutation } from '../../../features/resources/resources-api-slice';
import { useToast } from '@chakra-ui/react'
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CircularProgress from '@mui/material/CircularProgress';
import TableEmptyRows from '../../user/table-empty-rows';
import TableNoData from '../../user/table-no-data';
import InstitutionTableRow from '../institution-table-row';
import UserTableHead from '../../user/user-table-head';
import InstitutionTableToolbar from '../institution-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../../user/utils';
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
export default function InstitutionPage() {

  const toast = useToast()
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [institutionType, setInstitutionType] = useState('');
  const [getInstitutions, { data: response = [] }] = useLazyGetAllInstitutionsQuery()
  const [addInstitutions,  { isLoading, error }] = usePutInstitutionMutation()
  const [institutions, setInstitutions] = useState([])
  const [deleteInstitution,  { isLoading: institutionLoading, error: institutionError }] = useDeleteInstitutionsMutation()

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
    getInstitutions();
  }, [getInstitutions]);


  useEffect(() => {
      if (response && Array.isArray(response.success_message)) {
          setInstitutions(response.success_message);
      }
  }, [response]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = institutions.map((n) => n.username);
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
    inputData: institutions,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleInstitutionTypeChange = (event) => {
    setInstitutionType(event.target.value);
  };

  // delete institution
  const handledeleteInstitution = async (event) => {
    event.preventDefault()
    const body = { 
      id: selectedItem?.id
    }
    try {
      const response = await deleteInstitution(body).unwrap()

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
      setInstitutions((prevTags) => prevTags.filter((tag) => tag.id !== selectedItem.id));
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
    if (institutionError) {
      toast({
          position: 'top-center',
          title: `An error occurred: ${institutionError.originalStatus}`,
          description: institutionError.status,
          status: 'error',
          duration: 2000,
          isClosable: true,
      })
    }
  }, [institutionError, toast])

  // add instituition
  const handleAddInstitution = async (event) => {
    event.preventDefault()
    if (!username || !email || !institutionName || !location || !phone || !institutionType) {
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
        username: username, 
        email: email,
        institution_name: institutionName,
        location: location,
        phone: phone,
        institution_type: institutionType
    }

    try {
        const response = await addInstitutions(body).unwrap()

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
          description: "Institution added successfully",
          status: 'success',
          duration: 5000,
          isClosable: true,
      })
        setInstitutions((prevInstitutions) => [response, ...prevInstitutions]);
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
  // delete institution
  const renderDeleteForm = (
    <Box  sx={{ my: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={4} >
          <Typography variant="subtitle1">Institution Username:</Typography>
          <Typography variant="body1" >{selectedItem?.username || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={4} >
          <Typography variant="subtitle1">Institution Name:</Typography>
          <Typography variant="body1" >{selectedItem?.institution_name || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={4} >
          <Typography variant="subtitle1">Institution Type:</Typography>
          <Typography variant="body1" >{selectedItem?.institution_type || 'N/A'}</Typography>
        </Grid>
      </Grid>
    
      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="error"
        onClick={handledeleteInstitution}
        disabled={institutionLoading}
        sx={{ my: 2 }}
      >
        {institutionLoading && <CircularProgress size={30}/>}
        Delete Institution
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

  const renderForm = (
    <>
      <Stack spacing={3} sx={{ my: 2 }}>
        <TextField 
        name="Username" 
        label="Username"
        onChange={(e) => setUsername(e.target.value)}
        required />

        <TextField
        name="Email"
        label="Email"
        onChange={(e) => setEmail(e.target.value)}
        required />

        <TextField
        name="Institution Name"
        label="Institution Name"
        onChange={(e) => setInstitutionName(e.target.value)}
        required />

        <TextField 
        name="Location" 
        label="Location" 
        onChange={(e) => setLocation(e.target.value)}
        required />

        <TextField 
        name="Phone" 
        label="Phone"
        onChange={(e) => setPhone(e.target.value)}
        required />

        <FormControl fullWidth required>
          <InputLabel id="location-label">Institution Type</InputLabel>
          <Select
            labelId="location-label"
            id="location"
            value={institutionType}
            label="Location"
            onChange={handleInstitutionTypeChange}
          >
            <MenuItem value="Tertiary">Tertiary </MenuItem>
            <MenuItem value="Secondary">Secondary </MenuItem>
            <MenuItem value="Basic">Basic </MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Button 
      fullWidth size="large" 
      type="submit" 
      variant="contained" 
      color="inherit"
      disabled={isLoading}
      onClick={handleAddInstitution}
      >
        {isLoading && <CircularProgress size={30}/>}
        Add Institution
      </Button>
    </>
  );

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Institutions</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpen}>
          New Institution
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
                Add Institution Form
            </Typography>
            </Stack>
            {renderForm}
          </Box>
        </Modal>
      </Stack>

      <Card>
        <InstitutionTableToolbar
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
                rowCount={institutions.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'username', label: 'Username' },
                  { id: 'email', label: 'Email' },
                  { id: 'institution_name', label: 'Institution Name' },
                  { id: 'location', label: 'Location' },
                  { id: 'phone', label: 'Phone' },
                  { id: 'institution_type', label: 'Institution Type' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <InstitutionTableRow
                      key={row.id}
                      username={row.username}
                      email={row.email}
                      institution_name={row.institution_name}
                      location={row.location}
                      phone={row.phone}
                      institution_type={row.institution_type}
                      selected={selected.indexOf(row.username) !== -1}
                      handleClick={(event) => handleClick(event, row.username)}
                      onDeleteClick={() => handleDeleteOpen(row)} 
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, institutions.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={institutions.length}
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
            Are you sure you  want to delete this Institution?
          </Typography>
        </Stack>
        {renderDeleteForm}
      </Box>
    </Modal>
    </Container>
  );
}
