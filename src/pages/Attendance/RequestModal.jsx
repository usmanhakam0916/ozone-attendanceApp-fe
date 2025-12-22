import { Button, Form, Input, InputNumber, Modal, Space, Typography } from 'antd';
import { useEffect } from 'react';

const { Text } = Typography;

const RequestModal = ({ visible, onClose, record, onAccept, onReject, loading }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && record?.updateRequestData) {
      const { time, comment } = record.updateRequestData;
      form.setFieldsValue({
        hours: time?.[0] ?? 0,
        minutes: time?.[1] ?? 0,
        comment: comment || '',
      });
    }
  }, [visible, record, form]);

  const handleHoursChange = (value) => {
    if (value === null || value === undefined) return;
    let clampedValue = Math.floor(value);
    if (clampedValue < 0) clampedValue = 0;
    if (clampedValue > 23) clampedValue = 23;
    if (clampedValue !== value) {
      form.setFieldsValue({ hours: clampedValue });
    }
  };

  const handleMinutesChange = (value) => {
    if (value === null || value === undefined) return;
    let clampedValue = Math.floor(value);
    if (clampedValue < 0) clampedValue = 0;
    if (clampedValue > 59) clampedValue = 59;
    if (clampedValue !== value) {
      form.setFieldsValue({ minutes: clampedValue });
    }
  };

  useEffect(() => {
    if (visible && record?.updateRequestData) {
      const { time, comment } = record.updateRequestData;
      form.setFieldsValue({
        hours: time?.[0] ?? 0,
        minutes: time?.[1] ?? 0,
        comment: comment || '',
      });
    }
  }, [visible, record, form]);

  const handleAccept = () => {
    form.validateFields().then((values) => {
      const payload = {
        attendanceId: record.id,
        attendenceTimeType: record.updateRequestData?.attendenceTimeType,
        hour: values.hours,
        minute: values.minutes,
        comment: values.comment,
        approved: true,
      };
      onAccept(payload);
    });
  };

  const handleReject = () => {
    form.validateFields().then((values) => {
      const payload = {
        attendanceId: record.id,
        attendenceTimeType: record.updateRequestData?.attendenceTimeType,
        hour: values.hours,
        minute: values.minutes,
        comment: values.comment,
        approved: false,
      };
      onReject(payload);
    });
  };

  const getRequestTypeLabel = () => {
    const type = record?.updateRequestData?.attendenceTimeType;
    if (type === 'CHECKIN') return 'Check-in';
    if (type === 'CHECKOUT') return 'Checkout';
    return type || 'N/A';
  };

  return (
    <Modal
      title="Update Request Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <div style={{ marginBottom: 16 }}>
        <Text strong>Request Type: </Text>
        <Text>{getRequestTypeLabel()}</Text>
      </div>

      <Form form={form} layout="vertical">
        <Space style={{ width: '100%' }} size="middle">
          <Form.Item
            name="hours"
            label="Hours"
            rules={[
              { required: true, message: 'Please enter hours' },
              { type: 'number', min: 0, max: 23, message: 'Hours must be between 0-23' },
            ]}
          >
            <InputNumber min={0} max={23} style={{ width: 120 }} onChange={handleHoursChange} />
          </Form.Item>

          <Form.Item
            name="minutes"
            label="Minutes"
            rules={[
              { required: true, message: 'Please enter minutes' },
              { type: 'number', min: 0, max: 59, message: 'Minutes must be between 0-59' },
            ]}
          >
            <InputNumber min={0} max={59} style={{ width: 120 }} onChange={handleMinutesChange} />
          </Form.Item>
        </Space>

        <Form.Item name="comment" label="Comment">
          <Input.TextArea rows={3} disabled />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button danger onClick={handleReject} loading={loading}>
              Reject
            </Button>
            <Button type="primary" onClick={handleAccept} loading={loading}>
              Accept
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RequestModal;
