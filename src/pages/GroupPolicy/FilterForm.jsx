import { Button, Form, Input } from 'antd';
import { connect } from 'dva';
import React, { useState } from 'react';

import { NAME_SPACE } from './constants';
import styles from './GroupPolicies.less';

const FilterForm = ({ dispatch }) => {
  const [groupPolicyForm] = Form.useForm();
  const [value, setValue] = useState(null);
  const handleSubmit = (values) => {
    setValue(values.name);
    dispatch({
      type: `${NAME_SPACE}/getGroupPolicy`,
      payload: {
        policyName: values.name,
      },
    });
  };

  return (
    <Form form={groupPolicyForm} name="groupPolicyForm" onFinish={handleSubmit} layout="inline">
      <Form.Item
        name="name"
        className={styles.nameFilter}
        onChange={() => {
          setValue(value);
        }}
        rules={[{ required: true, message: 'please enter policy name' }]}
      >
        <Input placeholder="Search By Policy Name" autoComplete="off" />
      </Form.Item>
      <Form.Item>
        <Button ghost type="primary" htmlType="submit">
          Search
        </Button>
      </Form.Item>
      {value ? (
        <Form.Item>
          <Button
            ghost
            type="primary"
            onClick={() => {
              groupPolicyForm.resetFields();
              setValue(null);
              dispatch({
                type: `${NAME_SPACE}/fetchGroupPolicies`,
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

export default connect(() => ({}))(FilterForm);
