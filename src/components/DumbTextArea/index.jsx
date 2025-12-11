import { Typography, Input } from 'antd';
import styles from './DumbTextArea.less';

const { Text } = Typography;

const { TextArea } = Input;

const DumbTextArea = ({ label, value, textAreaProps }) => {
  return (
    <div className={styles.divStyle}>
      <div className={styles.titleStyle}>
        <Text>{label}</Text>
      </div>
      <TextArea value={value} {...textAreaProps} style={{ height: 137 }} />
    </div>
  );
};

export default DumbTextArea;
