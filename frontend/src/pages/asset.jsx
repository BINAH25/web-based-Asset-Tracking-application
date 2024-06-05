import { Helmet } from 'react-helmet-async';
import { AssetView } from '../sections/asset/view';
// ----------------------------------------------------------------------

export default function InstititionPage() {
  return (
    <>
      <Helmet>
        <title> Asset | Assets </title>
      </Helmet>

      <AssetView />
    </>
  );
}
