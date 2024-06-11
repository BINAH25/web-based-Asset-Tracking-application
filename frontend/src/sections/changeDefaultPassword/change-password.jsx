import { useState } from 'react';
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useChangeOwnPasswordMutation } from '../../features/resources/resources-api-slice';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { useToast } from '@chakra-ui/react'
import { useRouter } from '../../routes/hooks';

import { bgGradient } from '../../theme/css';

import Logo from '../../components/logo';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

export default function ChangePasswordView() {
  const theme = useTheme();
  const router = useRouter()
  const toast = useToast()
  const user = useSelector((state) => state.authentication.user);
  const [showPassword, setShowPassword] = useState(false);
  const [changePassowrd, { isLoading }] = useChangeOwnPasswordMutation()
  const [oldPassword, setOldPassword] = useState()
  const [newPassword, setNewPassword] = useState()
  const dispatch = useDispatch();


  const handlechangePassowrd = async (event) => {
    event.preventDefault()
    if (!newPassword || !oldPassword) {
      toast({
        position: 'top-center',
        title: 'Missing Fields',
        description: 'Username and password are required',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return; 
    }
    const body = { old_password: oldPassword, new_password: newPassword }
    try {
      const response = await changePassowrd(body).unwrap()
      if (response['error_message'] != null) {
        toast({
            position: 'top-center',
            title: `An error occurred`,
            description: response['error_message'],
            status: 'error',
            duration: 5000,
            isClosable: true,
        })
    } else {
      toast({
        position: 'top-center',
        title: 'Success',
        description: response['message'],
        status: 'success',
        duration: 10000,
        isClosable: true,
    })
        localStorage.setItem('token', response['token']);
  
        localStorage.setItem('refresh', response['refresh']);
  
        localStorage.setItem('user', JSON.stringify(response['user']));
  
        localStorage.setItem('user_permissions', JSON.stringify(response['user_permissions']));
  
        dispatch(setStoreUser(response['user']));
        dispatch(setToken(response['token'])); 
        dispatch(setUserPermissions(response['user_permissions']));
        setUser(response['user']);
        window.location = "/asset"
        window.location.reload()
        //router.push("/asset") 
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
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField
          name="old password"
          onChange={(e) => setOldPassword(e.target.value)}
          label="Old Password"
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
        <TextField
          name="new password"
          onChange={(e) => setNewPassword(e.target.value)}
          label="New Password"
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

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        
      </Stack>

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handlechangePassowrd}
        disabled={isLoading}
      >
        {isLoading && <CircularProgress size={30}/>}
        Change Password
      </Button>
    </>
  );

  return (
    <>
    {user && (
      <Navigate to="/asset" replace={true} />
    )}
      <Box
        sx={{
          ...bgGradient({
            color: alpha(theme.palette.background.default, 0.9),
            imgUrl: '/assets/background/overlay_4.jpg',
          }),
          height: 1,
        }}
        >
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, md: 24 },
            left: { xs: 16, md: 24 },
          }}
          />

        <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
          <Card
            sx={{
              p: 5,
              width: 1,
              maxWidth: 420,
            }}
            >
            <Stack alignItems="center">
              <Typography variant="h4" sx={{ my: 3 }}>
                You  are required to change your Password
              </Typography>
            </Stack>
            {renderForm}
          </Card>
        </Stack>
      </Box>
    </>
  );
}
