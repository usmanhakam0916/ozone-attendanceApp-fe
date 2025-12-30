import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Modal, Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';

import OzoneTable from '@/components/OzoneTable';
import { GLOBAL_NAME_SPACE } from '../../models/constants';
import styles from './BankListing.less';
import { getColumns } from './columns';
import { NAME_SPACE } from './constants';
import DepartmentForm from './DepartmentForm';

const Departments = ({
  dispatch,
  loading,
  modalLoading,
  isSearch,
  departments,
  totalDepartments,
  userRole,
  bankModalVisible,
  currentPageSize,
  currentSkip,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  useEffect(() => {
    dispatch({
      type: `${NAME_SPACE}/fetchDepartments`,
      payload: { take: pageSize, skip: 0 },
    });
    return () => {
      dispatch({
        type: `${NAME_SPACE}/reset`,
      });
    };
  }, [dispatch]);

  const columns = getColumns({ dispatch, userRole, currentPageSize, currentSkip });

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
    }
    dispatch({
      type: `${NAME_SPACE}/fetchDepartments`,
      payload: {
        take: size || pageSize,
        skip: (page - 1) * (size || pageSize),
      },
    });
  };

  const showModal = () => {
    dispatch({
      type: `${NAME_SPACE}/setBankModalVisible`,
      payload: { visible: true },
    });
  };

  const handleCancel = () => {
    dispatch({
      type: `${NAME_SPACE}/setBankModalVisible`,
      payload: { visible: false },
    });
  };

  const headerRight =
    userRole === 'admin' ? (
      <Button type="primary" icon={<PlusOutlined />} className={styles.createBtn} onClick={showModal}>
        Create
      </Button>
    ) : null;

  return (
    <PageContainer header={{ title: null }}>
      <OzoneTable
        title="Department"
        subtitle="View and manage department in your organization"
        columns={columns}
        dataSource={departments}
        loading={loading}
        total={totalDepartments}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        headerRight={headerRight}
        rowKey="id"
      />

      <Modal
        bodyStyle={{ paddingBottom: 0 }}
        title="Create new Department"
        visible={bankModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
      >
        <Spin spinning={modalLoading}>
          <DepartmentForm handleCancel={handleCancel} />
        </Spin>
      </Modal>
    </PageContainer>
  );
};

export default connect(
  ({
    [NAME_SPACE]: { departments, isSearch, totalDepartments, filter, bankModalVisible, currentPageSize, currentSkip },
    loading,
    [GLOBAL_NAME_SPACE]: { auth },
  }) => ({
    isSearch,
    userRole: auth.role,
    departments,
    filter,
    totalDepartments,
    bankModalVisible,
    currentPageSize,
    currentSkip,
    loading:
      !!loading.effects[`${NAME_SPACE}/fetchDepartments`] ||
      !!loading.effects[`${NAME_SPACE}/searchDepartments`] ||
      !!loading.effects[`${NAME_SPACE}/updateDepartmentStatus`] ||
      !!loading.effects[`${NAME_SPACE}/deleteDepartment`],
    modalLoading: !!loading.effects[`${NAME_SPACE}/createDepartment`],
  }),
)(Departments);
