<template>
  <div class="header">
    <div class="message">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <el-badge :is-dot='letterIsDot'>
            <i class="el-icon-message"></i>
          </el-badge>
        </span>
        <el-dropdown-menu class="message-dropdown" slot="dropdown">
          <el-dropdown-item v-for="(item, index) in recentContact" :key="item.id" @click.native="toMessage(index)">
            <el-badge style="display: block;" :is-dot="item.isDot">
              {{item.name}}
            </el-badge>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="stick"></div>
    <div class="user">
      <!-- <Avatar icon="person" size="large" class="portrait" /> -->
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          {{userInfo.organName}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="setup">设置</el-dropdown-item>
          <el-dropdown-item command="exit">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog title="退出系统" :visible.sync="dialogVisible" width="400px" :append-to-body="true">
      <span>您确实要退出系统？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleExit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import session from '~/assets/js/session';
import local from '~/assets/js/local';
// import WebIm from '../../common/js/im/tim';

// let userInfo = session.getObject('userInfo');
// let loginInfo = {};
// const WEBIM = window.webim;
// loginInfo = {
//   sdkAppID: userInfo.timAppId,
//   appIDAt3rd: userInfo.timAppId,
//   identifier: userInfo.organizationMemberId,
//   userSig: userInfo.timSig
// };
// console.log(loginInfo, WEBIM);

// const operator = session.getObject('operator');
// if (!operator) {
//   window.location.href = './login.html';
// }

const SEARCH_ITEM = new Map([
  ['初审待处理', 'SUBMIT_APPLY'],
  ['初审失败待查看', 'FIRST_TRIAL_DISAGREE'],
  ['人工短信复审待处理', 'FIRST_TRIAL_AGREE'],
  ['预约取消待处理', 'CAMCEL_APPLY']
]);

export default {
  data() {
    return {
      tim: {},
      dialogVisible: false,
      recentContact: [],
      letterIsDot: false,
      SEARCH_ITEM,
      userInfo: {}
    };
  },
  mounted() {
    this.userInfo = session.getObject('userInfo');
  },
  // computed: {
  //   userInfo() {
  //     return session.getObject('userInfo');
  //   }
  // },
  watch: {
    recentContact: {
      deep: true,
      handler(val, oldVal) {
        let _letterIsDot = false;
        for (let i = 0; i < val.length; i++) {
          if (val[i].isDot) {
            _letterIsDot = true;
            break;
          }
        }
        this.letterIsDot = _letterIsDot;
        this.$parent.$refs.asideBar.setDot(_letterIsDot);
      }
    }
  },
  methods: {
    // closeDot(index) {
    //   // 关闭对应红点
    //   this.recentContact[index].isDot = false;
    //   // 查找localStorage对应的id并设置
    //   let key = this.tim.getLocalKey(this.recentContact[index].id);
    //   let temp = local.getObject(key);
    //   temp.unread = false;
    //   local.setObject(key, temp);
    //   this.$parent.$refs.headerNav.recentContact[index].isDot = false;
    // },
    toMessage(index) {
      this.recentContact[index].isDot = false;
      // 设置local中的对应会话unread为false
      // let key = this.tim.getLocalKey(this.recentContact[index].id);
      let key = `${this.userInfo.phone}_${this.recentContact[index].id}`;
      let temp = local.getObject(key);
      temp.unread = false;
      local.setObject(key, temp);
      // this.closeDot(index);
      this.$router.push('/messagenotify');
    },
    handleExit() {
      session.clear();
      this.$router.replace('/login');
    },
    handleCommand(type) {
      if (type === 'exit') {
        this.dialogVisible = true;
      } else if (type === 'setup') {
        this.$router.push('/setup');
      }
    },
    // async logIm() {
    //   let that = this;
    //   this.recentContact = [];
    //   window.webim.logout();
    //   let userInfo = session.getObject('userInfo');
    //   const sdkAppID = userInfo.timAppId;
    //   const userSig = userInfo.timSig;
    //   const accountType = userInfo.timAccountType;
    //   const identifier = userInfo.organizationMemberId;
    //   const logInfo = { sdkAppID, userSig, accountType, identifier };

    //   const webim = window.webim;

    //   function onConnNotify(resp) {
    //     let info;
    //     switch (resp.ErrorCode) {
    //       case webim.CONNECTION_STATUS.ON:
    //         console.log('建立连接成功');
    //         webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
    //         break;
    //       case webim.CONNECTION_STATUS.OFF:
    //         info = '连接已断开，无法收到新消息，请检查下您的网络是否正常: ' + resp.ErrorInfo;
    //         alert(info);
    //         webim.Log.warn(info);
    //         break;
    //       case webim.CONNECTION_STATUS.RECONNECT:
    //         info = '连接状态恢复正常: ' + resp.ErrorInfo;
    //         alert(info);
    //         webim.Log.warn(info);
    //         break;
    //       default:
    //         webim.Log.error('未知连接状态: =' + resp.ErrorInfo);
    //         break;
    //     }
    //   }
    //   async function onMsgNotify(newMessage) {
    //     console.log('新消息来了', newMessage);
    //     let msg = JSON.parse(newMessage[0].toHtml());
    //     let sess = newMessage[0].getSession();
    //     let key = that.tim.getLocalKey(sess.id());
    //     // debugger;
    //     // 检查新消息是否是新会话，如果是就询问服务端该会话是否属于pc
    //     if (local.getObject(key)) {
    //       local.setObject(key, { id: msg.id, unread: true });
    //       // 添加新消息，找到对应会话
    //       for (let i = 0; i < that.recentContact.length; i++) {
    //         if (that.recentContact[i].id === sess.id()) {
    //           that.recentContact[i].messageList.list.push(msg);
    //           that.recentContact[i].isDot = true;
    //         }
    //       }
    //     } else {
    //       // 新会话，询问服务端该会话是否属于pc
    //       let res = await that.tim.checkNewSession(sess.id());
    //       if (res.data.length > 0) {
    //         res.data[0].isDot = true;
    //         res.data[0].messageList = [];
    //         local.setObject(key, { id: msg.id, unread: true });
    //       }
    //     }
    //   }

    //   const listeners = {
    //     'onConnNotify': onConnNotify, // 监听连接状态回调变化事件,必填
    //     'onMsgNotify': onMsgNotify // 监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
    //   };
    //   this.tim = new WebIm(logInfo, listeners);
    //   await this.tim.login();
    //   // 获取最近联系人
    //   let res = await this.tim.getRecentContact();
    //   res.data.forEach(async item => {
    //     // messageList存放消息
    //     item.messageList = [];
    //     let _list = await this.tim.getMessageList('MARKETING_SUBSCRIBE', item.id, 1);
    //     item.messageList = _list.data;
    //     // 添加isDot属性到item
    //     let localKey = this.tim.getLocalKey(item.id);
    //     item.isDot = local.getObject(localKey).unread;
    //     this.recentContact.push(item);
    //   });
    // }
  }
};
</script>
<style>
.el-dropdown-menu__item .is-dot {
  top: 10px !important;
}
</style>

<style scoped>
.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  height: 66px;
  background-color: #51a9fb;
  color: white;
}
.el-dropdown {
  color: white;
  font-size: 16px;
}
.user {
  height: 100%;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-right: 20px;
  cursor: pointer;
}
.message {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.el-icon-message {
  font-size: 18px;
}
.message-dropdown {
  min-width: 150px;
}
.stick {
  width: 2px;
  height: 20px;
  border: 1px solid #ffffff;
  margin-right: 10px;
}
</style>
