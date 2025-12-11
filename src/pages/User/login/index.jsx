import PageLoading from '@/components/PageLoading';
import { GLOBAL_NAME_SPACE } from '@/models/constants';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const Login = (props) => {
  const { userLogin = {}, submitting, redirect } = props;
  const { status, type: loginType } = userLogin;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (values) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, username: values.username.trim(), redirect },
    });
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required!';
    }
    if (!password) {
      newErrors.password = 'Password is required!';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleSubmit({ 
        username: username.toLowerCase(), 
        password, 
        rememberMe 
      });
    }
  };

  useEffect(() => {
    if (redirect !== '/get-apple-link') {
      const accessToken = sessionStorage.getItem('access_token');
      const userRole = sessionStorage.getItem('role');
      if (accessToken) {
        props.dispatch({
          type: 'login/login',
          payload: { access_token: accessToken, role: userRole, redirect },
        });
      }
    }
    if (redirect === '/get-apple-link') {
      window.location.href = '/get-apple-link';
    }
  }, []);

  if (sessionStorage.getItem('access_token')) {
    return <PageLoading />;
  }

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Sign In to continue</h1>
      
      <form onSubmit={validateAndSubmit} className={styles.form}>
        {status === 'error' &&
          loginType === 'account' &&
          !submitting && (
            <div className={styles.errorMessage}>
              Incorrect username/password
            </div>
          )}
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <span className={styles.required}>*</span>Email
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="E-mail Address"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && (
            <span className={styles.fieldError}>{errors.username}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <span className={styles.required}>*</span>Password
          </label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              className={styles.input}
              placeholder="Enter your password here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span 
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </span>
          </div>
          {errors.password && (
            <span className={styles.fieldError}>{errors.password}</span>
          )}
        </div>

        <div className={styles.rememberRow}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.customCheckbox}></span>
            <span className={styles.checkboxText}>Remember me</span>
          </label>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={submitting}
        >
          {submitting ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default connect(({ [GLOBAL_NAME_SPACE]: { redirect }, login, loading }) => ({
  userLogin: login,
  redirect,
  submitting: loading.effects['login/login'],
}))(Login);
