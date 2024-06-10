import { useState } from 'react';
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useVerifyUserMutation, setUser as setStoreUser, setToken, setUserPermissions } from '../../features/authentication/authentication';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';
import { useToast } from '@chakra-ui/react'
import { useRouter } from '../../routes/hooks';

import { bgGradient } from '../../theme/css';

import Logo from '../../components/logo';

// ----------------------------------------------------------------------

export default function OtpView() {
  const theme = useTheme();
  const toast = useToast()

  const router = useRouter();

  const [verifyUser, { isLoading }] = useVerifyUserMutation()
  const [otp, setOpt] = useState('')

  const loggedInUser = useSelector((state) => state.authentication.user);
  const [user, setUser] = useState(loggedInUser)
  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!otp) {
      toast({
        position: 'top-center',
        title: 'Missing Field',
        description: 'otp is required',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return; // Stop the function from proceeding
    }
    const body = { otp: otp };
    try {
      const response = await verifyUser(body).unwrap();
      if (response['error_message'] != null) {
        toast({
          position: 'top-center',
          title: `An error occurred`,
          description: response['error_message'],
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          position: 'top-center',
          title: 'Login successful',
          description: 'You have successfully logged in',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        localStorage.setItem('token', response['token']);
  
        localStorage.setItem('refresh', response['refresh']);
  
        localStorage.setItem('user', JSON.stringify(response['user']));
  
        localStorage.setItem('user_permissions', JSON.stringify(response['user_permissions']));
  
        dispatch(setStoreUser(response['user']));
        dispatch(setToken(response['token'])); // Corrected dispatch
        dispatch(setUserPermissions(response['user_permissions']));
        setUser(response['user']);
      }
    } catch (err) {
      toast({
        position: 'top-center',
        title: `An error occurred`,
        description: err.originalStatus,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };
  

  const renderForm = (
    <>
      <Stack spacing={3} sx={{ my: 3 }}>
        <TextField 
        name="opt" 
        label="otp"
        onChange={(e) => setOpt(e.target.value)}
        required
         />
        
      </Stack>

    
      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading && <CircularProgress size={30}/>}
        Verify
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
                Enter the OTP sent to your email
              </Typography>
            </Stack>
            {renderForm}
          </Card>
        </Stack>
      </Box>
    </>
  );
}
