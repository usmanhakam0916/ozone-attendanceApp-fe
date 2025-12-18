export const adminRoutes = [
  '/dashboard',
  '/admins',
  '/employee',
  '/employee/:id',
  '/location',
  '/locationPrint',
  '/attendance',
  '/getLocation',
  '/groupPolicy',
  '/groupPolicy/:id',
  '/department',
  '/differentDeviceAttendance',
  '/deviceIdTracking',
];

export const supervisorRoutes = [
  '/dashboard',
  '/employee',
  '/employee/:id',
  '/location',
  '/attendance',
  '/getLocation',
  '/groupPolicy',
  '/groupPolicy/:id',
  '/department',
];

export const managerRoutes = [
  '/dashboard',
  '/employee',
  '/employee/:id',
  '/location',
  '/attendance',
  '/getLocation',
  '/department',
];

export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        name: 'PrivacyPolicy',
        path: '/privacyPolicy',
        component: './PrivacyPolicy',
      },
      {
        name: 'GetAppleLink',
        path: '/get-apple-link',
        component: './GetLink',
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user', 'public'],
            routes: [
              {
                path: '/',
                redirect: '/employee',
              },
              {
                path: '/admin',
                name: 'admin',
                icon: 'crown',
                component: './Admin',
                authority: ['admin'],
                routes: [
                  {
                    path: '/admin/sub-page',
                    name: 'sub-page',
                    icon: 'smile',
                    component: './Welcome',
                    authority: ['admin'],
                  },
                ],
              },
              {
                name: 'Dashboard',
                path: '/dashboard',
                icon: 'appstore',
                component: './Dashboard',
              },
              {
                name: 'Admin',
                path: 'admins',
                icon: 'user',
                component: './AdminList',
              },
              {
                name: 'Employee',
                path: '/employee',
                icon: 'team',
                component: './Employee',
              },
              {
                hideInMenu: true,
                path: '/employee/:id',
                name: 'Update Employee',
                component: './Employee/EmployeeProfile',
              },
              {
                name: 'Location',
                path: 'location',
                icon: 'environment',
                component: './Location',
              },
              {
                hideInMenu: true,
                name: 'LocationPrint',
                path: 'locationPrint',
                component: './Location/locationPrint',
              },
              {
                name: 'Time Sheet',
                path: 'attendance',
                icon: 'clock-circle',
                component: './Attendance',
              },
              {
                hideInMenu: true,
                name: 'Location',
                path: '/getLocation',
                component: './GetLocation',
              },
              {
                name: 'Department',
                path: 'department',
                icon: 'apartment',
                component: './Department',
              },
              {
                name: 'Group Policy',
                path: '/groupPolicy',
                icon: 'solution',
                component: './GroupPolicy',
              },
              {
                hideInMenu: true,
                name: 'Add Employees',
                path: '/groupPolicy/:id',
                component: './GroupPolicy/GroupPolicyForms/GroupPolicyEmployees/',
              },
              {
                name: 'Device Attendance',
                path: 'differentDeviceAttendance',
                icon: 'mobile',
                component: './DifferentDeviceAttendance',
              },
              {
                name: 'Device Tracking',
                path: 'deviceIdTracking',
                icon: 'radar-chart',
                component: './RemovedDeviceTracking',
              },
              {
                hideInMenu: true,
                path: '/deleteAccount',
                name: 'Delete Account',
                component: `./User/login/deleteAccount`,
                authority: ['employee'],
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
