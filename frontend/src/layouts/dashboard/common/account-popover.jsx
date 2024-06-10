import { useState, useEffect } from 'react';

import { jwtDecode } from "jwt-decode";
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import { useRouter } from '../../../routes/hooks';
import { account } from '../../../_mock/account';
import { logOutLocally } from '../../../features/authentication/authentication';
import { useLogOutUserMutation } from '../../../features/resources/resources-api-slice';

// ----------------------------------------------------------------------



export default function AccountPopover() {
  const toast = useToast()
  const router = useRouter();
  const [open, setOpen] = useState(null);
  const user = useSelector((state) => state.authentication.user);
  const dispatch = useDispatch()
  const [logoutUserServerSide, { isLoading, error }] = useLogOutUserMutation()
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };
  const refresh = localStorage.getItem('refresh')

  const token = localStorage.getItem('token')

  window.addEventListener('storage', (event) => {
    console.log('Storage changed:', event);
  });
  console.log('Token set:', localStorage.getItem('token'));

  console.log('Refresh set:', localStorage.getItem('refresh'));

  console.log('User set:', localStorage.getItem('user'));

  console.log('Permissions set:', localStorage.getItem('user_permissions'));

  const handleClose = () => {
    setOpen(null);
  };

//   // log out the user when the token expired
  function checkTokenExpiration() {
    if (!token) {
      dispatch(logOutLocally())
      router.push('/');
      return;
  }

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          toast({
            position: 'top-center',
            title: `An error occurred`,
            description: 'token expired logging out',
            status: 'error',
            duration: 5000,
            isClosable: true,
        })
          dispatch(logOutLocally())
          router.push('/');
        }
    } catch (error) {
        toast({
          position: 'top-center',
          title: `An error occurred`,
          description: error,
          status: 'error',
          duration: 2000,
          isClosable: true,
      })

    }

}


  async function logoutUser() {
    const body = { refresh: refresh}
    try {
      const response = await logoutUserServerSide(body).unwrap()
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
        description: response['success_message'],
        status: 'success',
        duration: 5000,
        isClosable: true,
    })
      dispatch(logOutLocally())
      router.push('/');
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


  // Logout error
  useEffect(() => {
    if (Boolean(error) && !isLoading) {
      toast({
        position: 'top-center',
        title: `An error occurred`,
        description: `${error?.originalStatus}: ${error?.status}`,
        status: 'error',
        duration: 2000,
        isClosable: true,
       })
   }
  }, [error, isLoading])
  
  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={account.photoURL}
          alt={account.displayName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {account.displayName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.username}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>


       
        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
          onClick={logoutUser}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
