/* eslint-disable no-nested-ternary */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Button, Form, Input, Row, Select, message } from 'antd';

import { NAME_SPACE } from './constants';
import styles from './AdminListing.less';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 22,
  },
};

const { Option } = Select;

const AdminForm = (props) => {
  const { dispatch, data, handleCancel, adminId, index, modalVisible } = props;
  const [adminForm] = Form.useForm();

  useEffect(() => {
    if (modalVisible) {
      if (adminId) {
        const bank = data.find((item) => item.id === adminId);
        adminForm.setFieldsValue({ role: bank?.authUser?.type });
      } else {
        adminForm.resetFields();
      }
    }
  }, [adminForm, data, adminId, modalVisible]);

  const handleSubmit = (values) => {
    if (modalVisible) {
      if (values.authUser.confirmPassword === values.authUser.password) {
        const formValues = {
          ...values,
          authUser: {
            password: values.authUser.password,
            username: values.authUser?.username?.toLowerCase(),
            type: values.role,
          },
        };
        if (adminId) {
          const bank = data.find((item) => item.id === adminId);
          if (values.role || values.authUser.password)
            dispatch({
              type: `${NAME_SPACE}/updateAdmin`,
              payload: {
                data: formValues,
                id: adminId,
                index,
                userId: bank?.authUser?.id,
              },
            });
          else message.error('Please enter password and confirm password or select user role.');
        } else {
          dispatch({
            type: `${NAME_SPACE}/createAdmin`,
            payload: {
              data: formValues,
            },
          });
        }
      } else {
        message.error('Password did not match please enter same password!');
      }
    }
  };

  return (
    <Form
      form={adminForm}
      {...layout}
      name="adminForm"
      onFinish={handleSubmit}
      initialValues={{ active: false }}
    >
      {modalVisible ? (
        <>
          {adminId ? null : (
            <Form.Item
              className={styles.inputTitle}
              label="User Name"
              name={['authUser', 'username']}
              rules={[
                {
                  required: !adminId,
                  min: 3,
                  message: 'User Name must be minimum 2 characters.',
                },
                {
                  required: !adminId,
                  max: 15,
                  message: 'User Name must be maximum 30 characters.',
                },
              ]}
            >
              <Input placeholder="User Name" autoComplete="off" />
            </Form.Item>
          )}
          <Form.Item
            className={styles.inputTitle}
            label="Password"
            name={['authUser', 'password']}
            rules={[
              { required: !adminId, min: 3, message: 'Password must be minimum 2 characters.' },
              {
                required: !adminId,
                max: 15,
                message: 'Password must be maximum 30 characters.',
              },
            ]}
          >
            <Input.Password placeholder="Password" autoComplete="off" />
          </Form.Item>
          <Form.Item
            className={styles.inputTitle}
            label="Confirm Password"
            name={['authUser', 'confirmPassword']}
            rules={[
              {
                required: !adminId,
                message: 'Please enter correct confirm Password!',
              },
            ]}
          >
            <Input.Password placeholder="Confirm Password" autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            className={styles.inputTitle}
            rules={[
              {
                required: !adminId,
                message: 'Please select role.',
              },
            ]}
          >
            <Select placeholder="Select Role">
              <Option key="admin" value="admin">
                Admin
              </Option>
              <Option key="manager" value="manager">
                Manager
              </Option>
              <Option key="supervisor" value="supervisor">
                Supervisor
              </Option>
              <Option key="hr-manager" value="hr-manager">
                HR Manager
              </Option>
            </Select>
          </Form.Item>
          {/* <Form.Item
            className={styles.inputTitle}
            label="First Name"
            name={['authUser', 'firstName']}
            rules={[
              { min: 3, message: 'First Name must be minimum 2 characters.' },
              {
                max: 15,
                message: 'First Name must be maximum 30 characters.',
              },
            ]}
          >
            <Input placeholder="First Name" autoComplete="off" />
          </Form.Item>
          <Form.Item
            className={styles.inputTitle}
            label="Last Name"
            name={['authUser', 'lastName']}
            rules={[
              { min: 3, message: 'Last Name must be minimum 2 characters.' },
              {
                max: 15,
                message: 'Last Name must be maximum 30 characters.',
              },
            ]}
          >
            <Input placeholder="Last Name" autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="Email"
            name={['authUser', 'email']}
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Please enter correct email',
              },
            ]}
          >
            <Input placeholder="email" />
          </Form.Item> */}
        </>
      ) : (
        <Form.Item
          className={styles.inputTitle}
          label="Password"
          name={['authUser', 'password']}
          rules={[
            { min: 3, message: 'Password must be minimum 2 characters.' },
            {
              max: 15,
              message: 'Password must be maximum 30 characters.',
            },
          ]}
        >
          <Input placeholder="Password" autoComplete="off" />
        </Form.Item>
      )}
      <div className={styles.modalButtons}>
        <Row>
          <Form.Item>
            <Button type="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }}>
              {adminId ? 'Save' : 'Create'}
            </Button>
          </Form.Item>
        </Row>
      </div>
    </Form>
  );
};

export default connect(({ [NAME_SPACE]: { data, modalVisible }, loading }) => ({
  data,
  modalVisible,
  modalLoading:
    !!loading.effects[`${NAME_SPACE}/createAdmin`] ||
    !!loading.effects[`${NAME_SPACE}/updateAdmin`],
}))(AdminForm);
