import { Helmet } from 'react-helmet-async';
import {ChangePasswordView} from '../sections/changeDefaultPassword';

// ----------------------------------------------------------------------

export default function ChangePasswordPage() {
  return (
    <>
      <Helmet>
        <title> ChangePassword | Login </title>
      </Helmet>

      <ChangePasswordView />
    </>
  );
}
