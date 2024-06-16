import React, { useState,useEffect } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useLazyGetAllInstitutionsQuery } from '../../../features/resources/resources-api-slice';
import { useToast } from '@chakra-ui/react'
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CircularProgress from '@mui/material/CircularProgress';
import TableEmptyRows from '../../user/table-empty-rows';
import TableNoData from '../../user/table-no-data';
import ActivityTableRow from '../table-row';
import TableToolbar from '../table-toolbar';
import UserTableHead from '../../user/user-table-head';
import { emptyRows, applyFilter, getComparator } from '../../user/utils';

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
export default function UserActivityView() {

  const toast = useToast()
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [getInstitutions, { data: response = [], isLoading }] = useLazyGetAllInstitutionsQuery()
  const [institutions, setInstitutions] = useState([])


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
      const newSelecteds = institutions.map((n) => n.usernane);
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
    inputData: institutions,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Activities Logs</Typography>

      </Stack>

      <Card>
        <TableToolbar
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
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <ActivityTableRow
                      key={row.id}
                      username={row.username}
                      email={row.email}
                      institution_name={row.institution_name}
                      location={row.location}
                      phone={row.phone}
                      selected={selected.indexOf(row.usernane) !== -1}
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
    </Container>
  );
}
