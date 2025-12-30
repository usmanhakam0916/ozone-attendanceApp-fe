/* eslint-disable no-nested-ternary */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Button, Form, Input, Row, Select, InputNumber, Tag, message } from 'antd';

import styles from './EmployeeListing.less';
import { NAME_SPACE } from './constants';
import { GLOBAL_NAME_SPACE } from '@/models/constants';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 22,
  },
};

function tagRender(props) {
  const { label, closable, onClose, color } = props;

  return (
    <Tag color={color} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
      {label}
    </Tag>
  );
}

const EmployeeEditForm = (props) => {
  const { dispatch, data, handleCancel, employeeId, locations, editModal } = props;
  const [employeeForm] = Form.useForm();

  useEffect(() => {
    dispatch({
      type: `${GLOBAL_NAME_SPACE}/fetchLocations`,
    });
    if (editModal) {
      if (employeeId) {
        const bank = data.find((item) => item.id === employeeId);
        employeeForm.setFieldsValue({
          locations: bank.locations.map((item) => item.id),
          attendanceRadius: bank.attendanceRadius,
        });
      } else {
        employeeForm.resetFields();
      }
    }
  }, [dispatch, editModal, employeeForm, employeeId]);

  const handleSubmit = (values) => {
    const employee = data.find((item) => item.id === employeeId);
    if (editModal) {
      if (employeeId) {
        if (values.confirmPassword === values.authUser.password) {
          dispatch({
            type: `${NAME_SPACE}/updateEmployee`,
            payload: {
              data: values,
              id: employeeId,
              title: '',
              prevData: employee,
            },
          });
        } else {
          message.error('Password did not match please enter same password..!');
        }
      }
    }
  };

  return (
    <Form
      form={employeeForm}
      {...layout}
      name="employeeForm"
      onFinish={handleSubmit}
      initialValues={{ active: false }}
    >
      {' '}
      <Form.Item className={styles.inputTitle} label="Password" name={['authUser', 'password']}>
        <Input.Password placeholder="Password" autoComplete="off" />
      </Form.Item>
      <Form.Item className={styles.inputTitle} label="Confirm Password" name="confirmPassword">
        <Input.Password placeholder="Confirm Password" autoComplete="off" />
      </Form.Item>
      <Form.Item
        label="Locations"
        name="locations"
        rules={[{ required: true, message: 'Please select any option!' }]}
      >
        <Select mode="multiple" showArrow tagRender={tagRender} options={locations} />
      </Form.Item>
      <Form.Item
        className={styles.inputTitle}
        label="Attendance Radius"
        name="attendanceRadius"
        rules={[{ required: true, message: 'Please enter Attendance Radius!' }]}
      >
        <InputNumber placeholder="Attendance Radius" autoComplete="off" />
      </Form.Item>
      <div className={styles.modalButtons}>
        <Row>
          <Form.Item>
            <Button type="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }}>
              Save
            </Button>
          </Form.Item>
        </Row>
      </div>
    </Form>
  );
};

export default connect(
  ({
    [NAME_SPACE]: { data, isShowModal, editModal, employeeId },
    loading,
    [GLOBAL_NAME_SPACE]: { locations },
  }) => ({
    data,
    employeeId,
    locations: locations?.map((item) => ({
      ...item,
      // todo: fix the color of the tag
      value: item.id,
      label: item.name,
    })),
    isShowModal,
    editModal,
    modalLoading: !!loading.effects[`${NAME_SPACE}/updateEmployee`],
  }),
)(EmployeeEditForm);
