/* eslint-disable no-nested-ternary */
import { connect } from 'dva';
import React from 'react';
import {
  Button,
  Form,
  Input,
  Row,
  message,
  Typography,
  InputNumber,
  Alert,
  Col,
  Select,
  Checkbox,
} from 'antd';

import { NAME_SPACE, employeeStatusOptions } from './constants';
import styles from './EmployeeListing.less';

const { Option } = Select;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 22,
  },
};

const EmployeeForm = (props) => {
  const {
    dispatch,
    handleCancel,
    employeeId,
    title,
    locations,
    departments,
    groupPolicies,
    macAddress,
    userRole,
  } = props;
  const [employeeForm] = Form.useForm();

  const handleSubmit = (values) => {
    // const employee = data.find((item) => item.id === employeeId);

    // if (title === "Set password for") {
    //     if (values.confirmPassword === values.password) {
    //         dispatch({
    //             type: `${NAME_SPACE}/approveEmployee`,
    //             payload: {
    //                 data: {
    //                     employeeId,
    //                     password: values.password,
    //                 },
    //             },
    //         });
    //     } else {
    //         message.error("Password did not match..!")
    //     }
    // }
    if (title === 'Change password for') {
      if (values.confirmPassword === values.password) {
        // eslint-disable-next-line no-param-reassign
        delete values.confirmPassword;
        const formValues = {
          ...values,
          authUser: {
            password: values.password,
          },
        };
        dispatch({
          type: `${NAME_SPACE}/updateEmployee`,
          payload: {
            data: formValues,
            id: employeeId,
            title,
          },
        });
      } else {
        message.error('Password did not match please enter same password..!');
      }
    }
    if (title === 'Create new Employee') {
      if (
        (userRole === 'admin' && (values?.qrCodeCheckInAllowed || values?.faceCheckInAllowed)) ||
        ['supervisor', 'manager', 'hr-manager']?.includes(userRole)
      ) {
        const formValues = {
          attendanceType: values?.attendanceType,
          attendanceRadius: values?.attendanceRadius,
          userType: 'employee',
          groupId: values?.groupPolicy,
          isMac: macAddress?.isMac,
          macAddress: macAddress.isMac ? macAddress.address : macAddress.macAddress,
          multiDevice: values?.multiDevice,
          locations: values?.locations,
          employeeNumber: values?.emp_No,
          employeeName: values?.emP_Name,
          designation: values?.position_Name,
          departmentId: values?.departmentId,
          faceCheckInAllowed: values?.faceCheckInAllowed ?? false,
          qrCodeCheckInAllowed: values?.qrCodeCheckInAllowed ?? true,
          status: values?.employeestatus,
        };
        dispatch({
          type: `${NAME_SPACE}/createEmployee`,
          payload: {
            data: formValues,
          },
        });
      } else {
        message.error('Please allow at least one check-in/checkout option');
      }
    }
  };

  return (
    <Form
      form={employeeForm}
      {...layout}
      name="employeeForm"
      onFinish={handleSubmit}
      initialValues={{ active: false }}
    >
      {' '}
      {title === 'Set password for' || title === 'Change password for' ? (
        <>
          <Form.Item
            className={styles.inputTitle}
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please enter correct Password!',
              },
            ]}
          >
            <Input.Password placeholder="Password" autoComplete="off" />
          </Form.Item>
          <Form.Item
            className={styles.inputTitle}
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: 'Please enter correct confirm Password!',
              },
            ]}
          >
            <Input.Password placeholder="Confirm Password" autoComplete="off" />
          </Form.Item>
          <div style={{ marginBottom: 10 }}>
            <Typography.Text level={5}>
              <Alert
                message="You have to share this password with employee so he can login."
                type="warning"
              />
            </Typography.Text>
          </div>
          <div className={styles.modalButtons}>
            <Row>
              <Form.Item>
                <Button type="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }}>
                  {title === 'Set password for' ? 'Approve' : 'Save'}
                </Button>
              </Form.Item>
            </Row>
          </div>
        </>
      ) : (
        <>
          <Row>
            <Col span={8}>
              <Form.Item
                label="Batch Number"
                name="emp_No"
                rules={[
                  {
                    required: true,
                    message: 'Please enter Batch Number',
                  },
                ]}
              >
                <Input placeholder="Batch Number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Employee Name"
                name="emP_Name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter Employee Name',
                  },
                ]}
              >
                <Input placeholder="Employee Name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Designation"
                name="position_Name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter Designation',
                  },
                ]}
              >
                <Input placeholder="Designation" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Attendance Type"
                name="attendanceType"
                rules={[
                  {
                    required: true,
                    message: 'Please select Attendance Type',
                  },
                ]}
              >
                <Select showArrow placeholder="Attendance Type">
                  <Option value="Single">Single</Option>
                  <Option value="Double">Double</Option>
                  <Option value="Multiple">Multiple</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Location Assigned"
                name="locations"
                rules={[
                  {
                    required: true,
                    message: 'Please select Location Assigned',
                  },
                ]}
              >
                <Select
                  placeholder="Select Location"
                  showArrow
                  showSearch
                  mode="multiple"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {locations?.map((item) => (
                    <Option key={item?.id} value={item?.id}>
                      {item?.name?.toUpperCase()}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Department"
                name="departmentId"
                rules={[
                  {
                    required: true,
                    message: 'Please select Department',
                  },
                ]}
              >
                <Select
                  placeholder="Select Department"
                  showArrow
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {departments?.map((item) => (
                    <Option key={item?.id} value={item?.id}>
                      {item?.name?.toUpperCase()}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Set Radius Area for Check in"
                name="attendanceRadius"
                rules={[
                  {
                    type: 'number',
                    min: 1,
                    max: 2147483647,
                    message: 'Radius Area for Check in must be in between 1 and 2147483647.',
                  },
                ]}
              >
                <InputNumber placeholder="100 Meter" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Group Name" name="groupPolicy">
                <Select placeholder="Group Name" showSearch showArrow options={groupPolicies} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Mac Address"
                placeholder="Mac Address"
                name="macAddress"
                rules={[{ required: macAddress.isMac, message: 'Please add mac address!' }]}
              >
                <Input
                  onChange={(e) =>
                    dispatch({
                      type: `${NAME_SPACE}/setMacAddress`,
                      payload: {
                        isMac: true,
                        address: e.target.value,
                        macAddress: macAddress.macAddress,
                      },
                    })
                  }
                  value={macAddress.address}
                  disabled={!macAddress.isMac}
                  placeholder="Mac Address"
                />
              </Form.Item>
              <div style={{ marginTop: -20 }}>
                <Form.Item placeholder="Add Mac Address">
                  <Checkbox
                    name="isMac"
                    onChange={(e) =>
                      dispatch({
                        type: `${NAME_SPACE}/setMacAddress`,
                        payload: {
                          isMac: e.target.checked,
                          address: macAddress.macAddress,
                          macAddress: macAddress.macAddress,
                        },
                      })
                    }
                  >
                    Add Mac Address
                  </Checkbox>
                </Form.Item>
              </div>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Employee status"
                name="employeestatus"
                rules={[
                  {
                    required: true,
                    message: 'Please select Employee Status',
                  },
                ]}
              >
                <Select placeholder="Employee Status">
                  {employeeStatusOptions.map((item) => {
                    return (
                      <Option key={item.key} value={item.key}>
                        {item.value}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="multiDevice" valuePropName="checked" style={{ marginTop: '43px' }}>
                <Checkbox>Allow Multiple Devices</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8} />
            {userRole === 'admin' && (
              <>
                <Col span={8}>
                  <Form.Item name="qrCodeCheckInAllowed" valuePropName="checked">
                    <Checkbox>Allow QRCode CheckIn/Checkout</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="faceCheckInAllowed" valuePropName="checked">
                    <Checkbox disabled={true}>Allow Face CheckIn/Checkout</Checkbox>
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>

          {/* <Form.Item
            className={styles.inputTitle}
            label="Enter Employee Batch No"
            name={['authUser', 'username']}
            rules={[
              {
                required: true,
                message: 'Please enter batch Number!',
              },
            ]}
          >
            <InputNumber autoComplete="off" />
          </Form.Item> */}
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
        </>
      )}
    </Form>
  );
};

export default connect(
  ({ [NAME_SPACE]: { data, title, isShowModal, bankModalVisible, employeeId, macAddress } }) => ({
    data,
    title,
    employeeId,
    isShowModal,
    bankModalVisible,
    macAddress,
  }),
)(EmployeeForm);
