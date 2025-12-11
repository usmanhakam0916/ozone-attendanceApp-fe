import { GLOBAL_NAME_SPACE } from '@/models/constants';
import { SearchOutlined } from '@ant-design/icons';
import { Form, Input, Select } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { NAME_SPACE } from './constants';
import styles from './EmployeeListing.less';

const { Option } = Select;

const FilterForm = ({ dispatch, loading, employeeFilter, departments }) => {
  const [employeeForm] = Form.useForm();
  const [value, setValue] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    employeeForm.setFieldsValue({
      ...employeeFilter,
    });
  }, [employeeFilter]);

  const handleSearch = (searchValue) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      const data = { deviceType: employeeFilter?.deviceType || 'all' };
      if (searchValue) {
        data.id = searchValue;
      }
      if (employeeFilter?.departmentId) {
        data.departmentId = employeeFilter.departmentId;
      }
      dispatch({
        type: `${NAME_SPACE}/getEmployee`,
        payload: {
          data,
        },
      });
    }, 500);
    
    setSearchTimeout(timeout);
  };

  const handleSubmit = (values) => {
    setValue(values.deviceType);
    const data = { deviceType: values.deviceType };
    if (values.id) {
      data.id = values.id;
    }
    if (values?.departmentId) {
      data.departmentId = values.departmentId;
    }
    dispatch({
      type: `${NAME_SPACE}/getEmployee`,
      payload: {
        data,
      },
    });
  };

  return (
    <div className={styles.filterWrapper}>
      <Form form={employeeForm} name="employeeForm" onFinish={handleSubmit} layout="inline">
        <Form.Item name="id" className={styles.searchInput}>
          <Input 
            placeholder="Search Keywords..." 
            autoComplete="off"
            prefix={<SearchOutlined style={{ color: '#999' }} />}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Form.Item>
        <Form.Item className={styles.filterSelect} name="departmentId">
          <Select
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            allowClear
            showSearch
            placeholder="Departments"
            onClear={() => {
              setValue(null);
              dispatch({
                type: `${GLOBAL_NAME_SPACE}/setEmployeeFilter`,
                payload: { ...employeeFilter, departmentId: null },
              });
            }}
            onChange={(e) => {
              setValue(e);
              dispatch({
                type: `${GLOBAL_NAME_SPACE}/setEmployeeFilter`,
                payload: { ...employeeFilter, departmentId: e },
              });
              // Auto search on department change
              const data = { 
                deviceType: employeeFilter?.deviceType || 'all',
                departmentId: e 
              };
              dispatch({
                type: `${NAME_SPACE}/getEmployee`,
                payload: { data },
              });
            }}
          >
            {departments?.map((item) => {
              return (
                <Option key={item?.id} value={item.id}>
                  {item?.name?.toUpperCase()}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="deviceType" className={styles.filterSelect}>
          <Select
            placeholder="All Status"
            allowClear
            onChange={(e) => {
              dispatch({
                type: `${GLOBAL_NAME_SPACE}/setEmployeeFilter`,
                payload: { ...employeeFilter, deviceType: e },
              });
              // Auto search on status change
              const data = { 
                deviceType: e,
                departmentId: employeeFilter?.departmentId 
              };
              dispatch({
                type: `${NAME_SPACE}/getEmployee`,
                payload: { data },
              });
            }}
          >
            <Option value="all">All Status</Option>
            <Option value="ios">IOS</Option>
            <Option value="android">Android</Option>
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(
  ({ [GLOBAL_NAME_SPACE]: { employeeFilter }, [NAME_SPACE]: { departments }, loading }) => ({
    employeeFilter,
    departments,
  }),
)(FilterForm);
