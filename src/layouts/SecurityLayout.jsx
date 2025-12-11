import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect } from 'umi';
import { GLOBAL_NAME_SPACE } from '@/models/constants';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;

    if (dispatch) {
      // dispatch({
      //   type: 'user/fetchCurrent',
      // });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props; // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）

    const isLogin = currentUser && currentUser.userid;

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }

    let redirect = window.location.pathname;
    if (redirect === '/') {
      redirect = '/dashboard';
    } else if (redirect.includes('locationPrint')) {
      const params = new URL(window.location).searchParams;
      const location = params.get('location');
      const qrCode = params.get('qrcode');
      redirect = `${redirect}?location=${location}&qrcode=${qrCode}`;
    }

    this.props.dispatch({
      type: `${GLOBAL_NAME_SPACE}/setRedirect`,
      payload: redirect,
    });

    if (!isLogin && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login`} />;
    }

    return children;
  }
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
