import { Button, Form, Input, Row, Select } from 'antd';
import { connect } from 'dva';
import { useState } from 'react';
import styles from './BankListing.less';
import { NAME_SPACE } from './constants';

const { Option } = Select;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 22 },
};

const DepartmentForm = ({ dispatch, handleCancel, currentPageSize, currentSkip }) => {
  const [form] = Form.useForm();
  const [selectedStatus, setSelectedStatus] = useState('active');

  const handleSubmit = (values) => {
    // Use the tracked state value to ensure we get the correct selection
    const isActive = selectedStatus === 'active';
    const data = {
      name: values.name,
      isActive: isActive,
    };
    dispatch({
      type: `${NAME_SPACE}/createDepartment`,
      payload: {
        data,
        take: currentPageSize || 50,
        skip: currentSkip || 0,
      },
    });
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  return (
    <Form
      form={form}
      {...layout}
      name="departmentForm"
      onFinish={handleSubmit}
      initialValues={{ status: 'active' }}
    >
      <Form.Item
        className={styles.inputTitle}
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please enter department name!' }]}
      >
        <Input placeholder="Department Name" autoComplete="off" />
      </Form.Item>
      <Form.Item
        className={styles.inputTitle}
        label="Status"
        name="status"
        rules={[{ required: true, message: 'Please select status!' }]}
      >
        <Select placeholder="Select Status" onChange={handleStatusChange}>
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
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
              Create
            </Button>
          </Form.Item>
        </Row>
      </div>
    </Form>
  );
};

export default connect(({ [NAME_SPACE]: { currentPageSize, currentSkip } }) => ({
  currentPageSize,
  currentSkip,
}))(DepartmentForm);
