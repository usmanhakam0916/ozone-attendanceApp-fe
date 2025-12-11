/* eslint-disable no-param-reassign */
import request from '@/utils/request';
import { message } from 'antd';
import { history } from 'umi';

import { NAME_SPACE } from '../constants';

const initialState = {
  modalState: { visibility: false, record: null },
  groupPolicies: [],
  employees: [],
  data: [],
};

const groupPolicies = {
  namespace: NAME_SPACE,
  state: initialState,
  effects: {
    *fetchGroupPolicies({}, { put }) {
      try {
        let response = yield request.get(`groupPolicies`);
        if (response) {
          response = response.sort((a, b) => a.id - b.id);
          yield put({ type: 'fetchGroupPoliciesSuccess', payload: response });
          yield put({ type: 'setTotal', payload: response.length });
        }
      } catch (error) {
        console.log(error);
      }
    },
    *fetchEmployeeList({ payload: { id } }, { put }) {
      try {
        const response = yield request.get(`groupPolicies/${id}`);

        if (response.statusCode !== 500) {
          const data = response.employees?.map((item) => {
            const employee = JSON.parse(item.authUser.initialData);
            if (employee && employee['Employee No']) {
              const newItem = {
                ...employee,
                ...item,
                key: employee['Employee No'],
                value: `#${employee['Employee No']}-${employee.Name}`,
              };
              return newItem;
            }
            return item;
          });
          yield put({ type: 'fetchEmployeeListSuccess', payload: data });
        }
      } catch (error) {
        console.log(error);
      }
    },
    *getEmployee(
      {
        payload: {
          data: { id },
        },
      },
      { put },
    ) {
      try {
        const response = yield request.get(`employees/search?query=${id}`);
        if (response.length === 0) {
          message.error('Not Found');
        } else {
          const data = response.map((item) => {
            const employee = JSON.parse(item.authUser.initialData);
            if (employee && employee['Employee No']) {
              const newItem = {
                ...employee,
                ...item,
                key: employee['Employee No'],
                value: `#${employee['Employee No']}-${employee.Name}`,
              };
              return newItem;
            }
            return item;
          });
          yield put({ type: 'getEmployeesSuccess', payload: data });
        }
      } catch (e) {
        console.log(e, 'error');
      }
    },
    *createGroupPolicy({ payload: { data } }, { put }) {
      try {
        const response = yield request.post('groupPolicies', { data });
        const groupPolicy = {
          name: response.name,
          checkinTime: response.checkinTime,
          checkoutTime: response.checkoutTime,
          tags: response.tags,
          id: response.id,
          employees: response.employees,
          owner: response.owner,
        };
        message.success('Group Policy Created Successfully');
        yield put({ type: 'createGroupPolicySuccess', payload: groupPolicy });
        yield put({ type: 'showModal', payload: { visibility: false, record: null } });
      } catch (error) {
        console.log(error);
      }
    },
    *updateGroupPolicy({ payload: { data, id, updateEmployees } }, { put }) {
      try {
        const response = yield request.patch(`groupPolicies/${id}`, { data });
        const groupPolicy = {
          name: response.name,
          checkinTime: response.checkinTime,
          checkoutTime: response.checkoutTime,
          tags: response.tags,
          id: response.id,
          employees: response.employees,
          owner: response.owner,
        };
        yield put({ type: 'updateGroupPolicySuccess', payload: groupPolicy });
        if (updateEmployees) {
          message.success('Employees Updated Successfully');
          history.push({
            pathname: `/groupPolicy`,
          });
        } else {
          message.success('Group Policy Updated Successfully');
          yield put({ type: 'showModal', payload: { visibility: false, record: null } });
          // if (id)
          //   history.push({
          //     pathname: `/groupPolicy/${id}`,
          //   });
        }
      } catch (error) {
        console.log(error);
      }
    },
    *deleteGroupPolicy({ payload: { id } }, { put }) {
      try {
        const response = yield request.delete(`groupPolicies/${id}`);
        if (response && response.affected) {
          yield put({ type: 'deleteGroupPolicySuccess', payload: id });
        }
      } catch (error) {
        console.log(error);
      }
    },
  },

  reducers: {
    setTotal(state, action) {
      state.total = action.payload;
    },
    fetchGroupPoliciesSuccess(state, action) {
      state.groupPolicies = action.payload;
    },
    showModal(state, action) {
      state.modalState = action.payload;
    },
    fetchEmployeeListSuccess(state, action) {
      state.data = action.payload || [];
    },
    getEmployeesSuccess(state, action) {
      // const employeeIds = state.employees.map((item) => item.id);
      // action.payload.forEach((item) => {
      //   if (!employeeIds.includes(item.id)) {
      //     state.employees.push(item);
      //   }
      // });
      state.employees = action.payload;
    },
    createGroupPolicySuccess(state, action) {
      state.total += 1;
      state.groupPolicies.push(action.payload);
    },
    updateGroupPolicySuccess(state, action) {
      const index = state.groupPolicies.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.groupPolicies[index] = action.payload;
      }
    },
    deleteGroupPolicySuccess(state, action) {
      state.total -= 1;
      const index = state.groupPolicies.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.groupPolicies.splice(index, 1);
      }
    },
    setEmployeesData(state, action) {
      state.data = [...action.payload];
    },
    deleteEmployeesData(state, action) {
      state.data.splice(action.payload, 1);
    },
    selectEmployee(state, action) {
      const badgeIds = state.data.map((item) => item.key);
      if (!badgeIds.includes(action.payload)) {
        const employee = state.employees.find((item) => item.key === action.payload);
        state.data.push(employee);
      } else message.warn('Record already exists');
    },
    reset: () => initialState,
  },
};

export default groupPolicies;
