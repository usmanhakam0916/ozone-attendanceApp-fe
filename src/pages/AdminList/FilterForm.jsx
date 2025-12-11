import React from 'react';
import { connect } from 'dva';
import { uniqBy } from 'lodash';
import { Select, Button, Form } from 'antd';

import { NAME_SPACE } from './constants';
import styles from './AdminListing.less';

const FilterForm = ({ dispatch, nameOptions, emailOptions }) => {
  const [adminForm] = Form.useForm();

  const getFilterSetter = (filter) => (value) => {
    dispatch({
      type: `${NAME_SPACE}/setFilter`,
      payload: {
        filter,
        value,
      },
    });
  };

  return (
    <Form form={adminForm} name="adminFilterForm" layout="inline">
      <Form.Item name="name" className={styles.nameFilter}>
        <Select
          allowClear
          onClear={() => {
            adminForm.resetFields();
            dispatch({ type: `${NAME_SPACE}/resetFilters` });
          }}
          onSelect={getFilterSetter('name')}
          showSearch
          placeholder="Search by Name"
          optionFilterProp="value"
          options={nameOptions}
        />
      </Form.Item>
      <Form.Item>
        <Button
          ghost
          type="primary"
          onClick={() => {
            adminForm.resetFields();
            dispatch({ type: `${NAME_SPACE}/resetFilters` });
          }}
        >
          Reset Filters
        </Button>
      </Form.Item>
    </Form>
  );
};

export default connect(({ [NAME_SPACE]: { data }, loading }) => ({
  nameOptions: (() => {
    const options = data.map((item) => ({
      value: item.authUser.username,
    }));
    return uniqBy(options, 'value').map((item) => ({
      ...item,
      value: item.value,
    }));
  })(),
  emailOptions: (() => {
    const options = data.map((item) => ({
      value: item.authUser.email,
    }));
    return uniqBy(options, 'value').map((item) => ({
      ...item,
      value: item.value,
    }));
  })(),
  loading: loading.effects[`${NAME_SPACE}/fetchAdminList`],
}))(FilterForm);
