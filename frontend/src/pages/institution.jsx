import { Helmet } from 'react-helmet-async';
import { InstitutionView } from '../sections/institution/view';

// ----------------------------------------------------------------------

export default function InstititionPage() {
  return (
    <>
      <Helmet>
        <title> Instititions | Instititions</title>
      </Helmet>

      <InstitutionView />
    </>
  );
}
