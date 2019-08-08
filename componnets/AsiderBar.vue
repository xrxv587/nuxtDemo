<template>
  <div class="asider">
    <div class="logo">
      <img src='../assets/images/logoSmall.png'>中清营销管家
    </div>
    <el-menu :default-active="$route.path" class="main-menu" router>
      <el-menu-item v-for="(item, index) in permissions" :key="item.code" :index="item.requestUrl" @click="passIndex(index)" v-if="item.code !== 'home' && item.type !== 'APP'">
        <!-- 导航栏的icon图标classname规则为：icon + 服务端返回permissionList中的code -->
        <i class="icon-asider icon-organization" :class="'icon-' + item.code"></i>
        <el-badge :is-dot="letterIsDot" v-if="item.code === 'messagenotify'">{{item.name}}</el-badge>
        <span v-else>{{item.name}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import sessions from '~/assets/js/session';

const HOME = '/home';
const RESERVE = '/reserve';
const DOCTOR = '/doctor';
const ORGANIZATION = '/organization';
const SETUP = '/setup';
const AUTHORIZATION = '/authorization';
const CONTENT = '/content';
const CLASSIFICATION = '/classification';
const MESSAGENOTIFY = '/messagenotify';

export default {
  computed: {
    // defaultActive() {
    //   return '/' + window.location.hash.substring(1).split('/')[1];
    // },
    // permissions() {
    //   return sessions.getObject('userInfo').permissions;
    // }
  },
  mounted() {
    this.permissions = sessions.getObject('userInfo').permissions;
  },
  data() {
    return {
      HOME,
      RESERVE,
      DOCTOR,
      ORGANIZATION,
      SETUP,
      AUTHORIZATION,
      CONTENT,
      CLASSIFICATION,
      MESSAGENOTIFY,
      letterIsDot: false,
      permissions: []
    };
  },
  methods: {
    passIndex(index) {
      // console.log(this.permissions[index]);
      sessions.setObject('currentNav', this.permissions[index]);
    },
    setDot(isDot) {
      this.letterIsDot = isDot;
    }
  }
};
</script>
<style>
.asider sup {
  top: 25px !important;
}
</style>
<style lang='scss' scoped>
.asider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 220px;
  background-color: white;
}
.logo {
  height: 66px;
  line-height: 66px;
  background-position: 20px 50%;
  font-size: 18px;
  text-align: center;
  padding-right: 20px;
  background-color: #1989fa;
  color: white;
  img {
    vertical-align: middle;
    margin-right: 10px;
  }
}
.el-menu-item {
  color: #333333 !important;
  font-size: 16px;
}
.el-menu-item.is-active {
  color: #1989fa !important;
  background-color: #f8fbff !important;
}
.el-menu-item:hover {
  background-color: #f8fbff !important;
}
// .main-menu {
//   overflow: auto;
// }
.icon-asider {
  width: 20px;
  display: inline-block;
}
.icon-asider:before {
  content: '';
  position: absolute;
  top: 20px;
  width: 20px;
  height: 20px;
}
.icon-organization:before {
  content: '';
  background: url('../assets/images/organization_hui.png') no-repeat;
}
.icon-reserve:before {
  content: '';
  background: url('../assets/images/reserve_hui.png') no-repeat;
}
.icon-doctor:before {
  content: '';
  background: url('../assets/images/doctor_hui.png') no-repeat;
}
.icon-permission:before {
  content: '';
  background: url('../assets/images/permission_hui.png') no-repeat;
}
.icon-setup:before {
  content: '';
  background: url('../assets/images/setup_hui.png') no-repeat;
}
.icon-messagenotify:before {
  content: '';
  background: url('../assets/images/messagenotify_hui.png') no-repeat;
}
.el-menu-item.is-active {
  .icon-organization:before {
    content: '';
    background: url('../assets/images/organization_lan.png') no-repeat;
  }
  .icon-reserve:before {
    content: '';
    background: url('../assets/images/reserve_lan.png') no-repeat;
  }
  .icon-doctor:before {
    content: '';
    background: url('../assets/images/doctor_lan.png') no-repeat;
  }
  .icon-permission:before {
    content: '';
    background: url('../assets/images/permission_lan.png') no-repeat;
  }
  .icon-setup:before {
    content: '';
    background: url('../assets/images/setup_lan.png') no-repeat;
  }
  .icon-messagenotify:before {
    content: '';
    background: url('../assets/images/messagenotify_lan.png') no-repeat;
    background-size: 100%;
  }
}
</style>
