import { Helmet } from 'react-helmet-async';
import { LoadingView } from '../sections/loading';
// ----------------------------------------------------------------------

export default function LoadingPage() {
  return (
    <>
      <Helmet>
        <title> Loading Page</title>
      </Helmet>

      <LoadingView />
    </>
  );
}
