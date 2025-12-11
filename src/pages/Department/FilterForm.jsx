import { Input, Button, Form } from 'antd';
import React from 'react';

import { NAME_SPACE } from './constants';
import styles from './BankListing.less';

const FilterForm = ({ dispatch, loading, isSearch }) => {
  const [departmentForm] = Form.useForm();

  const handleSubmit = (values) => {
    dispatch({ type: `${NAME_SPACE}/setIsSearch`, payload: true });
    dispatch({
      type: `${NAME_SPACE}/searchDepartments`,
      payload: {
        departmentName: values?.name?.toLowerCase()?.trim(),
      },
    });
  };

  return (
    <Form form={departmentForm} name="bankFilterForm" layout="inline" onFinish={handleSubmit}>
      <Form.Item name="name" className={styles.nameFilter}>
        <Input placeholder="Search by Name" optionFilterProp="value" />
      </Form.Item>
      <Form.Item>
        <Button disabled={loading} ghost type="primary" htmlType="submit">
          Search
        </Button>
      </Form.Item>
      {isSearch ? (
        <Form.Item>
          <Button
            disabled={loading}
            ghost
            type="primary"
            onClick={() => {
              departmentForm.resetFields(['name']);
              dispatch({ type: `${NAME_SPACE}/setIsSearch`, payload: false });
              dispatch({
                type: `${NAME_SPACE}/fetchDepartments`,
                payload: {
                  take: 20,
                  skip: 0,
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
