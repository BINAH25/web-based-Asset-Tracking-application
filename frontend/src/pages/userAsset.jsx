import { Helmet } from 'react-helmet-async';
import { UserAssetView } from '../sections/userAsset/view';

// ----------------------------------------------------------------------

export default function UserAssetPage() {
  return (
    <>
      <Helmet>
        <title> user Asset | View </title>
      </Helmet>

      <UserAssetView />
    </>
  );
}
