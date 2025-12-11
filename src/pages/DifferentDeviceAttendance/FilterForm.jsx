import { Input, Button, Form } from 'antd';
import React from 'react';

import { NAME_SPACE } from './constants';
import styles from './BankListing.less';

const FilterForm = ({ dispatch, loading, employeeId }) => {
  const [departmentForm] = Form.useForm();

  const handleSubmit = (values) => {
    dispatch({
      type: `${NAME_SPACE}/fetchDifferentDeviceAttendances`,
      payload: {
        take: 20,
        skip: 0,
        employeeId: values?.employeeId?.trim(),
      },
    });
  };

  return (
    <Form form={departmentForm} name="bankFilterForm" layout="inline" onFinish={handleSubmit}>
      <Form.Item name="employeeId" className={styles.nameFilter}>
        <Input placeholder="Search by badge no or device id" optionFilterProp="value" />
      </Form.Item>
      <Form.Item>
        <Button disabled={loading} ghost type="primary" htmlType="submit">
          Search
        </Button>
      </Form.Item>
      {employeeId ? (
        <Form.Item>
          <Button
            disabled={loading}
            ghost
            type="primary"
            onClick={() => {
              departmentForm.resetFields(['employeeId']);
              dispatch({
                type: `${NAME_SPACE}/fetchDifferentDeviceAttendances`,
                payload: {
                  take: 20,
                  skip: 0,
                  employeeId: null,
                },
              });
            }}
          >
            Reset
          </Button>
        </Form.Item>
      ) : null}
    </Form>
  );
};

export default FilterForm;
