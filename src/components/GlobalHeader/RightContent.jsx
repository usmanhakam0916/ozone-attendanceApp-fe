import { BellOutlined, DownOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { useState } from 'react';
import { connect } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';

const GlobalHeaderRight = (props) => {
  const { theme, layout } = props;
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right} ${styles.dark}`;
  }

  const languageMenu = (
    <Menu 
      className={styles.languageMenu}
      onClick={({ key }) => setSelectedLanguage(key)}
    >
      <Menu.Item key="English">English</Menu.Item>
      <Menu.Item key="Arabic">Arabic</Menu.Item>
      <Menu.Item key="Japanese">Japanese</Menu.Item>
      <Menu.Item key="French">French</Menu.Item>
    </Menu>
  );

  return (
    <div className={className}>
      <div className={styles.headerActions}>
        <span className={styles.actionIcon}>
          <EyeOutlined />
        </span>
        
        <Dropdown overlay={languageMenu} trigger={['click']}>
          <span className={styles.languageSelector}>
            {selectedLanguage} <DownOutlined style={{ fontSize: 10 }} />
          </span>
        </Dropdown>
        
        <span className={styles.actionIcon}>
          <BellOutlined />
        </span>
        
        <Avatar />
        
        <span className={styles.actionIcon}>
          <SettingOutlined />
        </span>
      </div>
    </div>
  );
};

export default connect(({ settings }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
