import { Helmet } from 'react-helmet-async';
import { UnauthoriedView } from '../sections/error';
// ----------------------------------------------------------------------

export default function UnauthoriedPage() {
  return (
    <>
      <Helmet>
        <title> 401 Unauthoried Access </title>
      </Helmet>

      <UnauthoriedView />
    </>
  );
}
