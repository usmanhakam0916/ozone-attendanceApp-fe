import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { useEffect, useState } from 'react';

import OzoneTable from '@/components/OzoneTable';
import { GLOBAL_NAME_SPACE } from '../../models/constants';
import { getColumns } from './columns';
import { NAME_SPACE } from './constants';

const Departments = ({ dispatch, loading, isSearch, departments, totalDepartments, userRole }) => {
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

  const columns = getColumns({ dispatch, userRole });

  // const handleSearch = (value) => {
  //   if (value) {
  //     dispatch({
  //       type: `${NAME_SPACE}/searchDepartments`,
  //       payload: { name: value },
  //     });
  //   } else {
  //     dispatch({
  //       type: `${NAME_SPACE}/fetchDepartments`,
  //       payload: { take: pageSize, skip: 0 },
  //     });
  //   }
  // };

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

  const filters = [
    {
      key: 'id',
      placeholder: 'ID',
      allowClear: true,
      options: [],
      style: { minWidth: 300 },
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
        title="Department"
        subtitle="View and manage department in your organization"
        columns={columns}
        dataSource={departments}
        loading={loading}
        total={totalDepartments}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        // onSearch={handleSearch}
        // searchPlaceholder="Search Keywords..."
        // filters={filters}
        rowKey="id"
      />
    </PageContainer>
  );
};

export default connect(
  ({
    [NAME_SPACE]: { departments, isSearch, totalDepartments, filter },
    loading,
    [GLOBAL_NAME_SPACE]: { auth },
  }) => ({
    isSearch,
    userRole: auth.role,
    departments,
    filter,
    totalDepartments,
    loading:
      !!loading.effects[`${NAME_SPACE}/fetchDepartments`] ||
      !!loading.effects[`${NAME_SPACE}/searchDepartments`],
  }),
)(Departments);
