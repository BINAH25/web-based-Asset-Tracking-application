import { useState } from 'react';
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useLoginUserMutation } from '../../features/authentication/authentication';
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

export default function LoginView() {
  const theme = useTheme();
  const toast = useToast()
  const user = useSelector((state) => state.authentication.user);
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, { isLoading }] = useLoginUserMutation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    if (!username || !password) {
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
    const body = { username: username, password: password }
    try {
      const response = await loginUser(body).unwrap()
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
        title: 'OTP Sent',
        description: response['message'],
        status: 'success',
        duration: 10000,
        isClosable: true,
    })
      router.push('/verify-otp');
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
        name="Username" 
        label="Username"
        onChange={(e) => setUsername(e.target.value)}
        required
         />

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

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
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
        Login
      </Button>
    </>
  );

  return (
    <>
    {user && (
      <Navigate to="/dashboard" replace={true} />
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
                Welcome Sign In
              </Typography>
            </Stack>
            {renderForm}
          </Card>
        </Stack>
      </Box>
    </>
  );
}
