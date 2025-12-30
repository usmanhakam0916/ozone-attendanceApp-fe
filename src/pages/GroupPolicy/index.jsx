import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Modal } from 'antd';
import { connect } from 'dva';
import { useEffect, useMemo, useState } from 'react';

import OzoneTable from '@/components/OzoneTable';
import { GLOBAL_NAME_SPACE } from '../../models/constants';
import { getColumns } from './columns';
import { NAME_SPACE } from './constants';
import styles from './GroupPolicies.less';
import GroupPolicyForm from './GroupPolicyForms/GroupPolicyForm';

const GroupPolicy = (props) => {
  const { dispatch, total, modalState, loading, groupPolicies, userRole } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch({
      type: `${NAME_SPACE}/reset`,
    });
    dispatch({
      type: `${NAME_SPACE}/fetchGroupPolicies`,
    });
  }, [dispatch]);

  const handleCancel = (payload) => {
    dispatch({
      type: `${NAME_SPACE}/showModal`,
      payload,
    });
  };

  const handleSearch = (value) => {
    setSearchText(value || '');
    setCurrentPage(1);
  };

  // Frontend filtering based on search text
  const filteredGroupPolicies = useMemo(() => {
    if (!searchText.trim()) {
      return groupPolicies;
    }
    const lowerSearch = searchText.toLowerCase();
    return groupPolicies?.filter((policy) => 
      policy.name?.toLowerCase().includes(lowerSearch)
    ) || [];
  }, [groupPolicies, searchText]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
    }
    // GroupPolicy API doesn't support pagination, it fetches all records
    // Pagination is handled client-side by the table
  };

  const filters = [
    {
      key: 'department',
      placeholder: 'Departments',
      allowClear: true,
      options: [],
    },
    {
      key: 'status',
      placeholder: 'All Status',
      allowClear: true,
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    },
  ];

  const headerRight = (userRole === 'admin' || userRole === 'supervisor') ? (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      className={styles.createBtn}
      onClick={() => {
        handleCancel({ visibility: true, record: null });
      }}
    >
      Create
    </Button>
  ) : null;

  return (
    <PageContainer header={{ title: null }}>
      <OzoneTable
        title="Group Policy"
        subtitle="Group Policy"
        columns={getColumns(dispatch, userRole)}
        dataSource={filteredGroupPolicies}
        loading={loading}
        total={filteredGroupPolicies?.length || 0}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchPlaceholder="Search by name..."
        headerRight={headerRight}
        rowKey="id"
      />

      <Modal
        bodyStyle={{ paddingBottom: 0 }}
        cancelButtonProps={{ paddingRight: 60 }}
        title={`${modalState.record ? 'Update Group Policy' : 'Create New Group Policy'}`}
        visible={modalState.visibility}
        onCancel={() => handleCancel({ visibility: false, record: null })}
        footer={null}
        destroyOnClose={true}
      >
        <GroupPolicyForm record={modalState.record} handleCancel={handleCancel} />
      </Modal>
    </PageContainer>
  );
};

export default connect(
  ({
    [NAME_SPACE]: { total, modalState, groupPolicies },
    [GLOBAL_NAME_SPACE]: { auth },
    loading,
  }) => ({
    total,
    modalState,
    groupPolicies,
    userRole: auth.role,
    loading:
      !!loading.effects[`${NAME_SPACE}/fetchGroupPolicies`] ||
      !!loading.effects[`${NAME_SPACE}/deleteGroupPolicy`],
  }),
)(GroupPolicy);
