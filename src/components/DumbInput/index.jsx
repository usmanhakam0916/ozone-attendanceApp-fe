import { Typography, Input } from 'antd';
import styles from './DumbInput.less';

const { Text } = Typography;

const DumbInput = ({ label, value }) => {
  return (
    <div className={styles.divStyle}>
      <div className={styles.titleStyle}>
        <Text>{label}</Text>
      </div>
      <Input value={value} />
    </div>
  );
};

export default DumbInput;
