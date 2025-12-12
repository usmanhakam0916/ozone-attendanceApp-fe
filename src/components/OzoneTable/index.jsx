import { SearchOutlined } from '@ant-design/icons';
import { Input, Pagination, Select, Table } from 'antd';
import styles from './index.less';

const { Option } = Select;

const OzoneTable = ({
  title,
  subtitle,
  columns,
  dataSource,
  loading,
  total = 0,
  pageSize = 50,
  currentPage = 1,
  onPageChange,
  onSearch,
  searchPlaceholder = 'Search Keywords...',
  filters = [],
  headerRight,
  rowKey = 'id',
  scroll,
}) => {
  return (
    <div className={styles.ozoneTableWrapper}>
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>{title}</h1>
          {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
        </div>
        {headerRight && <div className={styles.headerRight}>{headerRight}</div>}
      </div>

      <div className={styles.tableCard}>
        {(onSearch || filters.length > 0) && (
          <div className={styles.filterBar}>
            {onSearch && (
              <div className={styles.searchWrapper}>
                <Input
                  className={styles.searchInput}
                  placeholder={searchPlaceholder}
                  prefix={<SearchOutlined className={styles.searchIcon} />}
                  onChange={(e) => onSearch(e.target.value)}
                  allowClear
                />
              </div>
            )}
            <div className={styles.filtersWrapper}>
              {filters.map((filter, index) => (
                <Select
                  key={filter.key || index}
                  className={styles.filterSelect}
                  placeholder={filter.placeholder}
                  allowClear={filter.allowClear !== false}
                  showSearch={filter.showSearch}
                  optionFilterProp="children"
                  onChange={filter.onChange}
                  value={filter.value}
                  style={filter.style}
                >
                  {filter.options?.map((opt) => (
                    <Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Option>
                  ))}
                </Select>
              ))}
            </div>
          </div>
        )}

        <Table
          className={styles.ozoneTable}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={rowKey}
          pagination={false}
          scroll={scroll}
        />

        <div className={styles.paginationBar}>
          <Pagination
            className={styles.pagination}
            current={currentPage}
            total={total}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={onPageChange}
          />
          <div className={styles.resultPerPage}>
            <span>Result per page</span>
            <Select
              className={styles.pageSizeSelect}
              value={pageSize}
              onChange={(value) => onPageChange && onPageChange(1, value)}
            >
              <Option value={20}>20</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OzoneTable;
