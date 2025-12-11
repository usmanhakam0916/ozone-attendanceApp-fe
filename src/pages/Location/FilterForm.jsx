import { Select, Button, Form } from 'antd';
import { uniqBy } from 'lodash';
import { connect } from 'dva';
import React from 'react';

import { NAME_SPACE } from './constants';
import styles from './BankListing.less';
import { GLOBAL_NAME_SPACE } from '@/models/constants';

const FilterForm = ({ dispatch, nameOptions, createdByNameOptions }) => {
  const [bankForm] = Form.useForm();

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
    <Form form={bankForm} name="bankFilterForm" layout="inline">
      <Form.Item name="name" className={styles.nameFilter}>
        <Select
          allowClear
          onClear={() => {
            bankForm.resetFields();
            dispatch({ type: `${NAME_SPACE}/resetFilters` });
          }}
          onSelect={getFilterSetter('name')}
          showSearch
          placeholder="Search by Name"
          optionFilterProp="value"
          options={nameOptions}
        />
      </Form.Item>
      {/* <Form.Item name="createdByName" className={styles.nameFilter}>
        <Select
          allowClear
          onClear={() => {
            bankForm.resetFields();
            dispatch({ type: `${NAME_SPACE}/resetFilters` });
          }}
          className={[styles.selectWidth]}
          showSearch
          placeholder="Search by createdBy name"
          optionFilterProp="value"
          onSelect={getFilterSetter('createdByName')}
          options={createdByNameOptions}
        ></Select>
      </Form.Item> */}
      <Form.Item>
        <Button
          ghost
          type="primary"
          onClick={() => {
            bankForm.resetFields();
            dispatch({ type: `${NAME_SPACE}/resetFilters` });
          }}
        >
          Reset Filters
        </Button>
      </Form.Item>
    </Form>
  );
};

export default connect(({ [GLOBAL_NAME_SPACE]: { locations }, loading }) => ({
  nameOptions: (() => {
    const options = locations.map((item) => ({
      value: item.name,
    }));
    return uniqBy(options, 'value').map((item) => ({
      ...item,
      value: item.value,
    }));
  })(),
  // createdByNameOptions: (() => {
  //   const options = data.map((item) => ({
  //     value: item.admin.authUser.username,
  //   }));
  //   return uniqBy(options, 'value').map((item) => ({
  //     ...item,
  //     value: item.value,
  //   }));
  // })(),
  loading: loading.effects[`${NAME_SPACE}/fetchBankList`],
}))(FilterForm);
