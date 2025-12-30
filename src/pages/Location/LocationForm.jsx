import { connect } from 'dva';
import { history } from 'umi';
import React, { useEffect } from 'react';
import { Button, Form, Input, Row, InputNumber } from 'antd';

import { NAME_SPACE } from './constants';
import styles from './BankListing.less';
import { GLOBAL_NAME_SPACE } from '@/models/constants';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 22,
  },
};

const LocationForm = (props) => {
  const { dispatch, locations, handleCancel, bankId } = props;
  const [bankForm] = Form.useForm();

  useEffect(() => {
    if (bankId) {
      const location = locations.find((item) => item.id === bankId);
      bankForm.setFieldsValue(location);
    } else {
      bankForm.resetFields();
    }
  }, [bankForm, locations, bankId]);

  const handleSubmit = (values) => {
    if (bankId) {
      // eslint-disable-next-line radix
      const finalValues = { ...values, lat: parseFloat(values.lat), long: parseFloat(values.long) };
      dispatch({
        type: `${NAME_SPACE}/updateBank`,
        payload: {
          data: finalValues,
          id: bankId,
        },
      });
    } else {
      dispatch({
        type: `${NAME_SPACE}/createBank`,
        payload: {
          data: values,
        },
      });
    }
  };

  return (
    <Form
      form={bankForm}
      {...layout}
      name="adminForm"
      onFinish={handleSubmit}
      initialValues={{ active: false }}
    >
      <Form.Item
        className={styles.inputTitle}
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            type: 'string',
            message: 'Please enter location name!',
          },
        ]}
      >
        <Input placeholder="Name" autoComplete="off" />
      </Form.Item>
      <Form.Item
        className={styles.inputTitle}
        label="Latitude"
        name="lat"
        rules={[
          {
            required: true,
            message: 'Please enter latitude!',
          },
        ]}
      >
        <InputNumber placeholder="Latitude" autoComplete="off" />
      </Form.Item>
      <Form.Item
        className={styles.inputTitle}
        label="Longitude"
        name="long"
        rules={[
          {
            required: true,
            message: 'Please enter longitude!',
          },
        ]}
      >
        <InputNumber placeholder="Longitude" autoComplete="off" />
      </Form.Item>
      <Form.Item
        className={styles.inputTitle}
        label="QR Code"
        name="qrCode"
        rules={[
          {
            required: true,
            message: 'Please enter QR Code',
          },
        ]}
      >
        <Input placeholder="QR Code" autoComplete="off" />
      </Form.Item>
      {/* <Button
        type="primary"
        onClick={() => {
          history.push('/getLocation');
        }}
      >
        get location
      </Button> */}
      <div className={styles.modalButtons}>
        <Row>
          <Form.Item>
            <Button type="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }}>
              {bankId ? 'Save' : 'Create'}
            </Button>
          </Form.Item>
        </Row>
      </div>
    </Form>
  );
};

export default connect(({ [GLOBAL_NAME_SPACE]: { locations }, loading }) => ({
  locations,
  modalLoading:
    !!loading.effects[`${NAME_SPACE}/createBank`] || !!loading.effects[`${NAME_SPACE}/updateBank`],
}))(LocationForm);
