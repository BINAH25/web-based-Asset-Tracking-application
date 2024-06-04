import { Helmet } from 'react-helmet-async';
import { TagView } from '../sections/tag/view';
// ----------------------------------------------------------------------

export default function InstititionPage() {
  return (
    <>
      <Helmet>
        <title> Tag | Tags </title>
      </Helmet>

      <TagView />
    </>
  );
}
