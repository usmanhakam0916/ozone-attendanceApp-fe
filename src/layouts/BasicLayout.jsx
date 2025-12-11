/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 */
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Result, Row } from 'antd';
import { useMemo, useRef } from 'react';
import { connect, history, Link } from 'umi';

import { adminRoutes, managerRoutes, supervisorRoutes } from '../../config/routes';

import RightContent from '@/components/GlobalHeader/RightContent';
import Authorized from '@/utils/Authorized';
import ProLayout from '@ant-design/pro-layout';
import { getMatchMenu } from '@umijs/route-utils';
import logoIcon from '../../public/lg.svg';
import logo from '../../public/logo.svg';
import styles from './BasicLayout.less';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

const menuDataRender = (userRole, menuList) => {
  return menuList.map((item) => {
    if (userRole === 'admin' && adminRoutes.includes(item.path)) {
      const localItem = {
        ...item,
        children: item.children ? menuDataRender(item.children) : undefined,
      };
      return Authorized.check(item.authority, localItem, null);
    }
    if (userRole === 'supervisor' && supervisorRoutes.includes(item.path)) {
      const localItem = {
        ...item,
        children: item.children ? menuDataRender(item.children) : undefined,
      };
      return Authorized.check(item.authority, localItem, null);
    }
    if (
      (userRole === 'manager' || userRole === 'hr-manager') &&
      managerRoutes.includes(item.path)
    ) {
      const localItem = {
        ...item,
        children: item.children ? menuDataRender(item.children) : undefined,
      };
      return Authorized.check(item.authority, localItem, null);
    }
    return '';
  });
};

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    settings,
    userRole,
    collapsed,
    location = {
      pathname: '/',
    },
  } = props;
  const menuDataRef = useRef([]);

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );

  const mainLogo = () => {
    return (
      <Row className={styles.logoRow}>
        <img 
          src={collapsed ? logoIcon : logo} 
          alt="logo" 
          className={collapsed ? styles.logoCollapsed : styles.logo} 
        />
      </Row>
    );
  };

  // Custom header content with collapse button - positioned in header, not sidebar
  const headerContentRender = () => {
    return (
      <div className={styles.headerContent}>
        <span 
          className={styles.collapseButton}
          onClick={() => handleMenuCollapse(!collapsed)}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </span>
      </div>
    );
  };

  return (
    <ProLayout
      logo={mainLogo}
      {...props}
      pure={
        !!location.pathname.includes('locationPrint') || location.pathname.includes('deleteAccount')
      }
      {...settings}
      collapsed={collapsed}
      onCollapse={handleMenuCollapse}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (
          menuItemProps.isUrl ||
          !menuItemProps.path ||
          location.pathname === menuItemProps.path
        ) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: 'Home',
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      menuDataRender={(menuList) => menuDataRender(userRole, menuList)}
      headerContentRender={headerContentRender}
      rightContentRender={() => <RightContent />}
      postMenuData={(menuData) => {
        menuDataRef.current = menuData || [];
        return menuData || [];
      }}
      headerTheme="dark"
      navTheme="dark"
      siderWidth={255}
      collapsedWidth={80}
    >
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  userRole: global.auth.role,
  settings,
}))(BasicLayout);
