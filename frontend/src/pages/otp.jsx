import { Helmet } from 'react-helmet-async';
import { OtpView } from '../sections/otp';

// ----------------------------------------------------------------------

export default function OtpPage() {
  return (
    <>
      <Helmet>
        <title> Verify | OTP </title>
      </Helmet>

      <OtpView />
    </>
  );
}
