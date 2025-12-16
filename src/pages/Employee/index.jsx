import OzoneTable from '@/components/OzoneTable';
import { GLOBAL_NAME_SPACE } from '@/models/constants';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Modal, Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { getColumns } from './columns';
import { NAME_SPACE } from './constants';
import EmployeeForm from './employeeForm';
import styles from './EmployeeListing.less';

const videoConstraints = {
  width: 470,
  height: 400,
  facingMode: 'user',
};

function dataURLtoFile(dataURL, fileName) {
  const contentType = dataURL.split(',')[0].split(':')[1];
  const byteString = atob(dataURL.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new File([arrayBuffer], fileName, { type: contentType });
}

const EmployeeListing = (props) => {
  const {
    dispatch,
    loading,
    data,
    bankModalVisible,
    employeeId,
    modalLoading,
    filter,
    title,
    isShowModal,
    faceModal,
    imageModal,
    total,
    userRole,
    employeeFilter,
    departments,
    locations,
    groupPolicies,
  } = props;
  const [employee, setEmployee] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  useEffect(() => {
    dispatch({
      type: `${NAME_SPACE}/fetchEmployeeList`,
      payload: {
        take: pageSize,
        skip: 0,
        ...employeeFilter,
      },
    });
    dispatch({
      type: `${NAME_SPACE}/fetchDepartments`,
    });
    dispatch({ type: `${GLOBAL_NAME_SPACE}/fetchLocations` });
    dispatch({ type: `${NAME_SPACE}/fetchGroupPolicies` });
    if (employeeId) {
      const employee1 = data.find((item) => item.id === employeeId);
      setEmployee(employee1);
    }

    return () => {
      handleCancel();
    };
  }, [dispatch]);

  const columns = getColumns({ dispatch, userRole });

  const handleCancel = () => {
    dispatch({
      type: `${NAME_SPACE}/setMacAddress`,
      payload: {
        isMac: false,
        address: '',
        macAddress: '',
      },
    });
    dispatch({
      type: `${NAME_SPACE}/showModal`,
      payload: {
        visible: false,
      },
    });
  };

  const handleCancelImageModal = () => {
    dispatch({
      type: `${NAME_SPACE}/setImageModal`,
      payload: {
        visible: false,
      },
    });
  };

  const handleCancelFaceModal = () => {
    dispatch({
      type: `${NAME_SPACE}/setFaceModal`,
      payload: {
        visible: false,
      },
    });
  };

  const handleSearch = (value) => {
    const data = { deviceType: employeeFilter?.deviceType || 'all' };
    if (value) {
      data.id = value;
    }
    if (employeeFilter?.departmentId) {
      data.departmentId = employeeFilter.departmentId;
    }
    dispatch({
      type: `${NAME_SPACE}/getEmployee`,
      payload: { data },
    });
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
    }
    dispatch({
      type: `${NAME_SPACE}/fetchEmployeeList`,
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
      showSearch: true,
      allowClear: true,
      value: employeeFilter?.departmentId,
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
          type: `${NAME_SPACE}/getEmployee`,
          payload: {
            data: {
              deviceType: employeeFilter?.deviceType || 'all',
              departmentId: value,
            },
          },
        });
      },
    },
    {
      key: 'status',
      placeholder: 'All Status',
      allowClear: true,
      value: employeeFilter?.deviceType,
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'ios', label: 'IOS' },
        { value: 'android', label: 'Android' },
      ],
      onChange: (value) => {
        dispatch({
          type: `${GLOBAL_NAME_SPACE}/setEmployeeFilter`,
          payload: { ...employeeFilter, deviceType: value },
        });
        dispatch({
          type: `${NAME_SPACE}/getEmployee`,
          payload: {
            data: {
              deviceType: value,
              departmentId: employeeFilter?.departmentId,
            },
          },
        });
      },
    },
  ];

  // const headerRight = (
  //   <Button
  //     type="primary"
  //     icon={<PlusOutlined />}
  //     className={styles.addUserBtn}
  //     disabled={loading}
  //     onClick={() => {
  //       dispatch({
  //         type: `${NAME_SPACE}/showModal`,
  //         payload: {
  //           visible: true,
  //           title: 'Create new Employee',
  //           id: null,
  //         },
  //       });
  //     }}
  //   >
  //     Add User
  //   </Button>
  // );

  return (
    <PageContainer header={{ title: null }}>
      <OzoneTable
        title="Employee Listing"
        subtitle="View and manage all employee in your organization"
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
        // headerRight={headerRight}
        rowKey="id"
      />

      <Modal
        bodyStyle={{ paddingBottom: 0 }}
        cancelButtonProps={{ paddingRight: 60 }}
        width={title === 'Create new Employee' ? 800 : 500}
        title={`${title} ${employee ? employee?.authUser?.username : ''}`}
        visible={bankModalVisible || isShowModal}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
      >
        <Spin spinning={modalLoading}>
          <EmployeeForm
            bankId={employeeId}
            departments={departments}
            locations={locations}
            groupPolicies={groupPolicies}
            userRole={userRole}
            handleCancel={handleCancel}
          />
        </Spin>
      </Modal>
      <Modal
        bodyStyle={{ padding: 20 }}
        title={imageModal.title}
        visible={imageModal.visible}
        onCancel={handleCancelImageModal}
        footer={null}
        destroyOnClose={true}
      >
        <img alt="image" className={styles.image} src={imageModal.imageUrl} />
      </Modal>
      <Modal
        bodyStyle={{ padding: 20 }}
        title={faceModal.title}
        visible={faceModal.visible}
        onCancel={handleCancelFaceModal}
        footer={null}
        destroyOnClose={true}
      >
        {faceModal.imageUrl ? (
          <div>
            <img alt="image" className={styles.image} src={faceModal.imageUrl} />
            <Button
              style={{ margin: '6px 0px' }}
              type="primary"
              loading={modalLoading}
              disabled={modalLoading}
              onClick={() => {
                dispatch({
                  type: `${NAME_SPACE}/registerEmployeeFace`,
                  payload: {
                    data: {
                      file: dataURLtoFile(faceModal.imageUrl, 'Face-ID.jpeg'),
                      employeeId: faceModal.employeeId,
                    },
                  },
                });
              }}
            >
              Save
            </Button>
          </div>
        ) : (
          <Webcam
            audio={false}
            height={400}
            screenshotFormat="image/jpeg"
            width={470}
            videoConstraints={videoConstraints}
          >
            {({ getScreenshot }) => (
              <Button
                type="primary"
                onClick={() => {
                  const imageSrc = getScreenshot();
                  dispatch({
                    type: `${NAME_SPACE}/setFaceModal`,
                    payload: {
                      visible: true,
                      imageUrl: imageSrc,
                    },
                  });
                }}
              >
                Capture photo
              </Button>
            )}
          </Webcam>
        )}
      </Modal>
    </PageContainer>
  );
};

