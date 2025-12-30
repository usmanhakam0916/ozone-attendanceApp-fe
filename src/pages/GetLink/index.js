import React from 'react';
import { NAME_SPACE } from './constants';
import logo from '../../../public/icon.svg';
import { Button, Form, Input, Typography, Spin } from 'antd';
import { connect } from 'dva';

const GetLink = (props) => {
    const { dispatch, loading, data } = props;

    const { Link, Text } = Typography;
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
            offset: 9,
            span: 18,
        },
    };

    const [adminForm] = Form.useForm();

    const handleSubmit = (values) => {
        dispatch({
            type: `${NAME_SPACE}/getLink`,
            payload: {
                data: {
                    employeeNumber: values.employeeNumber
                },
            },
        });
    };

    return (
        <Spin spinning={loading}>
            <div style={{ marginTop: 150, height: '80vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <img src={logo} alt="logo" style={{ marginBottom: 20 }} />
                    <p style={{ fontWeight: 700, fontSize: 18, color: '#001529' }}>AGH Time Attendance</p>
                    <br />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: 80 }}>
                    <Form
                        form={adminForm}
                        {...layout}
                        name="adminForm"
                        onFinish={handleSubmit}
                        initialValues={{ active: false }}
                    >
                        <Form.Item
                            label="Enter your employee number to get link of apple application"
                            name="employeeNumber"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input placeholder="Employee No" autoComplete="off" />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }}>
                                Get
            </Button>
                        </Form.Item>
                        {data?.link ?
                            <Form.Item style={{ paddingLeft: 110 }}>
                                <Text level={2} style={{ color: '#69D9FF', fontWeight: 'bold' }}>
                                    Here is link for download apple application
                        </Text>
                            </Form.Item>
                            : null}
                        {data?.link ?
                            <Form.Item style={{ paddingLeft: 110 }}>
                                <Text level={2} style={{ color: '#69D9FF', fontWeight: 'bold' }} target="_blank">
                                    {data?.link}
                                </Text>
                            </Form.Item>
                            : null}
                    </Form>
                </div>
            </div>
        </Spin>
    );
};

export default connect(({ [NAME_SPACE]: { data }, loading }) => ({
    data,
    loading: !!loading.effects[`${NAME_SPACE}/getLink`],
}))(GetLink);
