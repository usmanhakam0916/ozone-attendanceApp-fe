import { useState, useEffect } from 'react';
import { isValidId } from '@/utils/utils';

const useFormMode = (id) => {
  const initialState = { isEditMode: false, mode: 'create' };
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (isValidId(id)) {
      setState({ isEditMode: true, mode: 'edit' });
    } else {
      setState(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return state;
};

export default useFormMode;
