import { GLOBAL_NAME_SPACE } from '@/models/constants';
import { Button, Form, Input, Select } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import styles from './AttendanceListing.less';
import { NAME_SPACE } from './constants';

const { Option } = Select;

const FilterForm = ({ dispatch, loading, employeeFilter, departments }) => {
  const [employeeForm] = Form.useForm();
  const [value, setValue] = useState(null);

  useEffect(() => {
    employeeForm.setFieldsValue({
      ...employeeFilter,
    });
  }, [employeeFilter]);

  const handleSubmit = (values) => {
    dispatch({
      type: `${NAME_SPACE}/fetchAttendanceList`,
      payload: {
        take: 20,
        skip: 0,
        badgeNo: values.badgeNo,
        departmentId: values.departmentId,
      },
    });
  };

  return (
    <Form form={employeeForm} name="employeeForm" onFinish={handleSubmit} layout="inline">
      <Form.Item name="badgeNo" className={styles.nameFilter}>
        <Input
          placeholder="Search By Employee Batch Number"
          autoComplete="off"
          allowClear
          onClear={() => {
            dispatch({
              type: `${GLOBAL_NAME_SPACE}/setEmployeeFilter`,
              payload: { ...employeeFilter, badgeNo: null },
            });
          }}
          onChange={(e) => {
            setValue(e.target.value);
            dispatch({
              type: `${GLOBAL_NAME_SPACE}/setEmployeeFilter`,
              payload: { ...employeeFilter, badgeNo: e.target.value },
            });
          }}
        />
      </Form.Item>
      <Form.Item className={styles.nameFilter} name="departmentId">
        <Select
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          allowClear
          showSearch
          placeholder="Select Department"
          onClear={() => {
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
          }}
        >
          {departments?.filter((item) => item.isActive)?.map((item) => {
            return (
              <Option key={item?.id} value={item.id}>
                {item?.name?.toUpperCase()}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button disabled={loading} ghost type="primary" htmlType="submit">
          Search
        </Button>
      </Form.Item>
      {value ? (
        <Form.Item>
          <Button
            disabled={loading}
            ghost
            type="primary"
            onClick={() => {
              setValue(null);
              employeeForm.resetFields(['badgeNo', 'departmentId']);
              dispatch({
                type: `${GLOBAL_NAME_SPACE}/setEmployeeFilter`,
                payload: {
                  departmentId: null,
                  deviceType: 'all',
                  badgeNo: null,
                },
              });
              dispatch({
                type: `${NAME_SPACE}/fetchAttendanceList`,
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

export default connect(
  ({ [GLOBAL_NAME_SPACE]: { employeeFilter }, [NAME_SPACE]: { departments } }) => ({
    employeeFilter,
    departments,
  }),
)(FilterForm);
