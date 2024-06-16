import { Helmet } from 'react-helmet-async';
import { AssetLogView } from '../sections/assetLog/view';
// ----------------------------------------------------------------------

export default function AssetLogPage() {
  return (
    <>
      <Helmet>
        <title>  Assets Logs </title>
      </Helmet>

      <AssetLogView />
    </>
  );
}
