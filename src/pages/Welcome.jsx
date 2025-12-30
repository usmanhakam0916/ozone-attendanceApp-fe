import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';
import { useIntl } from 'umi';

export default () => {
  const intl = useIntl();
  return (
    <PageContainer>
      <Card style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        Welcome to Ozone Clinic
      </Card>
    </PageContainer>
  );
};
