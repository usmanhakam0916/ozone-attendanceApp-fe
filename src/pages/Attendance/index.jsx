import OzoneTable from '@/components/OzoneTable';
import { GLOBAL_NAME_SPACE } from '@/models/constants';
import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';
import { connect } from 'dva';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './AttendanceListing.less';
import { getColumns } from './columns';
import { NAME_SPACE, UpdateRequestStatus } from './constants';
import RequestModal from './RequestModal';

const AttendanceListing = (props) => {
  const { dispatch, loading, data, total, employeeFilter, departments, updatingRequestId, currentUser } = props;
  const isAdmin = currentUser?.group === 'admin';
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    dispatch({
      type: `${NAME_SPACE}/fetchAttendanceList`,
      payload: { take: pageSize, skip: 0, ...employeeFilter },
    });
    dispatch({
      type: `${NAME_SPACE}/fetchDepartments`,
    });
    return () => {
      dispatch({
        type: `${NAME_SPACE}/reset`,
      });
    };
  }, [dispatch]);

  const downloadExcel = () => {
    dispatch({ type: `${NAME_SPACE}/downloadCSV`, payload: { ...employeeFilter } });
  };

  // Check if any item has CHECKIN_REQUESTED or CHECKOUT_REQUESTED status
  const hasRequestedItems = useMemo(() => {
    return data?.some((item) => 
      item.updateRequestStatus === UpdateRequestStatus.CHECKIN_REQUESTED || 
      item.updateRequestStatus === UpdateRequestStatus.CHECKOUT_REQUESTED
    );
  }, [data]);

  const handleViewRequest = useCallback((record) => {
    setSelectedRecord(record);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedRecord(null);
  }, []);

  const handleProcessRequest = useCallback((payload) => {
    dispatch({
      type: `${NAME_SPACE}/processUpdateRequest`,
      payload: {
        ...payload,
        take: pageSize,
        skip: (currentPage - 1) * pageSize,
        ...employeeFilter,
      },
    }).then(() => {
      handleCloseModal();
    });
  }, [dispatch, pageSize, currentPage, employeeFilter, handleCloseModal]);

  const columns = useMemo(() => {
    return getColumns(hasRequestedItems, handleViewRequest, isAdmin);
  }, [hasRequestedItems, handleViewRequest, isAdmin]);

  const handleSearch = (value) => {
    dispatch({
      type: `${NAME_SPACE}/fetchAttendanceList`,
      payload: { take: pageSize, skip: 0, ...employeeFilter, badgeNo: value || undefined },
    });
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
    }
    dispatch({
      type: `${NAME_SPACE}/fetchAttendanceList`,
      payload: {
        take: size || pageSize,
        skip: (page - 1) * (size || pageSize),
        ...employeeFilter,
      },
    });
  };

  const filters = [
    {
      key: 'department',
      placeholder: 'Departments',
      allowClear: true,
      showSearch: true,
      options: departments?.filter((item) => item.isActive)?.map((item) => ({
        value: item.id,
        label: item.name?.toUpperCase(),
      })) || [],
      onChange: (value) => {
        dispatch({
          type: `${GLOBAL_NAME_SPACE}/setEmployeeFilter`,
          payload: { ...employeeFilter, departmentId: value },
        });
        dispatch({
          type: `${NAME_SPACE}/fetchAttendanceList`,
          payload: { take: pageSize, skip: 0, ...employeeFilter, departmentId: value },
        });
      },
    }
  ];

  const headerRight = (
    <Button
      type="primary"
      icon={<DownloadOutlined />}
      className={styles.exportBtn}
      disabled={loading || total === 0}
      onClick={downloadExcel}
    >
      Export Excel File
    </Button>
  );

  return (
    <PageContainer header={{ title: null }}>
      <OzoneTable
        title="Time Sheet"
        subtitle="View and manage attendance records"
        columns={columns}
        dataSource={data}
        loading={loading}
        total={total}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchPlaceholder="Search Keywords..."
        // filters={filters}
        headerRight={headerRight}
        rowKey="id"
      />
      <RequestModal
        visible={modalVisible}
        onClose={handleCloseModal}
        record={selectedRecord}
        onAccept={handleProcessRequest}
        onReject={handleProcessRequest}
        loading={!!updatingRequestId}
      />
    </PageContainer>
  );
};

export default connect(
  ({ [GLOBAL_NAME_SPACE]: { employeeFilter }, [NAME_SPACE]: { data, total, departments, updatingRequestId }, user: { currentUser }, loading }) => ({
    total,
    employeeFilter,
    data,
    departments,
    updatingRequestId,
    currentUser,
    loading:
      !!loading.effects[`${NAME_SPACE}/fetchAttendanceList`] ||
      !!loading.effects[`${NAME_SPACE}/downloadCSV`] ||
      !!loading.effects[`${NAME_SPACE}/fetchEmployee`],
  }),
)(AttendanceListing);
