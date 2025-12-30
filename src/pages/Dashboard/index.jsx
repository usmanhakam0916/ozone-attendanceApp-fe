import { GLOBAL_NAME_SPACE } from '@/models/constants';
import {
    AndroidOutlined,
    AppleOutlined,
    CheckCircleOutlined,
    LogoutOutlined,
    QrcodeOutlined,
    SmileOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { useEffect } from 'react';
import { history } from 'umi';
import { INTERVAL_TIME, NAME_SPACE } from './constants';
import styles from './Dashboard.less';
import LineChart from './LineChart';

const { Option } = Select;

const Dashboard = ({
  dispatch,
  data,
  loading,
  times,
  employeeFilter,
  date,
  locationId,
  locations,
  isFirstTimeLoad,
}) => {
  const loadRecords = (locId, dt) => {
    dispatch({
      type: `${NAME_SPACE}/fetchDashboard`,
      payload: { locationId: locId, date: dt },
    });
  };

  useEffect(() => {
    dispatch({ type: `${NAME_SPACE}/fetchLocations` });
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => loadRecords(locationId, date),
      isFirstTimeLoad ? 0 : INTERVAL_TIME,
    );
    if (loading) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [dispatch, date, loading]);

  const handleLocationChange = (value) => {
    dispatch({
      type: `${NAME_SPACE}/setLocationId`,
      payload: value,
    });
  };

  const handleDateChange = (dateValue) => {
    if (dateValue) {
      dispatch({
        type: `${NAME_SPACE}/setDate`,
        payload: dateValue.toDate(),
      });
    }
  };

  const handleFilter = () => {
    loadRecords(locationId, date);
  };

  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  // Analytics cards data
  const analyticsCards = [
    {
      key: 'iphone',
      icon: <AppleOutlined />,
      iconClass: styles.iconApple,
      value: data?.iphoneCount || 0,
      label: 'Total iPhone Users',
      onClick: () => {
        dispatch({
          type: `${GLOBAL_NAME_SPACE}/setEmployeeFilter`,
          payload: { ...employeeFilter, deviceType: 'ios' },
        });
        history.push('/employee');
      },
    },
    {
      key: 'android',
      icon: <AndroidOutlined />,
      iconClass: styles.iconAndroid,
      value: data?.androidCount || 0,
      label: 'Total Android Users',
      onClick: () => {
        dispatch({
          type: `${GLOBAL_NAME_SPACE}/setEmployeeFilter`,
          payload: { ...employeeFilter, deviceType: 'android' },
        });
        history.push('/employee');
      },
    },
    {
      key: 'checkin',
      icon: <CheckCircleOutlined />,
      iconClass: styles.iconCheckin,
      value: data?.checkInTimeCounts || 0,
      label: 'Total Check-ins',
      onClick: null,
    },
    {
      key: 'checkout',
      icon: <LogoutOutlined />,
      iconClass: styles.iconCheckout,
      value: data?.checkoutTimeCounts || 0,
      label: 'Total Checkout',
      onClick: null,
    },
  ];

  // Attendance type cards data
  const attendanceCards = [
    {
      key: 'qr-in',
      icon: <QrcodeOutlined />,
      iconClass: styles.iconQrIn,
      value: data?.qrCodeCheckIns || 0,
      label: 'Total QRCode Check\'Ins',
    },
    {
      key: 'qr-out',
      icon: <QrcodeOutlined />,
      iconClass: styles.iconQrOut,
      value: data?.qrCodeCheckOuts || 0,
      label: 'Total QRCode Checkout',
    },
    {
      key: 'face-in',
      icon: <SmileOutlined />,
      iconClass: styles.iconFaceIn,
      value: data?.faceCheckIns || 0,
      label: 'Total Face Checkins',
    },
    {
      key: 'face-out',
      icon: <SmileOutlined />,
      iconClass: styles.iconFaceOut,
      value: data?.faceCheckOuts || 0,
      label: 'Total Face Checkout',
    },
    {
      key: 'admin-in',
      icon: <UserOutlined />,
      iconClass: styles.iconAdminIn,
      value: data?.adminCheckIns || 0,
      label: 'Total Admin Checkins',
    },
    {
      key: 'admin-out',
      icon: <UserOutlined />,
      iconClass: styles.iconAdminOut,
      value: data?.adminCheckouts || 0,
      label: 'Total Admin Checkouts',
    },
  ];

  return (
    <div className={styles.dashboardWrapper}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.breadcrumb}>Dashboard</p>
      </div>

      {/* Filter Card */}
      <div className={styles.filterCard}>
        <h2 className={styles.filterTitle}>Filter</h2>
        <div className={styles.filterRow}>
          <div className={styles.filterField}>
            <label className={styles.filterLabel}>
              <span className={styles.required}>*</span>Location
            </label>
            <Select
              className={styles.locationSelect}
              placeholder="All"
              value={locationId}
              onChange={handleLocationChange}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {locations?.map((item) => (
                <Option key={item?.id} value={item.id}>
                  {item?.name?.toUpperCase()}
                </Option>
              ))}
            </Select>
          </div>
          <div className={styles.filterField}>
            <DatePicker
              className={styles.datePicker}
              value={moment(date)}
              onChange={handleDateChange}
              disabledDate={disabledDate}
              allowClear={false}
            />
          </div>
          <Button
            className={styles.filterButton}
            type="primary"
            onClick={handleFilter}
            loading={loading}
          >
            Filter
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Analytics Overview</h2>
        <div className={styles.analyticsRow}>
          {analyticsCards.map((card) => (
            <div
              key={card.key}
              className={styles.analyticsCard}
              onClick={card.onClick}
              style={{ cursor: card.onClick ? 'pointer' : 'default' }}
            >
              <div className={`${styles.cardIcon} ${card.iconClass}`}>
                {card.icon}
              </div>
              <p className={styles.cardNumber}>{card.value}</p>
              <p className={styles.cardLabel}>{card.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Types */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Attendance Types</h2>
        <div className={styles.attendanceRow}>
          {attendanceCards.map((card) => (
            <div key={card.key} className={styles.attendanceCard}>
              <div className={`${styles.cardIcon} ${card.iconClass}`}>
                {card.icon}
              </div>
              <p className={styles.cardNumber}>{card.value}</p>
              <p className={styles.cardLabel}>{card.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CheckIns Chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h2 className={styles.chartTitle}>CheckIns</h2>
          <div className={styles.chartLegend}>
            <span className={`${styles.legendDot} ${styles.green}`}></span>
            CheckIns
          </div>
        </div>
        <div className={styles.chartBody}>
          <LineChart times={times} record={data?.checkInTimes} color="#52c41a" label="Check Ins" />
        </div>
      </div>

      {/* Checkouts Chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h2 className={styles.chartTitle}>Checkouts</h2>
          <div className={styles.chartLegend}>
            <span className={`${styles.legendDot} ${styles.blue}`}></span>
            Checkouts
          </div>
        </div>
        <div className={styles.chartBody}>
          <LineChart times={times} record={data?.checkoutTimes} color="#1890ff" label="Checkouts" />
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({
    [GLOBAL_NAME_SPACE]: { employeeFilter },
    [NAME_SPACE]: { data, date, locationId, locations, isFirstTimeLoad },
    loading,
  }) => ({
    data,
    isFirstTimeLoad,
    date,
    locationId,
    locations,
    employeeFilter,
    times: (() => {
      const newTimes = [];
      for (let i = 0; i < 24; i++) {
        newTimes.push(
          `${i?.toString()?.length === 1 ? `0${i}:00 - 0${i}:59` : `${i}:00 - ${i}:59`}`,
        );
      }
      return newTimes;
    })(),
    loading: !!loading.effects[`${NAME_SPACE}/fetchDashboard`],
  }),
)(Dashboard);
