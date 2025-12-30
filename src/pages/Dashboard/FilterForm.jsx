import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Button, Form, Row, Col } from 'antd';
import moment from 'moment';
import { NAME_SPACE } from './constants';
import { Select, DatePicker } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 22,
  },
};

const FilterForm = (props) => {
  const { dispatch, locations, date, loading, loadRecords, locationId } = props;
  const [FilterForm] = Form.useForm();

  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  const handleSubmit = (values) => {
    dispatch({
      type: `${NAME_SPACE}/fetchDashboard`,
      payload: { locationId: values.locationId, date: new Date(values.date) },
    });
  };

  useEffect(() => {
    FilterForm.setFieldsValue({
      locationId,
      date: moment(new Date(date)),
    });
  }, [locations, date]);

  return (
    <Form
      form={FilterForm}
      {...layout}
      name="FilterForm"
      onFinish={handleSubmit}
      defaultValue={{ active: false }}
    >
      <Row>
        <Col span={6}>
          <Form.Item
            label="Location"
            name="locationId"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Select
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showSearch
              placeholder="Select Location"
            >
              {locations?.map((item) => {
                return (
                  <Option key={item?.id} value={item.id}>
                    {item?.name?.toUpperCase()}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Required' }]}>
            <DatePicker disabledDate={disabledDate} picker="date" />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                paddingRight: '20px',
                paddingLeft: '20px',
                marginTop: '40px',
              }}
            >
              Filter
            </Button>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Button
            style={{
              marginTop: '40px',
              marginLeft: '40px',
            }}
            disabled={loading}
            type="primary"
            outlined
            ghost
            icon={<ReloadOutlined spin={loading} />}
            onClick={() => loadRecords(locationId, date)}
          >
            Reload
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default connect(({ [NAME_SPACE]: { locations, date, locationId } }) => ({
  locations,
  date,
  locationId,
}))(FilterForm);
