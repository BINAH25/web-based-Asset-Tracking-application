import { Helmet } from 'react-helmet-async';
import { UserActivityView } from '../sections/activityLog/view';
// ----------------------------------------------------------------------

export default function UserActivityPage() {
  return (
    <>
      <Helmet>
        <title>  System Logs </title>
      </Helmet>

      <UserActivityView />
    </>
  );
}
