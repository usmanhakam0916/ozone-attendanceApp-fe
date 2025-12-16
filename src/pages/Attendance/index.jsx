import OzoneTable from '@/components/OzoneTable';
import { GLOBAL_NAME_SPACE } from '@/models/constants';
import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';
import { connect } from 'dva';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './AttendanceListing.less';
import { getColumns } from './columns';
import { NAME_SPACE } from './constants';

const AttendanceListing = (props) => {
  const { dispatch, loading, data, total, employeeFilter, departments, updatingRequestId, currentUser } = props;
  const isAdmin = currentUser?.group === 'admin';
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

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
      item.updateRequestStatus === 'CHECKIN_REQUESTED' || 
      item.updateRequestStatus === 'CHECKOUT_REQUESTED'
    );
  }, [data]);

  // Map request status to approved status
  const getApprovedStatus = (requestStatus) => {
    if (requestStatus === 'CHECKIN_REQUESTED') {
      return 'CHECKIN_APPROVED';
    }
    if (requestStatus === 'CHECKOUT_REQUESTED') {
      return 'CHECKOUT_APPROVED';
    }
    return 'APPROVED';
  };

  const handleAccept = useCallback((attendanceId, requestStatus) => {
    dispatch({
      type: `${NAME_SPACE}/updateRequestStatus`,
      payload: {
        attendanceId,
        status: getApprovedStatus(requestStatus),
        take: pageSize,
        skip: (currentPage - 1) * pageSize,
        ...employeeFilter,
      },
    });
  }, [dispatch, pageSize, currentPage, employeeFilter]);

  const handleReject = useCallback((attendanceId) => {
    dispatch({
      type: `${NAME_SPACE}/updateRequestStatus`,
      payload: {
        attendanceId,
        status: 'REJECTED',
        take: pageSize,
        skip: (currentPage - 1) * pageSize,
        ...employeeFilter,
      },
    });
  }, [dispatch, pageSize, currentPage, employeeFilter]);

  const columns = useMemo(() => {
    return getColumns(hasRequestedItems, handleAccept, handleReject, updatingRequestId, isAdmin);
  }, [hasRequestedItems, handleAccept, handleReject, updatingRequestId, isAdmin]);

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
        filters={filters}
        headerRight={headerRight}
        rowKey="id"
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
