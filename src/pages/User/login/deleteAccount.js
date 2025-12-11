import React, { useCallback, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Modal, Spin } from 'antd';

const DeleteAccount = ({ dispatch, userModalVisibility, modalLoading }) => {
  const handleSubmit = useCallback(() => {
    dispatch({ type: 'login/deleteAccount' });
  }, [dispatch]);

  const handleCancel = useCallback(() => {
    dispatch({
      type: 'user/setUserModalVisibility',
      payload: false,
    });
    dispatch({ type: 'login/logout' });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: 'user/setUserModalVisibility',
      payload: true,
    });
  }, []);

  return (
    <Modal
      title="Confirm Account Deletion"
      open={userModalVisibility}
      footer={null}
      closable={false}
      destroyOnClose={true}
    >
      <Spin spinning={modalLoading}>
        <p>Are you sure you want to delete your account?</p>
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <Button type="primary" onClick={handleSubmit}>
            Yes
          </Button>
          &nbsp; &nbsp;
          <Button type="secondary" onClick={handleCancel}>
            No
          </Button>
        </div>
      </Spin>
    </Modal>
  );
};

export default connect(({ ['user']: { userModalVisibility }, loading }) => ({
  userModalVisibility,
  modalLoading: !!loading.effects[`login/deleteAccount`] || !!loading.effects[`login/logout`],
}))(DeleteAccount);
