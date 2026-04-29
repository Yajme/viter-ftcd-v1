import { devNavUrl, urlDeveloper } from "#functions/functions-general";
import Layout from "#pages/dev/layout";
import Category from "#pages/dev/settings/category/Category";
import Designation from "#pages/dev/settings/designation/Designation";
import Settings from "#pages/dev/settings/Settings";
import Roles from "#pages/dev/settings/users/role/Roles";
import SystemUsers from "#pages/dev/settings/users/system/System";
import Users from "#pages/dev/settings/users/Users";
import Notification from "#pages/dev/settings/notifications/Notifications";
import Donors from "#pages/dev/donors/Donors";
const BASE_URL = `${devNavUrl}/${urlDeveloper}`;
export const routesDeveloper = [
  {
    path: `${BASE_URL}/layout`,
    element: (
      <>
        <Layout />
      </>
    ),
  },
  {
    path: `${BASE_URL}/donors`,
    element: (
      <>
        <Donors />
      </>
    ),
  },
  {
    path: `${BASE_URL}/settings/category`,
    element: (
      <>
          <Category />
      </>
    ),
  },
  {
    path: `${BASE_URL}/settings/designation`,
    element: (
      <>
          <Designation />
      </>
    ),
  },
  {
    path: `${BASE_URL}/settings/notifications`,
    element: (
      <>
          <Notification />
      </>
    ),
  },
  {
    path: `${BASE_URL}/settings/users`,
    element: (
      <>
        <Settings menu="Users" submenu="">
          <Users />
        </Settings>
      </>
    ),
  },
  {
    path: `${BASE_URL}/settings/users/roles`,
    element: (
      <>
        <Settings menu="Users" submenu="Roles">
          <Roles />
        </Settings>
      </>
    ),
  },
  {
    path: `${BASE_URL}/settings/users/system`,
    element: (
      <>
        <Settings menu="Users" submenu="System">
        <SystemUsers
         />
        </Settings>
      </>
    ),
  },
];
