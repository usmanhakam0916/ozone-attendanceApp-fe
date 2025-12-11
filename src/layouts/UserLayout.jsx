import { DownOutlined } from '@ant-design/icons';
import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { connect } from 'umi';
import groupIllustration from '../../public/Group.svg';
import ozoneLogo from '../../public/ozone.svg';
import styles from './UserLayout.less';

const UserLayout = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    ...props,
  });

  const token = sessionStorage.getItem('access_token');

  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const languages = ['English', 'Arabic', 'Japanese', 'French'];

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setDropdownOpen(false);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <div className={!token ? styles.container : styles.loading}>
        {!token && (
          <>
            {/* Left Half - White Section */}
            <div className={styles.leftHalf}>
              <div className={styles.logoContainer}>
                <img src={ozoneLogo} alt="Ozone Logo" className={styles.logo} />
              </div>
              <div className={styles.formContainer}>
                {children}
              </div>
            </div>

            {/* Right Half - Gradient Section */}
            <div className={styles.rightHalf}>
              <div className={styles.languageDropdown}>
                <div 
                  className={styles.languageSelector}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span>{selectedLanguage}</span>
                  <DownOutlined className={styles.dropdownIcon} />
                </div>
                {dropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    {languages.map((lang) => (
                      <div
                        key={lang}
                        className={`${styles.dropdownItem} ${lang === selectedLanguage ? styles.selected : ''}`}
                        onClick={() => handleLanguageSelect(lang)}
                      >
                        {lang}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.illustrationContainer}>
                <img src={groupIllustration} alt="Illustration" className={styles.illustration} />
              </div>
            </div>
          </>
        )}
        {token && children}
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
