import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Modal, Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';

import OzoneTable from '@/components/OzoneTable';
import AdminForm from './AdminForm';
import styles from './AdminListing.less';
import { getColumns } from './columns';
import { NAME_SPACE } from './constants';

const AdminListing = (props) => {
  const {
    dispatch,
    loading,
    data,
    deleteLoading,
    modalVisible,
    modalLoading,
    adminId,
    index,
    filter,
    currentUser,
    allData,
  } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  useEffect(() => {
    dispatch({
      type: `${NAME_SPACE}/fetchAdminList`,
    });
    return () => {
      dispatch({
        type: `${NAME_SPACE}/reSet`,
      });
    };
  }, [dispatch]);

  const columns = getColumns({ dispatch, deleteLoading, modalVisible, currentUser });

  const showModal = () => {
    if (adminId) {
      dispatch({
        type: `${NAME_SPACE}/setModalVisible`,
        payload: {
          visible: true,
        },
      });
    } else {
      dispatch({
        type: `${NAME_SPACE}/setModalVisible`,
        payload: {
          visible: true,
          id: null,
        },
      });
    }
  };

  const handleCancel = () => {
    dispatch({
      type: `${NAME_SPACE}/setModalVisible`,
      payload: {
        visible: false,
        id: null,
        index: null,
      },
    });
  };

  const handleSearch = (value) => {
    dispatch({
      type: `${NAME_SPACE}/setFilter`,
      payload: { name: value },
    });
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
    }
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

  const headerRight = (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      className={styles.createBtn}
      onClick={showModal}
    >
      Create
    </Button>
  );

  return (
    <PageContainer header={{ title: null }}>
      <OzoneTable
        title="Admin"
        subtitle="View and manage admin users"
        columns={columns}
        dataSource={data}
        loading={loading}
        total={data?.length || 0}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchPlaceholder="Search Keywords..."
        // filters={filters}
        headerRight={headerRight}
        rowKey="id"
      />

      <Modal
        bodyStyle={{ paddingBottom: 0 }}
        cancelButtonProps={{ paddingRight: 60 }}
        title={adminId ? 'Change Password' : 'Create new Admin'}
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
      >
        <Spin spinning={modalLoading}>
          <AdminForm adminId={adminId} index={index} handleCancel={handleCancel} />
        </Spin>
      </Modal>
    </PageContainer>
  );
};

export default connect(
  ({
    [NAME_SPACE]: { data, modalVisible, adminId, index, filter },
    loading,
    user: { currentUser },
  }) => ({
    currentUser,
    allData: data,
    data: (() => {
      let filteredData = data || [];

      if (filter?.name) {
        filteredData = filteredData.filter((item) =>
          item.authUser?.username?.toLowerCase().includes(filter.name.toLowerCase()),
        );
      }
      if (filter?.email) {
        filteredData = filteredData.filter((item) =>
          item.authUser?.email?.toLowerCase().includes(filter.email.toLowerCase()),
        );
      }

      return filteredData;
    })(),
    modalVisible,
    adminId,
    index,
    filter,
    loading:
      !!loading.effects[`${NAME_SPACE}/fetchAdminList`] ||
      !!loading.effects[`${NAME_SPACE}/deleteAdmin`] ||
      !!loading.effects[`${NAME_SPACE}/updateAdmin`],
    modalLoading:
      !!loading.effects[`${NAME_SPACE}/createAdmin`] ||
      !!loading.effects[`${NAME_SPACE}/updateAdmin`],
  }),
)(AdminListing);
