import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { useEffect, useState } from 'react';

import OzoneTable from '@/components/OzoneTable';
import { getColumns } from './columns';
import { NAME_SPACE } from './constants';

const DifferentDeviceAttendances = ({
  dispatch,
  employeeId,
  loading,
  differentDeviceAttendances,
  totalDifferentDeviceAttendances,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  useEffect(() => {
    dispatch({
      type: `${NAME_SPACE}/fetchDifferentDeviceAttendances`,
      payload: { take: pageSize, skip: 0, employeeId: null },
    });
    return () => {
      dispatch({
        type: `${NAME_SPACE}/reset`,
      });
    };
  }, [dispatch]);

  const columns = getColumns();

  const handleSearch = (value) => {
    dispatch({
      type: `${NAME_SPACE}/fetchDifferentDeviceAttendances`,
      payload: { take: pageSize, skip: 0, employeeId: value || null },
    });
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
    }
    dispatch({
      type: `${NAME_SPACE}/fetchDifferentDeviceAttendances`,
      payload: {
        take: size || pageSize,
        skip: (page - 1) * (size || pageSize),
        employeeId,
      },
    });
  };

  const filters = [
    {
      key: 'name',
      placeholder: 'Name',
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

  return (
    <PageContainer header={{ title: null }}>
      <OzoneTable
        title="Device Attendance"
        subtitle="Device Attendance"
        columns={columns}
        dataSource={differentDeviceAttendances}
        loading={loading}
        total={totalDifferentDeviceAttendances}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchPlaceholder="Search Keywords..."
        filters={filters}
        rowKey="id"
      />
    </PageContainer>
  );
};

export default connect(
  ({
    [NAME_SPACE]: { differentDeviceAttendances, totalDifferentDeviceAttendances, employeeId },
    loading,
  }) => ({
    employeeId,
    differentDeviceAttendances,
    totalDifferentDeviceAttendances,
    loading: !!loading.effects[`${NAME_SPACE}/fetchDifferentDeviceAttendances`],
  }),
)(DifferentDeviceAttendances);
