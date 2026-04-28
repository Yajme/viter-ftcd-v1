import { FaCogs } from "react-icons/fa";
import {
  FaNoteSticky,
  FaUsers,
  FaChildren,
  FaHandHoldingHeart,
  FaList,
} from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { devNavUrl, urlDeveloper } from "#functions/functions-general";
export const navList = [
  {
    label: "Donor List",
    icon: <FaHandHoldingHeart />,
    menu: "donorlist",
    path: ``,
  },
  {
    label: "Children List",
    icon: <FaChildren />,
    menu: "childrenlist",
    path: ``,
  },
  {
    label: "Reports",
    icon: <FaList />,
    menu: "reports",
    submenu: "",
    subNavList: [
      {
        label: "Donations",
        path: ``,
      },
      {
        label: "Contact Us",
        path: ``,
      },
      {
        label: "FAQ",
        path: ``,
      },
    ],
  },
  {
    label: "Settings",
    icon: <FaCogs />,
    menu: "settings",
    submenu: "",
    subNavList: [
      {
        label: "Users",
        path: `${devNavUrl}/${urlDeveloper}/settings/users`,
      },
      {
        label: "Category",
        path: `${devNavUrl}/${urlDeveloper}/settings/category`,
      },
      {
        label: "Designation",
        path: `${devNavUrl}/${urlDeveloper}/settings/designation`,
      },
      {
        label: "Notification",
        path: ``,
      },
      {
        label: "Maintenance",
        path: ``,
      },
    ],
  },
  // {
  //   label: "Dashboard",
  //   icon: <MdDashboard />,
  //   menu: "dashboard",
  //   submenu: "",
  //   path: `${devNavUrl}/${urlDeveloper}/dashboard`,
  // },
  // {
  //   label: "Employees",
  //   icon: <FaUsers />,
  //   menu: "employees",
  //   submenu: "",
  //   path: `${devNavUrl}/${urlDeveloper}/employees`,
  // },
  // {
  //   label: "Settings",
  //   icon: <FaCogs />,
  //   menu: "settings",
  //   submenu: "",
  //   subNavList: [
  //     {
  //       label: "Role",
  //       path: `${devNavUrl}/${urlDeveloper}/settings/roles`,
  //     },
  //     {
  //       label: "users",
  //       path: `${devNavUrl}/${urlDeveloper}/settings/users`,
  //     },
  //     {
  //       label: "department",
  //       path: `${devNavUrl}/${urlDeveloper}/settings/department`,
  //     },
  //     {
  //       label: "notifications",
  //       path: `${devNavUrl}/${urlDeveloper}/settings/notifications`,
  //     },
  //   ],
  // },
  // {
  //   label: "Memo",
  //   icon: <FaNoteSticky />,
  //   menu: "memo",
  //   submenu: "",
  //   path: `${devNavUrl}/${urlDeveloper}/memo`,
  // },
];
