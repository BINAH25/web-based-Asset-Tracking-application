import SvgColor from '../../components/svg-color';
import Permissions from '../../utils/permissions';
// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
    permission:`${Permissions.VIEW_DASHBOARD}`
  },
  {
    title: 'asset',
    path: '/asset',
    icon: icon('ic_cart'),
  },
  {
    title: 'institution',
    path: '/institution',
    icon: icon('ic_user'),
    permission:`${Permissions.VIEW_INSTITUTION}`
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
    permission: `${Permissions.ADD_USER}`
  },
  {
    title: 'tag',
    path: '/tag',
    icon: icon('ic_blog'),
    permission: `${Permissions.ADD_TAG}`
  },
  {
    title: 'product',
    path: '/products',
    icon: icon('ic_cart'),
    permission: `${Permissions.MANAGE_PRODUCT}`
  },
  {
    title: 'asset logs',
    path: '/asset/logs',
    icon: icon('ic_lock'),
    permission: `${Permissions.VIEW_ACTIVITITY_LOG}`
  },
  {
    title: 'activity logs',
    path: '/activity/logs',
    icon: icon('ic_lock'),
    permission: `${Permissions.VIEW_ACTIVITITY_LOG}`
  },
  
];

export default navConfig;
