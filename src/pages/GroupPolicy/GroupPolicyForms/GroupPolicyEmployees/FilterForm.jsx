import React from 'react';
import { Button, Form, Select } from 'antd';
import { connect } from 'dva';

import { NAME_SPACE } from '../../constants';
import styles from '../../GroupPolicies.less';

const { Option } = Select;

const FilterForm = ({ dispatch, employees }) => {
  const [employeeForm] = Form.useForm();
  const handleSubmit = (values) => {
    dispatch({
      type: `${NAME_SPACE}/getEmployee`,
      payload: {
        data: {
          id: values.badgeId,
        },
      },
    });
  };

  return (
    <Form form={employeeForm} name="form" onFinish={handleSubmit} layout="inline">
      <Form.Item
        name="badgeId"
        className={styles.nameFilter}
        rules={[
          {
            required: true,
            message: 'Please enter valid badge id!',
          },
        ]}
      >
        <Select
          open={employeeForm.getFieldValue().badgeId && employeeForm.getFieldValue().badgeId.length}
          autoFocus
          dropdownMatchSelectWidth={false}
          onChange={(e) => {
            employeeForm.resetFields();
            dispatch({
              type: `${NAME_SPACE}/selectEmployee`,
              payload: e,
            });
          }}
          onSearch={(e) => {
            if (e.length)
              employeeForm.setFieldsValue({
                badgeId: e,
              });
            if (e.length >= 4)
              dispatch({
                type: `${NAME_SPACE}/getEmployee`,
                payload: {
                  data: {
                    id: e,
                  },
                },
              });
          }}
          showArrow={false}
          showSearch={true}
          placeholder="Search Employee By Badge No"
        >
          {employees.map((item) => (
            <Option key={item.key} value={item.key}>
              {item.value}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button ghost type="primary" htmlType="submit">
          Search
        </Button>
      </Form.Item>
    </Form>
  );
};

export default connect(({ [NAME_SPACE]: { employees } }) => ({
  employees,
}))(FilterForm);
