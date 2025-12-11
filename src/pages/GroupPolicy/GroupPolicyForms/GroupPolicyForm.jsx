/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import { Form, Input, Button, Row, Col, Spin, TimePicker } from 'antd';
import { connect } from 'dva';
import React, { useEffect } from 'react';

import { NAME_SPACE } from '../constants';
import styles from '../GroupPolicies.less';

import moment from 'moment';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 22,
  },
};

// todo: file type check before upload
const GroupPolicyForm = ({ dispatch, handleCancel, record, modalLoading }) => {
  const [form] = Form.useForm();

  function getTimeInString(time) {
    return moment(time).format('HH:mm:00');
  }

  function getTimeInMoment(time) {
    return moment(time, 'h:mm:00 a');
  }

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, [dispatch, form]);

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        ...record,
        checkinTime: getTimeInMoment(record.checkinTime),
        checkoutTime: getTimeInMoment(record.checkoutTime),
      });
    }

    return () => {
      form.resetFields();
    };
  }, [dispatch, form, record]);

  const onSubmit = (formValues) => {
    let employeeIds = [];
    if (record) {
      employeeIds = record.employees.map((item) => item?.id);
    }

    dispatch({
      type: `${NAME_SPACE}/${record ? 'updateGroupPolicy' : 'createGroupPolicy'}`,
      payload: {
        data: {
          name: formValues.name,
          tags: formValues.tags,
          checkinTime: getTimeInString(formValues.checkinTime),
          checkoutTime: getTimeInString(formValues.checkoutTime),
          employees: employeeIds,
        },
        id: record ? record.id : null,
        updateEmployees: false,
      },
    });
  };

  return (
    <Spin spinning={modalLoading}>
      <Form form={form} {...layout} name="GroupPolicyFormForm" onFinish={onSubmit}>
        <Form.Item
          name="name"
          label="Policy Name"
          rules={[
            {
              required: true,
              type: 'string',
              message: 'Please enter policy name!',
            },
          ]}
        >
          <Input placeholder="Policy Name" />
        </Form.Item>
        <Form.Item
          name="tags"
          label="Tags"
          rules={[
            {
              required: true,
              type: 'string',
              message: 'Please enter tags!',
            },
          ]}
        >
          <Input placeholder="Tags" />
        </Form.Item>
        <Row>
          <Col span={8}>
            <Form.Item
              name="checkinTime"
              label="Check-in Time"
              rules={[
                {
                  required: true,
                  message: 'Please select check-in time!',
                },
              ]}
            >
              <TimePicker use12Hours format="h:mm A" placeholder="Check-in Time" />
            </Form.Item>
          </Col>
          <Col span={8} />
          <Col span={8}>
            <Form.Item
              name="checkoutTime"
              label="Checkout Time"
              rules={[
                {
                  required: true,
                  message: 'Please enter checkout time!',
                },
              ]}
            >
              <TimePicker use12Hours format="h:mm A" placeholder="Checkout Time" />
            </Form.Item>
          </Col>
        </Row>
        <div className={styles.modalButtons}>
          <Form.Item>
            <Button
              type="secondary"
              onClick={() => {
                handleCancel({ visibility: false, record: null });
              }}
            >
              Cancel
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }}>
              {record ? 'Save' : 'Create'}
            </Button>
          </Form.Item>
        </div>
        {/* {record && (
          <Row>
            <Col span={24}>
              <div style={{ float: 'right', marginRight: 20 }}>
                <Form.Item>
                  <Tooltip placement="left" title="Save group policy and update employees">
                    <Button type="link" htmlType="submit" style={{ marginLeft: 10 }}>
                      Update Employees
                    </Button>
                  </Tooltip>
                </Form.Item>
              </div>
            </Col>
          </Row>
        )} */}
      </Form>
    </Spin>
  );
};

export default connect(({ [NAME_SPACE]: {}, loading }) => ({
  modalLoading:
    !!loading.effects[`${NAME_SPACE}/createGroupPolicy`] ||
    !!loading.effects[`${NAME_SPACE}/updateGroupPolicy`],
}))(GroupPolicyForm);
