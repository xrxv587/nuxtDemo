const EXAM_MANAGE = 'EXAM_MANAGE';
const TRANNING_MANAGE = 'TRANNING_MANAGE';
const CHANNEL_MANAGE = 'CHANNEL_MANAGE';
const EMPLOYEE_MANAGE = 'EMPLOYEE_MANAGE';

// FIRST_NAV 配置一级菜单项
const FIRST_NAV = [
  { name: '考核管理', requestUrl: '/sub1', code: EXAM_MANAGE, sort: 7 },
  { name: '培训管理', requestUrl: '/sub2', code: TRANNING_MANAGE, sort: 7 },
  { name: '渠道管理', requestUrl: '/sub3', code: CHANNEL_MANAGE, sort: 8 },
  { name: '员工管理', requestUrl: '/sub4', code: EMPLOYEE_MANAGE, sort: 8 }
];

// BeLONGTO_FIrST_NAV 这里配置哪些二级菜单属于一级菜单
export const BELONGTO_FIRST_NAV = {
  [EXAM_MANAGE]: ['/library', '/examination', '/tranning', '/trainingLabel'],
  [TRANNING_MANAGE]: ['/classification', '/content'],
  [CHANNEL_MANAGE]: ['/channel', '/contractManage', '/channel/storeAudi'],
  [EMPLOYEE_MANAGE]: ['/organization', '/authorization', '/doctor', '/retiredEmployee']
};

export const addBelongAttrToNav = (permissionList) => {
  let keys = Object.keys(BELONGTO_FIRST_NAV);
  keys.forEach(key => {
    BELONGTO_FIRST_NAV[key].forEach(item1 => {
      permissionList.forEach(permission => {
        if (item1 === permission.requestUrl) {
          permission['belong'] = key;
        }
      });
    });
  });
  return permissionList;
};

export default FIRST_NAV;
