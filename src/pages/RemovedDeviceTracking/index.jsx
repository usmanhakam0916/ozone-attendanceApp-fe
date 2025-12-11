import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { useEffect, useState } from 'react';

import OzoneTable from '@/components/OzoneTable';
import { getColumns } from './columns';
import { NAME_SPACE } from './constants';

const RemovedDeviceTracking = ({
  dispatch,
  employeeId,
  loading,
  deviceIdTracking,
  totalDeviceIdTracking,
  departments,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  useEffect(() => {
    dispatch({
      type: `${NAME_SPACE}/fetchDeviceIdTracking`,
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
      type: `${NAME_SPACE}/fetchDeviceIdTracking`,
      payload: { take: pageSize, skip: 0, employeeId: value || null },
    });
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
    }
    dispatch({
      type: `${NAME_SPACE}/fetchDeviceIdTracking`,
      payload: {
        take: size || pageSize,
        skip: (page - 1) * (size || pageSize),
        employeeId,
      },
    });
  };

  const filters = [
    {
      key: 'department',
      placeholder: 'Departments',
      allowClear: true,
      showSearch: true,
      options: departments?.map((item) => ({
        value: item.id,
        label: item.name?.toUpperCase(),
      })) || [],
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
        title="Device Id Tracking"
        subtitle="Device Id Tracking"
        columns={columns}
        dataSource={deviceIdTracking}
        loading={loading}
        total={totalDeviceIdTracking}
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
  ({ [NAME_SPACE]: { deviceIdTracking, totalDeviceIdTracking, employeeId }, loading }) => ({
    employeeId,
    deviceIdTracking,
    totalDeviceIdTracking,
    departments: [],
    loading: !!loading.effects[`${NAME_SPACE}/fetchDeviceIdTracking`],
  }),
)(RemovedDeviceTracking);
