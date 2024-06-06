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
import { useLazyGetAllProductsQuery,
  usePutProductMutation,
  useDeleteProductsMutation,
  useLazyGetAllTagsQuery } from '../../../features/resources/resources-api-slice';
import { useToast } from '@chakra-ui/react'
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CircularProgress from '@mui/material/CircularProgress';
import TableEmptyRows from '../../user/table-empty-rows';
import TableNoData from '../../user/table-no-data';
import UserTableHead from '../../user/user-table-head';
import ProductTableToolbar from '../product-table-toolbar';
import ProductTableRow from '../product-table-row';
import { emptyRows, applyFilter, getComparator } from '../utils';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { fDate, fDateTime,fTimestamp } from '../../../utils/format-time'
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
export default function ProductPage() {
    const toast = useToast()

    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [open, setOpen] = useState(false);
    const [serialNumber, setSerialNumber] = useState('');
    const [productName, setProductName] = useState('');
    const [getTags, { data: res = [],error: errorGettingTags }] = useLazyGetAllTagsQuery()
    const [tags, setTags] = useState([])
    const [tag, setTag] = useState('');

    const [getProducts, { data: response = [],error: errorGettingProducts }] = useLazyGetAllProductsQuery()
    const [addProduct,  { isLoading, error }] = usePutProductMutation()
    const [deleteProduct,  { isLoading: productLoading, error: productError }] = useDeleteProductsMutation()
    const [products, setProducts] = useState([])
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
      getProducts();
  }, [getProducts]);

  useEffect(() => {
      if (response && Array.isArray(response.success_message)) {
        setProducts(response.success_message);
      }
  }, [response]);


  useEffect(() => {
    getTags();
  }, [getTags]);

  useEffect(() => {
    if (res && Array.isArray(res.success_message)) {
        setTags(res.success_message);
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
      const newSelecteds = products.map((n) => n.serial_number);
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
    inputData: products,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  // delete product
  const handleDeleteProduct = async (event) => {
    event.preventDefault()
    const body = { 
      id: selectedItem?.id
    }
    try {
      const response = await deleteProduct(body).unwrap()

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
      setProducts((prevTags) => prevTags.filter((product) => product.id !== selectedItem.id));
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
    if (productError) {
      toast({
          position: 'top-center',
          title: `An error occurred: ${productError.originalStatus}`,
          description: productError.status,
          status: 'error',
          duration: 2000,
          isClosable: true,
      })
    }
  }, [productError, toast])

  // ADD PRODUCT
  const handleAddProdduct = async (event) => {
    event.preventDefault()
    if (!tag || !serialNumber || !productName) {
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
      tag: tag, 
      serial_number: serialNumber,
      product_name:productName
    }

    try {
        const response = await addProduct(body).unwrap()

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
          description: "Product added successfully",
          status: 'success',
          duration: 5000,
          isClosable: true,
      })
        setProducts((prevproducts) => [response, ...prevproducts]);
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
    if (errorGettingProducts) {
        toast({
            position: 'top-center',
            title: `An error occurred: ${errorGettingProducts.originalStatus}`,
            description: errorGettingProducts.status,
            status: 'error',
            duration: 2000,
            isClosable: true,
        })
    }
}, [errorGettingProducts, toast])

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

const handleTagChange = (event) => {
  setTag(event.target.value);
};

  // DELETE PRODUCT
  const renderDeleteForm = (
    <Box  sx={{ my: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={4} >
          <Typography variant="subtitle1">Product Tag:</Typography>
          <Typography variant="body1" >{selectedItem?.tag?.tag_name || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={4} >
          <Typography variant="subtitle1">Product Serial Number:</Typography>
          <Typography variant="body1" >{selectedItem?.serial_number || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={4} >
          <Typography variant="subtitle1">Product  Name:</Typography>
          <Typography variant="body1" >{selectedItem?.product_name || 'N/A'}</Typography>
        </Grid>
      </Grid>
    
      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="error"
        sx={{ my: 2 }}
        disabled={productLoading}
        onClick={handleDeleteProduct}
      >
        Delete Product
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

  // ADD PRODUCT FORM 
  const renderForm = (
    <>
      <Stack spacing={3} sx={{ my: 2 }}>
        <FormControl fullWidth required>
          <InputLabel id="tag-label"> Select Tag </InputLabel>
          <Select
            labelId="Tag-label"
            id="Tag"
            label="Tag"
            value={tag}
            onChange={handleTagChange}

          >
           {tags.map((tag) => (
          <MenuItem key={tag.id} value={tag.id}>
            {`${tag.tag_name} (${tag.tag_id})`}
          </MenuItem>
        ))}
          </Select>
        </FormControl>

        <TextField 
        name="serial Number" 
        label="Serial Number"
        onChange={(e) => setSerialNumber(e.target.value)}
        required />

        <TextField
        name="product_name"
        label="Product Name"
        onChange={(e) => setProductName(e.target.value)}
        required />

      </Stack>

      <Button 
      fullWidth size="large" 
      type="submit" 
      variant="contained" 
      color="inherit"
      disabled={isLoading}
      onClick={handleAddProdduct}
      >
        {isLoading && <CircularProgress size={30}/>}
        Add Product
      </Button>
    </>
  );

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Products</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpen}>
          New Product
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
                Add Product Form
            </Typography>
            </Stack>
            {renderForm}
          </Box>
        </Modal>
      </Stack>

      <Card>
        <ProductTableToolbar
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
                rowCount={products.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'tag', label: 'Tag ID' },
                  { id: 'tag_name', label: 'Tag Name' },
                  { id: 'serial_number', label: 'Serial Number' },
                  { id: 'product_name', label: 'Product Name ' },
                  { id: 'availability', label: 'Availability ' },
                  { id: 'procurement_date', label: 'Procurement Date ' },
                  { id: 'created_by', label: 'Created by' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <ProductTableRow
                      key={row.id}
                      tag={row.tag?.tag_id}
                      tag_name={row.tag?.tag_name}
                      serial_number={row.serial_number}
                      product_name={row.product_name}
                      availability={row.availability}
                      procurement_date={fDate(row.procurement_date)}
                      created_by={row.created_by?.username}
                      selected={selected.indexOf(row.serial_number) !== -1}
                      handleClick={(event) => handleClick(event, row.serial_number)}
                      onDeleteClick={() => handleDeleteOpen(row)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, products.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={products.length}
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
            Are you sure you want to delete this product?
          </Typography>
        </Stack>
          {renderDeleteForm}
      </Box>
    </Modal>
    </Container>
  );
}
