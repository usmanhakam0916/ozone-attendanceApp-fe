import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types'

import VideoPlayer from '../VideoPlayer';

const VideoModal = ({ isModalVisible, setIsModalVisible, url }) => {
    return (
        <Modal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null} mask={false}
        >
            <VideoPlayer iconRowStyle={"-38%"} url={url} />
        </Modal>
    )
}

VideoModal.propTypes = {
    isModalVisible: PropTypes.bool,
    setIsModalVisible: PropTypes.func
}

export default VideoModal;

