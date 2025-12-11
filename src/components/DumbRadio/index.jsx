import { Typography, Radio } from 'antd';

import styles from './DumbRadio.less';

const { Text } = Typography;

const DumbRadio = ({ label, value }) => {
  return (
    <div className={styles.dumbRadioContainer}>
      <Radio value={value}>
        <Text>{label}</Text>
      </Radio>
    </div>
  );
};

export default DumbRadio;
