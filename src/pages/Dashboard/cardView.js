/* eslint-disable no-nested-ternary */
import React from 'react';
import { Card, Typography } from 'antd';

import {
  AppleOutlined,
  AndroidOutlined,
  LoginOutlined,
  QrcodeOutlined,
  UserOutlined,
  AliwangwangOutlined,
} from '@ant-design/icons';
import styles from './Dashboard.less';

const { Text } = Typography;

function EmailCount({ type, record, onClick = null }) {
  return (
    <Card onClick={onClick} md={true} bodyStyle={{ textAlign: 'center' }}>
      <div>
        {type === 'iphone' ? (
          <AppleOutlined id={styles.iphone_icon} className="card" />
        ) : type === 'android' ? (
          <AndroidOutlined id={styles.android_icon} className="card" />
        ) : type === 'checkin' ? (
          <LoginOutlined id={styles.checkin_icon} />
        ) : type === 'check-out' ? (
          <LoginOutlined id={styles.checkout_icon} />
        ) : type === 'qrcode-in' ? (
          <QrcodeOutlined id={styles.qrcode_in_icon} />
        ) : type === 'qrcode-out' ? (
          <QrcodeOutlined id={styles.qrcode_out_icon} />
        ) : type === 'face-in' ? (
          <AliwangwangOutlined id={styles.face_in_icon} />
        ) : type === 'face-out' ? (
          <AliwangwangOutlined id={styles.face_out_icon} />
        ) : type === 'admin-in' ? (
          <UserOutlined id={styles.admin_in_icon} />
        ) : (
          <UserOutlined id={styles.admin_out_icon} />
        )}
      </div>
      <div>
        <Text id={styles.count_text}>{record}</Text>
      </div>
      <div style={{ display: 'inline-block' }}>
        <Text type="secondary">
          {type === 'iphone'
            ? 'Total Iphone Users'
            : type === 'android'
            ? 'Total Android Users'
            : type === 'checkin'
            ? "Total Check'ins"
            : type === 'check-out'
            ? 'Total Checkouts'
            : type === 'qrcode-in'
            ? "Total QRCode Check'ins"
            : type === 'qrcode-out'
            ? 'Total QRCode Checkouts'
            : type === 'face-in'
            ? "Total Face Check'ins"
            : type === 'face-out'
            ? 'Total Face Checkouts'
            : type === 'admin-in'
            ? "Total Admin Check'ins"
            : 'Total Admin Checkouts'}
        </Text>
        <br />
      </div>
    </Card>
  );
}

export default EmailCount;
