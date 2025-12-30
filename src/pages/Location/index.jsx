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
import LocationForm from './LocationForm';

const bankListing = (props) => {
  const {
    dispatch,
    loading,
    locations,
    deleteLoading,
    bankModalVisible,
    modalLoading,
    bankId,
    userRole,
    filter,
    allLocations,
  } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    dispatch({
      type: `${GLOBAL_NAME_SPACE}/fetchLocations`,
    });
    return () => {
      dispatch({
        type: `${NAME_SPACE}/reset`,
      });
    };
  }, [dispatch]);

  const columns = getColumns({ dispatch, deleteLoading, bankModalVisible, userRole });

  const showModal = () => {
    if (bankId) {
      dispatch({
        type: `${NAME_SPACE}/setBankModalVisible`,
        payload: {
          visible: true,
        },
      });
    } else {
      dispatch({
        type: `${NAME_SPACE}/setBankModalVisible`,
        payload: {
          visible: true,
          id: null,
        },
      });
    }
  };

  const handleCancel = () => {
    dispatch({
      type: `${NAME_SPACE}/setBankModalVisible`,
      payload: {
        visible: false,
      },
    });
  };

  const handleSearch = (value) => {
    setSearchValue(value);
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

  const headerRight = userRole === 'admin' ? (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      className={styles.createBtn}
      onClick={showModal}
    >
      Create
    </Button>
  ) : null;

  return (
    <PageContainer header={{ title: null }}>
      <OzoneTable
        title="Location"
        subtitle="View and manage locations in your organization"
        columns={columns}
        dataSource={locations}
        loading={loading}
        total={locations?.length || 0}
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
        title={bankId ? 'Edit Location' : 'Create new Location'}
        visible={bankModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
      >
        <Spin spinning={modalLoading}>
          <LocationForm bankId={bankId} handleCancel={handleCancel} />
        </Spin>
      </Modal>
    </PageContainer>
  );
};

export default connect(
  ({
    [NAME_SPACE]: { bankModalVisible, bankId, filter },
    loading,
    [GLOBAL_NAME_SPACE]: { locations, auth },
  }) => ({
    userRole: auth?.role,
    allLocations: locations,
    locations: (() => {
      let filteredData = locations || [];

      if (filter?.name) {
        filteredData = filteredData.filter((item) =>
          item.name?.toLowerCase().includes(filter.name.toLowerCase()),
        );
      }

      return filteredData;
    })(),
    bankModalVisible,
    bankId,
    filter,
    loading:
      !!loading.effects[`${GLOBAL_NAME_SPACE}/fetchLocations`] ||
      !!loading.effects[`${NAME_SPACE}/deleteBank`] ||
      !!loading.effects[`${NAME_SPACE}/updateBank`],
    modalLoading:
      !!loading.effects[`${NAME_SPACE}/createBank`] ||
      !!loading.effects[`${NAME_SPACE}/updateBank`],
  }),
)(bankListing);
