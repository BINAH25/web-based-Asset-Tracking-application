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
import { useLazyGetAllAssetsQuery,
    usePutAssetMutation,
    useLazyGetAllAvailableProductsQuery,
    useDeleteAssetMutation,
    useLazyGetUsersQuery } from '../../../features/resources/resources-api-slice';
import { useToast } from '@chakra-ui/react'
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CircularProgress from '@mui/material/CircularProgress';
import TableEmptyRows from '../../user/table-empty-rows';
import TableNoData from '../../user/table-no-data';
import UserTableHead from '../../user/user-table-head';
import AssetTableToolbar from '../asset-table-toolbar';
import AssetTableRow from '../asset-table-row';
import { emptyRows, applyFilter, getComparator } from '../utils';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Sort from '../sort';
import { fDate } from '../../../utils/format-time'
import Permissions from '../../../utils/permissions';
import { useDispatch, useSelector } from 'react-redux';

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
const style2 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };
export default function AssetPage() {
    const toast = useToast()

    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [open, setOpen] = useState(false);
    const [getAvailableProducts, { data: res = [],error: errorGettingTags }] = useLazyGetAllAvailableProductsQuery()
    const [availableProducts, setAvailableProducts] = useState([])
    const [product, setProduct] = useState('');
    const [getusers, { data: user_response = [] }] = useLazyGetUsersQuery()
    const [users, SetUsers] = useState([])
    const [user, SetUser] = useState('')

    const [filter, setFilter] = useState('')
    const [getAssets, { data: response = [],error: errorGettingAssets }] = useLazyGetAllAssetsQuery()
    const [addAsset,  { isLoading, error }] = usePutAssetMutation()
    const [assets, setAssets] = useState([])

    const [editOpen, setEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const userPermissions = useSelector((state) => new Set(state.authentication.userPermissions));
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteAsset,  { isLoading: loadingAsset, error: assetError }] = useDeleteAssetMutation()

    const handleEditOpen = (item) => {
        setSelectedItem(item);
        setEditOpen(true);
    };
      
    const handleEditClose = () => {
        setEditOpen(false);
        setSelectedItem(null);
    };

    const handleDeleteOpen = (item) => {
      setSelectedItem(item);
      setDeleteOpen(true);
    };
      
    const handleDeleteClose = () => {
      setDeleteOpen(false);
      setSelectedItem(null);
    }

    useEffect(() => {
        getAssets();
    }, [getAssets]);

    useEffect(() => {
        if (response && Array.isArray(response.success_message)) {
            setAssets(response.success_message);
        }
    }, [response]);


    useEffect(() => {
        getAvailableProducts();
    },  [getAvailableProducts]);

    useEffect(() => {
        if (res && Array.isArray(res.success_message)) {
            setAvailableProducts(res.success_message);
        }
    }, [res]);

    useEffect(() => {
        getusers();
    }, [getusers]);

    useEffect(() => {
        if (user_response && Array.isArray(user_response.success_message)) {
          SetUsers(user_response.success_message);
        }
    }, [user_response]);
      


  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = assets.map((n) => n.serial_number);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, serial_number) => {
    const selectedIndex = selected.indexOf(serial_number);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, serial_number);
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
    inputData: assets,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // delete Asset
  const handledeleteAsset = async (event) => {
    event.preventDefault()
    const body = { 
      id: selectedItem?.id
    }
    try {
      const response = await deleteAsset(body).unwrap()

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
      assets((prevAssets) => prevAssets.filter((asset) => asset.id !== selectedItem.id));
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
    if (assetError) {
      toast({
          position: 'top-center',
          title: `An error occurred: ${assetError.originalStatus}`,
          description: assetError.status,
          status: 'error',
          duration: 2000,
          isClosable: true,
      })
    }
  }, [assetError, toast])

  
  // ADD ASSET 
  const handleAddAsset = async (event) => {
    event.preventDefault()
    if (!product || !user ) {
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
        product: product,
        owner: user
    }

    try {
        const response = await addAsset(body).unwrap()

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
          description: "Asset Issued successfully",
          status: 'success',
          duration: 5000,
          isClosable: true,
      })
        setAssets((prevassets) => [response, ...prevassets]);
        // Remove the used product from the list
        setAvailableProducts((prevProducts) => 
            prevProducts.filter(prod => prod.id !== product)
          );
        SetUser('')
        setProduct('')
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
    if (errorGettingAssets) {
        toast({
            position: 'top-center',
            title: `An error occurred: ${errorGettingAssets.originalStatus}`,
            description: errorGettingAssets.status,
            status: 'error',
            duration: 2000,
            isClosable: true,
        })
    }
    }, [errorGettingAssets, toast])

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

    const handleProductChange = (event) => {
        setProduct(event.target.value);
    };

    const handleUserChange = (event) => {
        SetUser(event.target.value);
    };
    // filter by status
    const handleFilterChange = (event) => {
      setFilter(event.target.value);
    };

    // delete asset
  const renderDeleteForm = (
    <Box  sx={{ my: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={6} >
          <Typography variant="subtitle1">Product Name:</Typography>
          <Typography variant="body1" >{selectedItem?.product?.product_name || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={6} >
              <Typography variant="subtitle1">Product Serial Number:</Typography>
              <Typography variant="body1">{selectedItem?.product?.serial_number || 'N/A'}</Typography>
            </Grid>
        <Grid item xs={6} >
          <Typography variant="subtitle1">Product Tag ID:</Typography>
          <Typography variant="body1" >{selectedItem?.product?.tag?.tag_id || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={6} >
          <Typography variant="subtitle1">Tag Name:</Typography>
          <Typography variant="body1" >{selectedItem?.product?.tag?.tag_name  || 'N/A'}</Typography>
        </Grid>
      </Grid>
    
      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="error"
        onClick={handledeleteAsset}
        disabled={loadingAsset}
        sx={{ my: 2 }}
      >
        {loadingAsset && <CircularProgress size={30}/>}
        Delete Asset
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

    // detail form
    const renderEditForm = (
        <Box sx={{ my: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={4} >
              <Typography variant="subtitle1">Tag ID:</Typography>
              <Typography variant="body1">{selectedItem?.product?.tag?.tag_id || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={4} >
              <Typography variant="subtitle1">Tag Name:</Typography>
              <Typography variant="body1">{selectedItem?.product?.tag?.tag_name || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={4} >
              <Typography variant="subtitle1">Product Name:</Typography>
              <Typography variant="body1">{selectedItem?.product?.product_name || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={4} >
              <Typography variant="subtitle1">Product Serial Number:</Typography>
              <Typography variant="body1">{selectedItem?.product?.serial_number || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={4} >
              <Typography variant="subtitle1">Product Procurement Date:</Typography>
              <Typography variant="body1">{fDate(selectedItem?.product?.procurement_date) || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={4} >
              <Typography variant="subtitle1"> Product Status:</Typography>
              <Typography variant="body1">{selectedItem?.status || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={4} >
              <Typography variant="subtitle1">Owner:</Typography>
              <Typography variant="body1">{selectedItem?.owner?.institution?.institution_name || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={4} >
              <Typography variant="subtitle1">Owner Location:</Typography>
              <Typography variant="body1">{selectedItem?.owner?.institution?.location || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={4} >
              <Typography variant="subtitle1">Owner Phone Number:</Typography>
              <Typography variant="body1">{selectedItem?.owner?.institution?.phone || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={4} >
              <Typography variant="subtitle1">Owner Phone Email:</Typography>
              <Typography variant="body1">{selectedItem?.owner?.institution?.email || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={4} >
              <Typography variant="subtitle1">Owner  Username:</Typography>
              <Typography variant="body1">{selectedItem?.owner?.institution?.username || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={4} >
              <Typography variant="subtitle1">Owner Institution Type :</Typography>
              <Typography variant="body1">{selectedItem?.owner?.institution?.institution_type || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={4} >
              <Typography variant="subtitle1">Creation Date:</Typography>
              <Typography variant="body1">{fDate(selectedItem?.created_at) || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={4} >
              <Typography variant="subtitle1">Created By:</Typography>
              <Typography variant="body1">{selectedItem?.created_by?.username || 'N/A'}</Typography>
            </Grid>
          </Grid>
          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="inherit"
            onClick={handleEditClose}
            sx={{ mt: 3 }}
          >
            Cancel 
          </Button>
        </Box>
    );
      
//
  const renderForm = (
    <>
      <Stack spacing={3} sx={{ my: 2 }}>
        <FormControl fullWidth required>
          <InputLabel id="product-label"> Select Product </InputLabel>
          <Select
            labelId="product-label"
            id="Product"
            label="Product"
            value={product}
            onChange={handleProductChange}

          >
           {availableProducts.map((product) => (
          <MenuItem key={product.id} value={product.id}>
            {`${product.product_name} (${product.serial_number})`}
          </MenuItem>
        ))}
          </Select>
        </FormControl>

        <FormControl fullWidth required>
          <InputLabel id="user-label"> Select User </InputLabel>
          <Select
            labelId="user-label"
            id="user"
            label="user"
            value={user}
            onChange={handleUserChange}

          >
           {users.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {`${user.institution?.institution_name} (${user.username})`}
          </MenuItem>
        ))}
          </Select>
        </FormControl>


      </Stack>

      <Button 
      fullWidth size="large" 
      type="submit" 
      variant="contained" 
      color="inherit"
      disabled={isLoading}
      onClick={handleAddAsset}
      >
        {isLoading && <CircularProgress size={30}/>}
        Submit
      </Button>
    </>
  );

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Assets</Typography>
        {userPermissions.has(Permissions.ADD_ASSET)?
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpen}>
            Issue Asset
          </Button>
          :""
        }
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
                Give Out Asset Form
            </Typography>
            </Stack>
            {renderForm}
          </Box>
        </Modal>
      </Stack>

      <Card>
        <Stack  direction="row" alignItems="center" justifyContent="space-between">
        <AssetTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />
        <Sort
          options={[
            { value: 'all', label: 'all' },
            { value: 'Functional', label: 'functional' },
            { value: 'Maintenance', label: 'maintenance' },
            { value: 'Spoilt', label: 'spoilt' },
          ]}
          onFilter={handleFilterChange}
          filter={filter}
        />
        </Stack>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={assets.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'tag_name', label: 'Tag Name' },
                  { id: 'product_name', label: 'Product Name ' },
                  { id: 'owner', label: 'owner ' },
                  { id: 'status', label: 'Status  ' },
                  { id: 'created_at', label: 'Creation Date ' },
                  { id: 'created_by', label: 'Created by' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <AssetTableRow
                      key={row.id}
                      tag_name={row.product?.tag?.tag_name}
                      product_name={row.product?.product_name}
                      owner={row.owner?.institution?.institution_name}
                      status={row.status}
                      created_at={fDate(row.created_at)}
                      created_by={row.created_by?.username}
                      selected={selected.indexOf(row.serial_number) !== -1}
                      handleClick={(event) => handleClick(event, row.serial_number)}
                      onEditClick={() => handleEditOpen(row)} 
                      onDeleteClick={() => handleDeleteOpen(row)} 
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, assets.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={assets.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      <Modal
      open={editOpen}
      onClose={handleEditClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style2}>
        <Stack alignItems="center">
          <Typography variant="h4" sx={{ my: 1 }}>
            Asset Information
          </Typography>
        </Stack>
        {renderEditForm}
      </Box>
    </Modal>
    {/* DELETE ASSET MODAL  */}
    <Modal
      open={deleteOpen}
      onClose={handleDeleteClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box  sx={style}>
        <Stack >
          <Typography variant="h4" sx={{ my: 1, textAlign: 'center' }}>
            Are you sure you  want to delete this asset?
          </Typography>
        </Stack>
        {renderDeleteForm}
      </Box>
    </Modal>
    </Container>
  );
}
