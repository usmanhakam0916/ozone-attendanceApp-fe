// import { history } from 'umi';
import { Tooltip } from 'antd';
// import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { getDateFormatterWithoutKey, getNumberSorter, getStringSorter } from '@/utils/sorters';
// import { NAME_SPACE } from './constants';

// import edit from '../../../public/edit.svg';
// import DeleteIcon from '../../../public/delete.svg';
import printLogo from '../../../public/print.svg';

export const getColumns = ({
  // dispatch,
  userRole,
}) => [
  userRole === 'admin'
    ? {
        title: 'Location Id',
        dataIndex: 'id',
        width: '8%',
        sorter: getNumberSorter('id'),
        key: '1',
      }
    : { title: '', width: '1%', key: '1' },
  {
    title: 'Name',
    dataIndex: 'name',
    width: '25%',
    sorter: getStringSorter('name'),
    key: userRole === 'admin' ? '2' : '1',
  },
  {
    title: 'Lat/Long',
    width: '20%',
    render: (_, object) =>
      `${object?.lat && object?.long ? `${object.lat}, ${object?.long}` : 'N/A'}`,
    key: '3',
  },
  {
    title: 'QR Code',
    width: '20%',
    ellipsis: true,
    render: (_, object) => (
      <div style={{ 
        maxWidth: 200, 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        whiteSpace: 'nowrap' 
      }}>
        {object?.qrCode ? object?.qrCode : 'N/A'}
      </div>
    ),
    key: '4',
  },
  userRole === 'admin'
    ? {
        title: 'Created By',
        width: '15%',
        render: (_, object) =>
          `${object?.admin?.authUser?.username ? object.admin.authUser.username : 'N/A'}`,
        sorter: (a) => getDateFormatterWithoutKey(a),
        key: userRole === 'admin' ? '5' : '4',
      }
    : { title: '', width: '1%', key: '1' }
  //   userRole === 'admin'?
  //   {
  //   title: 'Lat/Action',
  //   width: '20%',
  //   render: (_, object) =>
  //     `${object?.lat && object?.long ? `${object.lat}, ${object?.long}` : 'N/A'}`,
  //   key: '5',
  // }: { title: '', width: '1%', key: '1' },
  // userRole === 'admin'
  //   ? {
  //       title: 'Action',
  //       key: userRole === 'admin' ? '6' : '5',
  //       render: (_, object) => (
  //         <div>
  //           {/* <Tooltip placement="top" title="Edit Location">
  //             <img
  //               src={edit}
  //               alt="edit"
  //               onClick={() => {
  //                 dispatch({
  //                   type: `${NAME_SPACE}/setBankModalVisible`,
  //                   payload: {
  //                     visible: true,
  //                     id: object.id,
  //                   },
  //                 });
  //               }}
  //               style={{ marginRight: 10, cursor: 'pointer' }}
  //             />
  //           </Tooltip> */}
  //           <Tooltip placement="top" title="Print Location">
  //             <img
  //               src={printLogo}
  //               alt="printLogo"
  //               onClick={() => {
  //                 window.open(
  //                   `${window.location.origin}/locationPrint?location=${
  //                     object.name
  //                   }&qrcode=${object.qrCode.replace(/\+/g, 'plus_sign')}`,
  //                 );
  //               }}
  //               style={{ marginRight: 10, cursor: 'pointer' }}
  //             />
  //           </Tooltip>
  //         </div>
  //       ),
  //     }
  //   : { title: '', width: '1%', key: '1' },

  // {
  //   title: 'Action',
  //   key: '6',
  //   render: (_, { id }) => (
  //     <div>
  //       <Tooltip placement="top" title="Edit Location">
  //         <img
  //           src={edit}
  //           alt="logo"
  //           onClick={() => {
  //             dispatch({
  //               type: `${NAME_SPACE}/setBankModalVisible`,
  //               payload: {
  //                 visible: true,
  //                 id,
  //               },
  //             });
  //           }}
  //           style={{ marginRight: 10, cursor: 'pointer' }}
  //         />
  //       </Tooltip>

  //       {/* <Popconfirm
  //         placement="top"
  //         title="Are you sure to delete?"
  //         onConfirm={() => {
  //           dispatch({
  //             type: `${NAME_SPACE}/deleteBank`,
  //             payload: {
  //               id,
  //             },
  //           });
  //         }}
  //         okText="Yes"
  //         cancelText="No"
  //       >
  //         <img style={{ cursor: 'pointer' }} src={DeleteIcon} alt="logo" />
  //       </Popconfirm> */}
  //     </div>
  //   ),
  // },
];
