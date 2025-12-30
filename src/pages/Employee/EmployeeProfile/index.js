/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'umi';

import useFormMode from '@/hooks/useFormMode';
import { GLOBAL_NAME_SPACE } from '@/models/constants';
import { PageContainer } from '@ant-design/pro-layout';
import { NAME_SPACE, employeeStatusOptions } from '../constants';

import { parseInt } from 'lodash';
import moment from 'moment';
import { getColumns } from '../columns/columns';
import styles from './KeystarProfile.less';

import AttendanceDetail from './attendanceDetail';
import AttendanceForm from './attendanceForm';

const { TabPane } = Tabs;
const { Text } = Typography;
const { Option } = Select;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 22,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 18,
  },
};

function tagRender(props) {
  const { label, closable, onClose, color } = props;

  return (
    <Tag color={color} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
      {label}
    </Tag>
  );
}

// todo: file type check before upload
const KeystarProfile = ({
  data,
  dispatch,
  locationsOptions,
  employeeData,
  loading,
  employeeAttendances,
  groupPolicies,
  macAddress,
  attendances,
  isShowCheckInOutModal,
  timeModal,
  userRole,
  syncLoading,
  departments,
}) => {
  const params = useParams();
  const [tabNumber, setTabNumber] = useState();
  const [expandedRowKey, setExpandedRowKey] = useState([]);
  const [form] = Form.useForm();
  const { isEditMode } = useFormMode(params.id);
  const history = useHistory();

  const handleCancel = () => {
    dispatch({
      type: `${NAME_SPACE}/setIsShowCheckInOutModal`,
      payload: false,
    });
  };

  const handleTimeModalCancel = () => {
    dispatch({
      type: `${NAME_SPACE}/setTimeModal`,
      payload: { visible: false, body: '' },
    });
  };

  const getFilterSetter = (filter) => (value) => {
    dispatch({
      type: `${NAME_SPACE}/setFilter`,
      payload: {
        filter,
        value,
      },
    });
  };
  const rangeConfig = {
    rules: [
      {
        type: 'array',
        required: true,
        message: 'Please select time!',
      },
    ],
  };
  useEffect(() => {
    if (params.id) dispatch({ type: `${NAME_SPACE}/fetchEmployeeAttendancesSuccess`, payload: [] });
    dispatch({ type: `${GLOBAL_NAME_SPACE}/fetchLocations` });
    dispatch({ type: `${NAME_SPACE}/fetchGroupPolicies` });
    dispatch({ type: `${NAME_SPACE}/fetchDepartments` });
    if (params.id) {
      dispatch({
        type: `${NAME_SPACE}/getEmployeeData`,
        payload: {
          id: params.id,
        },
      });
    }
    return () => {
      form.resetFields();
    };
  }, [dispatch, form, params.id]);
  function age(dateString) {
    const birth = new Date(dateString);
    const now = new Date();
    const beforeBirth =
      (() => {
        birth.setDate(now.getDate());
        birth.setMonth(now.getMonth());
        return birth.getTime();
      })() < birth.getTime()
        ? 0
        : 1;
    return now.getFullYear() - birth.getFullYear() - beforeBirth;
  }
  // fetch initial data and reset form on unmount
  useEffect(() => {
    setTabNumber(history.location.query.tab);
    if (isEditMode && employeeData) {
      // Parse initialData from authUser if it's a string
      let parsedInitialData = {};
      try {
        const initialDataStr = employeeData?.user?.authUser?.initialData;
        if (typeof initialDataStr === 'string') {
          parsedInitialData = JSON.parse(initialDataStr);
        } else if (initialDataStr) {
          parsedInitialData = initialDataStr;
        }
      } catch (e) {
        console.error('Failed to parse initialData', e);
      }

      form.setFieldsValue({
        ...employeeData,
        groupPolicy: employeeData?.user?.group?.id || null,
        macAddress: employeeData?.user?.macAddress,
        isMac: employeeData?.user?.isMac,
        locations: employeeData?.user?.locations?.map((item) => item.id),
        attendanceRadius: employeeData?.user?.attendanceRadius,
        attendanceType: employeeData?.user?.attendanceType,
        deviceId: employeeData?.user?.authUser?.deviceId,
        multiDevice: employeeData?.user?.authUser?.multiDevice,
        qrCodeCheckInAllowed: employeeData?.user?.authUser?.qrCodeCheckInAllowed,
        faceCheckInAllowed: employeeData?.user?.authUser?.faceCheckInAllowed,
        // age: moment().diff(employeeData?.almanaUser?.data?.data?.date_of_Birth, 'years', false)
        age: age(employeeData?.almanaUser?.data?.data?.date_of_Birth),
        employeestatus: employeeData?.user?.authUser?.status,
        departmentId: employeeData?.user?.__department__?.id,
        // Set FirstName and LastName from parsed initialData
        almanaUser: {
          ...employeeData?.almanaUser,
          data: {
            ...employeeData?.almanaUser?.data,
            data: {
              ...employeeData?.almanaUser?.data?.data,
              FirstName:
                parsedInitialData?.FirstName ||
                employeeData?.almanaUser?.data?.data?.FirstName ||
                '',
              LastName:
                parsedInitialData?.LastName || employeeData?.almanaUser?.data?.data?.LastName || '',
            },
          },
        },
      });
    }
    return () => {
      form.resetFields();
    };
  }, [dispatch, isEditMode, form, params.id, data, employeeData]);

  const onSubmit = (formValues) => {
    if (isEditMode) {
      if (formValues) {
        if (
          (userRole === 'admin' &&
            (formValues.qrCodeCheckInAllowed || formValues?.faceCheckInAllowed)) ||
          ['supervisor', 'manager', 'hr-manager']?.includes(userRole)
        ) {
          const payload = {
            attendanceRadius: formValues.attendanceRadius,
            attendanceType: formValues.attendanceType,
            groupId: formValues.groupPolicy,
            isMac: macAddress.isMac,
            macAddress: macAddress.isMac ? macAddress.address : macAddress.macAddress,
            multiDevice: formValues.multiDevice,
            locations: formValues.locations,
            firstName: formValues.almanaUser.data.data.FirstName,
            lastName: formValues.almanaUser.data.data.LastName,
            designation: formValues.ozoneUser.data.data.position_Name,
            departmentId: formValues.departmentId,
            authUser: {
              faceCheckInAllowed: formValues?.faceCheckInAllowed,
              qrCodeCheckInAllowed: formValues?.qrCodeCheckInAllowed,
              status: formValues?.employeestatus,
            },
          };
          dispatch({
            type: `${NAME_SPACE}/updateEmployee`,
            payload: {
              data: payload,
              id: params.id,
              title: '',
            },
          });
        } else {
          message.error('Please allow at least one check-in/checkout option');
        }
      }
    }
  };
  function callback(key) {
    setTabNumber(key);
  }

  const columns = getColumns({ dispatch, id: params?.id, employeeData, userRole, syncLoading });

  return (
    <PageContainer>
      <Card>
        <Spin spinning={loading}>
          <Form
            form={form}
            {...layout}
            // initialValues={defaultValues}
            name="keystarProfileForm"
            onFinish={onSubmit}
          >
            <Tabs defaultActiveKey={history.location.query.tab} onChange={callback}>
              <TabPane tab="Basic Info" key="1">
                <Row>
                  <Col span={24}>{/* <Divider /> */}</Col>
                  <Col span={8}>
                    <Form.Item label="Batch Number" name={['user', 'authUser', 'username']}>
                      <Input placeholder="Batch Number" disabled={true} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="First Name"
                      name={['almanaUser', 'data', 'data', 'FirstName']}
                    >
                      <Input
                        placeholder="First Name"
                        disabled={!['admin', 'manager']?.includes(userRole)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Last Name" name={['almanaUser', 'data', 'data', 'LastName']}>
                      <Input
                        placeholder="Last Name"
                        disabled={!['admin', 'manager']?.includes(userRole)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="Designation"
                      name={['ozoneUser', 'data', 'data', 'position_Name']}
                    >
                      <Input
                        placeholder="Designation"
                        disabled={!['admin', 'manager']?.includes(userRole)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Device Id" name="deviceId">
                      <Input placeholder="Device Id" disabled={true} />
                    </Form.Item>
                  </Col>
                  <Col span={8} />
                  <Col span={8} />
                  <Col span={8} />
                  <Col span={8} />
                  <Col span={8}>
                    <Form.Item label="Attendance Type" name="attendanceType">
                      <Select showArrow placeholder="Active">
                        <Select.Option value="Single">Single</Select.Option>
                        <Select.Option value="Double">Double</Select.Option>
                        <Select.Option value="Multiple">Multiple</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Status" name={['almanaUser', 'data', 'data', 'emp_Status']}>
                      <Input placeholder={'Active/Inactive/On hold'} disabled={true} />
                    </Form.Item>
                  </Col>
                  <Col span={8} />
                  <Col span={8}>
                    <Form.Item
                      label="Location Assigned"
                      name="locations"
                      rules={[{ required: true, message: 'Please select any option!' }]}
                    >
                      <Select
                        showSearch
                        mode="multiple"
                        showArrow
                        filterOption={(input, option) => {
                          return (
                            option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                            option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          );
                        }}
                        tagRender={tagRender}
                        options={locationsOptions}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Department" name="departmentId">
                      <Select
                        placeholder="Select Department"
                        showArrow
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={!['admin', 'manager']?.includes(userRole)}
                      >
                        {departments
                          ?.filter((item) => item.isActive)
                          ?.map((item) => (
                            <Option key={item?.id} value={item?.id}>
                              {item?.name?.toUpperCase()}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8} />
                  <Col span={8}>
                    {userRole !== 'manager' && userRole !== 'hr-manager' && (
                      <Form.Item
                        label="Set Radius Area for Check in"
                        name="attendanceRadius"
                        rules={[
                          {
                            type: 'number',
                            min: 1,
                            max: 2147483647,
                            message:
                              'Radius Area for Check in must be in between 1 and 2147483647.',
                          },
                        ]}
                      >
                        <InputNumber
                          disabled={userRole === 'manager' || userRole === 'hr-manager'}
                          placeholder="100 Meter"
                        />
                      </Form.Item>
                    )}
                  </Col>
                  {['supervisor', 'admin']?.includes(userRole) ? (
                    <Col span={8}>
                      <Form.Item label="Group Name" name="groupPolicy">
                        <Select
                          placeholder="Group Name"
                          showSearch
                          showArrow
                          options={groupPolicies}
                        />
                      </Form.Item>
                    </Col>
                  ) : (
                    <Col span={8} />
                  )}
                  <Col span={8} />
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
                  </Col>
                  <Col span={8} />
                  <Col span={8} />
                  <Col span={8} style={{ marginTop: -20 }}>
                    <Form.Item placeholder="Add Mac Address">
                      <Checkbox
                        name="isMac"
                        checked={macAddress.isMac}
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
                  </Col>
                  <Col span={8} />
                  <Col span={8} />
                  {userRole === 'admin' ? (
                    <>
                      <Col span={8}>
                        <Form.Item label="Employee status" name="employeestatus">
                          <Select placeholder="Active">
                            {employeeStatusOptions.map((item) => {
                              return (
                                <Select.Option key={item.key} value={item.key}>
                                  {item.value}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="multiDevice"
                          valuePropName="checked"
                          style={{ marginTop: '43px' }}
                        >
                          <Checkbox>Allow Multiple Devices</Checkbox>
                        </Form.Item>
                      </Col>
                      <Col span={8} />
                    </>
                  ) : (
                    userRole === 'admin' && (
                      <Col span={8}>
                        <Form.Item
                          name="multiDevice"
                          valuePropName="checked"
                          style={{ marginTop: '43px' }}
                        >
                          <Checkbox>Allow Multiple Devices</Checkbox>
                        </Form.Item>
                      </Col>
                    )
                  )}
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
              </TabPane>
              <TabPane tab="Attendance History" key="2">
                <Card
                //title={`${employeeData?.almanaUser?.data?.data?.emp_No} ${employeeData?.almanaUser?.data?.data?.emP_Name}`}
                // extra={
                //   userRole === 'admin' ? (
                //     <Tooltip placement="top" title="Create New Attendance">
                //       <Button
                //         style={{ marginLeft: 28 }}
                //         type="primary"
                //         disabled={loading}
                //         onClick={() => {
                //           dispatch({
                //             type: `${NAME_SPACE}/setIsShowCheckInOutModal`,
                //             payload: true,
                //           });
                //         }}
                //       >
                //         Create
                //       </Button>
                //     </Tooltip>
                //   ) : null
                // }
                >
                  <Table
                    size="small"
                    className={styles.tableHeight}
                    dataSource={employeeAttendances}
                    columns={columns}
                    expandable={{
                      columnWidth: '4%',
                      expandedRowKeys: expandedRowKey,
                      onExpand: (expanded, record) => {
                        if (record?.key === expandedRowKey[0]) {
                          setExpandedRowKey([]);
                        } else {
                          setExpandedRowKey([record?.key]);
                        }
                      },
                      expandedRowRender: (record) => <AttendanceDetail attendances={record} />,
                    }}
                    scroll={{ y: 660 }}
                  />
                </Card>
              </TabPane>
            </Tabs>
            {parseInt(tabNumber) === 1 ? (
              <Form.Item {...tailLayout} style={{ marginTop: 180 }}>
                <Button
                  type="default"
                  size="large"
                  onClick={() => {
                    history.goBack();
                  }}
                >
                  Cancel
                </Button>

                <Button style={{ marginLeft: 10 }} type="primary" htmlType="submit" size="large">
                  Save
                </Button>
              </Form.Item>
            ) : null}
          </Form>
        </Spin>
      </Card>
      <Modal
        cancelButtonProps={{ paddingRight: 60 }}
        title={'Not Allowed'}
        visible={timeModal.visible}
        onCancel={handleTimeModalCancel}
        footer={null}
        destroyOnClose={true}
      >
        <Row>
          <Col span={24}>
            <Text>{timeModal.body}</Text>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Button
              style={{ float: 'right' }}
              type="secondary"
              onClick={() => {
                handleTimeModalCancel();
              }}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Modal>
      <Modal
        bodyStyle={{ paddingBottom: 0 }}
        cancelButtonProps={{ paddingRight: 60 }}
        title={`Create New Attendance ${
          employeeData ? employeeData?.almanaUser?.data?.data?.emp_No : ''
        }`}
        visible={isShowCheckInOutModal}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
      >
        <AttendanceForm
          attendances={attendances}
          employeeId={params?.id}
          locations={employeeData?.user?.locations}
          handleCancel={handleCancel}
        />
      </Modal>
    </PageContainer>
  );
};

export default connect(
  ({
    [NAME_SPACE]: {
      data,
      employeeData,
      filters,
      employeeAttendances,
      groupPolicies,
      macAddress,
      attendances,
      isShowCheckInOutModal,
      timeModal,
      departments,
    },
    loading,
    [GLOBAL_NAME_SPACE]: { locations, auth },
  }) => ({
    data,
    attendances,
    isShowCheckInOutModal,
    timeModal,
    userRole: auth.role,
    groupPolicies: (() => {
      const policies = groupPolicies?.map((item) => {
        return { ...item, label: item.name, value: item.id };
      });
      policies?.push({ label: 'None', value: null });
      return policies;
    })(),
    macAddress,
    employeeAttendances,
    employeeData: (() => {
      let filteredData = employeeData;

      // todo : make utility function for three condition (getFilteredDates in utils.js)
      if (filters.date) {
        if (filters.date[0] && filters.date[1]) {
          const startDateFilter = moment(filters.date[0]);
          const endDateFilter = moment(filters.date[1]);

          filteredData = filteredData?.user?.attendances?.filter((item) => {
            const deliveryDateAndTime = moment(item.checkInTime);
            return deliveryDateAndTime >= startDateFilter && deliveryDateAndTime <= endDateFilter;
          });
        }
      }

      return filteredData;
    })(),
    locationsOptions: locations?.map((item) => {
      return {
        ...item,
        // todo: fix the color of the tag
        value: item.id,
        label: item.name,
      };
    }),
    departments,
    loading:
      !!loading.effects[`${GLOBAL_NAME_SPACE}/fetchLocations`] ||
      !!loading.effects[`${GLOBAL_NAME_SPACE}/getEmployeeData`] ||
      !!loading.effects[`${NAME_SPACE}/updateEmployeeAttendance`] ||
      !!loading.effects[`${NAME_SPACE}/fetchEmployeeAttendances`] ||
      !!loading.effects[`${NAME_SPACE}/updateEmployee`] ||
      !!loading.effects[`${NAME_SPACE}/fetchGroupPolicies`] ||
      !!loading.effects[`${NAME_SPACE}/fetchDepartments`],
    syncLoading: !!loading.effects[`${NAME_SPACE}/syncToEService`],
  }),
)(KeystarProfile);
