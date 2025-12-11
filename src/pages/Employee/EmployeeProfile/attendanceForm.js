import { Form, DatePicker, Button, Row, Col, Spin, Radio, Select } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { NAME_SPACE } from '../constants';
import { compareCheckInTimes, compareCheckOutTimes } from '../../../utils/utils';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 22,
  },
};

const AttendanceForm = ({
  dispatch,
  handleCancel,
  employeeId,
  locations,
  modalLoading,
  attendances,
}) => {
  const [checkInId, setCheckInId] = useState(null);
  const [checkOutDisabled, setCheckOutDisabled] = useState(true);
  const [form] = Form.useForm();

  const attendancesKeys = Object.keys(attendances);

  locations = locations?.map((item) => ({
    ...item,
    // todo: fix the color of the tag
    value: item.id,
    label: item.name,
  }));

  const onShiftChange = (e) => {
    form.setFieldsValue({
      shift: e.target.value,
    });
  };

  function disabledDate(current) {
    // Can not select days from and after today
    return current && current > moment().subtract(1, 'days');
  }

  function disabledCheckOutDate(current) {
    const checkInTime = moment(form.getFieldValue('checkInTime'), 'YYYY-MM-DD');
    return (current && current < checkInTime) || (current && current > checkInTime.add(2, 'days'));
  }

  const changeTimeToMoment = (dateTime) =>
    `${moment.utc(`${dateTime}`).format('YYYY-MM-DD HH:mm:00')}`;

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, [dispatch, form]);

  useEffect(() => {
    form.setFieldsValue({
      shift: 'S1',
    });

    return () => {
      form.resetFields();
    };
  }, [dispatch, form, attendances]);

  const onSubmit = (formValues) => {
    // console.log('inside form submit', employeeId, formValues, checkInId);
    const data = {
      locationId: formValues.locationId,
      employeeId: parseInt(employeeId),
      checkInTime: changeTimeToMoment(formValues.checkInTime),
      checkoutTime: changeTimeToMoment(formValues.checkoutTime),
      shift: formValues.shift,
      checkInDeviceId: 'admin',
      checkOutDeviceId: 'admin',
      deviceId: 'admin',
      checkInType: 'admin',
      checkOutType: 'admin',
    };
    if (checkInId) {
      data.checkInId = checkInId;
    }
    dispatch({
      type: `${NAME_SPACE}/createEmployeeAttendance`,
      payload: {
        employeeId,
        data,
      },
    });
  };
  return (
    <Spin spinning={modalLoading}>
      <Form form={form} {...layout} name="AttendancesForm" onFinish={onSubmit}>
        <Row>
          <Col span={24}>
            <Form.Item
              label="Location"
              name="locationId"
              rules={[{ required: true, message: 'Please select location!' }]}
            >
              <Select placeholder="Select Location" showArrow options={locations} />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item
              name="checkInTime"
              label="Check-in Time"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value) {
                      const shiftType = getFieldValue('shift');
                      setCheckInId(null);
                      const checkInTime = moment(value).format('MM-DD-YYYY');
                      if (attendancesKeys.includes(checkInTime)) {
                        const attendance = attendances[checkInTime]?.record;
                        if (attendance.length) {
                          setCheckInId(attendance[0].checkInId);
                        }
                        if (shiftType === 'S1' && attendance.length >= 1) {
                          return Promise.reject(
                            new Error('S1 Check-in time for this date already exists!'),
                          );
                        }
                        if (shiftType === 'S2' && attendance.length > 1) {
                          return Promise.reject(
                            new Error('S2 Check-in time for this date already exists!'),
                          );
                        }
                        if (
                          shiftType === 'S2' &&
                          attendance.length >= 1 &&
                          compareCheckInTimes(
                            attendance[attendance.length - 1].checkInTime,
                            moment(value).format('YYYY-MM-DD HH:mm:00'),
                          )
                        ) {
                          return Promise.reject(
                            new Error(
                              'S2 check-in time cannot be less than or equal to S1 check-in time!',
                            ),
                          );
                        }
                        if (
                          shiftType === 'S2' &&
                          attendance.length >= 1 &&
                          compareCheckOutTimes(
                            attendance[attendance.length - 1].checkoutTime,
                            moment(value).format('YYYY-MM-DD HH:mm:00'),
                          )
                        ) {
                          return Promise.reject(
                            new Error('S2 check-in time cannot be less than S1 checkout time!'),
                          );
                        }
                        setCheckOutDisabled(false);
                        return Promise.resolve();
                      } else if (shiftType === 'S2') {
                        return Promise.reject(
                          new Error('Please first create S1 check-in time for this date!'),
                        );
                      }
                      setCheckOutDisabled(false);
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Please select check-in time!'));
                  },
                }),
              ]}
            >
              <DatePicker
                showNow={false}
                disabledDate={disabledDate}
                showTime
                format="MM-DD-YYYY HH:mm"
              />
            </Form.Item>
          </Col>
          <Col span={6} />
          <Col span={9}>
            <Form.Item
              name="checkoutTime"
              label="Checkout Time"
              rules={[
                {
                  required: true,
                  message: 'Please enter check out time!',
                },
              ]}
            >
              <DatePicker
                disabled={checkOutDisabled}
                showNow={false}
                disabledDate={disabledCheckOutDate}
                showTime
                format="MM-DD-YYYY HH:mm"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={16}>
            <Form.Item
              name="shift"
              rules={[
                {
                  required: true,
                  message: 'Please select shift type!',
                },
              ]}
            >
              <Radio.Group style={{ display: 'inline-block' }} onChange={onShiftChange}>
                <Radio value="S1">S1</Radio>
                <Radio value="S2">S2</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              <Button
                type="secondary"
                onClick={() => {
                  handleCancel();
                }}
              >
                Cancel
              </Button>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }}>
                Save
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default connect(({ [NAME_SPACE]: {}, loading }) => ({
  modalLoading: !!loading.effects[`${NAME_SPACE}/createEmployeeAttendance`],
}))(AttendanceForm);
