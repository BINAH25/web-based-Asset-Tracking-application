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
import { useLazyGetAllTagsQuery,usePutTagMutation } from '../../../features/resources/resources-api-slice';
import { useToast } from '@chakra-ui/react'
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CircularProgress from '@mui/material/CircularProgress';
import TableEmptyRows from '../../user/table-empty-rows';
import TableNoData from '../../user/table-no-data';
import UserTableHead from '../../user/user-table-head';
import TagTableToolbar from '../tag-table-toolbar';
import TagTableRow from '../tag-table-row';
import { emptyRows, applyFilter, getComparator } from '../utils';

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
export default function TagPage() {
    const toast = useToast()

    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [open, setOpen] = useState(false);
    const [tagID, setTagID] = useState('');
    const [tagName, setTagName] = useState('');
    const [getTags, { data: response = [],error: errorGettingTags }] = useLazyGetAllTagsQuery()
    const [addTag,  { isLoading, error }] = usePutTagMutation()
    const [tags, setTags] = useState([])


  useEffect(() => {
    getTags();
}, [getTags]);


useEffect(() => {
    if (response && Array.isArray(response.success_message)) {
        setTags(response.success_message);
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
      const newSelecteds = tags.map((n) => n.usernane);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, usernane) => {
    const selectedIndex = selected.indexOf(usernane);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, usernane);
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
    inputData: tags,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  

  const handleAddTag = async (event) => {
    event.preventDefault()
    if (!tagID || !tagName) {
      toast({
        position: 'top-center',
        title: 'Missing Fields',
        description: 'All fields are required',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return; 
    }
    const body = { 
        tag_id: tagID, 
        tag_name: tagName,
    }

    try {
        const response = await addTag(body).unwrap()

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
          description: "Tag added successfully",
          status: 'success',
          duration: 5000,
          isClosable: true,
      })
        setTags((prevTags) => [response, ...prevTags]);
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
    if (errorGettingTags) {
        toast({
            position: 'top-center',
            title: `An error occurred: ${errorGettingTags.originalStatus}`,
            description: errorGettingTags.status,
            status: 'error',
            duration: 2000,
            isClosable: true,
        })
    }
}, [errorGettingTags, toast])

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

  const renderForm = (
    <>
      <Stack spacing={3} sx={{ my: 2 }}>
        <TextField 
        name="Tag ID" 
        label="Tag ID"
        onChange={(e) => setTagID(e.target.value)}
        required />

        <TextField
        name="Tag Name"
        label="Tag Name"
        onChange={(e) => setTagName(e.target.value)}
        required />
        
      </Stack>

      <Button 
      fullWidth size="large" 
      type="submit" 
      variant="contained" 
      color="inherit"
      disabled={isLoading}
      onClick={handleAddTag}
      >
        {isLoading && <CircularProgress size={30}/>}
        Add Tag
      </Button>
    </>
  );

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Tags</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpen}>
          New Tag
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
                Add Tag Form
            </Typography>
            </Stack>
            {renderForm}
          </Box>
        </Modal>
      </Stack>

      <Card>
        <TagTableToolbar
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
                rowCount={tags.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'tag_id', label: 'Tag ID' },
                  { id: 'tag_name', label: 'Tag Name' },
                  { id: 'created_by', label: 'Created by' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TagTableRow
                      key={row.id}
                      tag_id={row.tag_id}
                      tag_name={row.tag_name}
                      created_by={row.created_by.username}
                      selected={selected.indexOf(row.usernane) !== -1}
                      handleClick={(event) => handleClick(event, row.usernane)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, tags.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={tags.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
