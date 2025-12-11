import React, { useEffect } from 'react';
import { connect } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Tooltip, Spin, Button } from 'antd';
import { useParams } from 'umi';

import styles from '../../GroupPolicies.less';

import { NAME_SPACE } from '../../constants';
import { getColumns } from './columns';
import FilterForm from './FilterForm';

const GroupPolicyEmployees = ({ dispatch, data, loading }) => {
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    dispatch({
      type: `${NAME_SPACE}/reset`,
    });
    if (id) {
      dispatch({ type: `${NAME_SPACE}/fetchEmployeeList`, payload: { id } });
    }
  }, [dispatch]);

  return (
    <PageContainer>
      <Spin spinning={loading}>
        <Card
          style={{ height: 900 }}
          title={<FilterForm data={data} disabled={dispatch} />}
          extra={
            <Tooltip placement="top" title="Update Employee">
              <Button
                style={{ marginLeft: 28 }}
                type="primary"
                onClick={() => {
                  const employeeIds = data.map((item) => item.id);
                  dispatch({
                    type: `${NAME_SPACE}/updateGroupPolicy`,
                    payload: {
                      data: {
                        employees: employeeIds,
                      },
                      id,
                      updateEmployees: true,
                    },
                  });
                }}
              >
                Update
              </Button>
            </Tooltip>
          }
        >
          <Table
            size="small"
            className={styles.tableHeight}
            dataSource={data}
            columns={getColumns(dispatch)}
            pagination={{
              showSizeChanger: false,
              pageSize: 20,
              total: data.length,
            }}
            scroll={{ y: 660 }}
          />
        </Card>
      </Spin>
    </PageContainer>
  );
};

export default connect(({ [NAME_SPACE]: { data }, loading }) => ({
  data,
  loading:
    !!loading.effects[`${NAME_SPACE}/fetchEmployeeList`] ||
    !!loading.effects[`${NAME_SPACE}/getEmployee`] ||
    !!loading.effects[`${NAME_SPACE}/updateGroupPolicy`],
}))(GroupPolicyEmployees);