export default connect(
  ({
    [GLOBAL_NAME_SPACE]: { auth, employeeFilter, locations },
    [NAME_SPACE]: {
      total,
      data,
      employeeId,
      title,
      isShowModal,
      imageModal,
      editModal,
      faceModal,
      departments,
      groupPolicies,
    },
    loading,
  }) => ({
    userRole: auth.role,
    total,
    data,
    title,
    employeeId,
    isShowModal,
    editModal,
    imageModal,
    faceModal,
    employeeFilter,
    departments,
    locations,
    groupPolicies: (() => {
      const policies = groupPolicies?.map((item) => {
        return { ...item, label: item.name, value: item.id };
      });
      policies?.push({ label: 'None', value: null });
      return policies;
    })(),
    loading:
      !!loading.effects[`${NAME_SPACE}/fetchEmployeeList`] ||
      !!loading.effects[`${NAME_SPACE}/removeDevices`] ||
      !!loading.effects[`${NAME_SPACE}/fetchDepartments`] ||
      !!loading.effects[`${NAME_SPACE}/removeFaceId`] ||
      !!loading.effects[`${NAME_SPACE}/getEmployee`] ||
      !!loading.effects[`${GLOBAL_NAME_SPACE}/fetchLocations`] ||
      !!loading.effects[`${NAME_SPACE}/fetchGroupPolicies`],
    modalLoading:
      !!loading.effects[`${NAME_SPACE}/approveEmployee`] ||
      !!loading.effects[`${NAME_SPACE}/getEmployeeData`] ||
      !!loading.effects[`${NAME_SPACE}/createEmployee`] ||
      !!loading.effects[`${NAME_SPACE}/updateEmployee`] ||
      !!loading.effects[`${NAME_SPACE}/registerEmployeeFace`],
  }),
)(EmployeeListing);
