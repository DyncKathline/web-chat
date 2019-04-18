<template>
  <div class="hello">
    <div>
      <div class="item">
        <mu-text-field v-model="createRoomName" placeholder="Please input......"></mu-text-field>
        <div class="btn" @click="createRoom">创建房间</div>
      </div>
      <div class="item">
        <mu-text-field v-model="joinRoomName" placeholder="Please input......"></mu-text-field>
        <div class="btn" @click="joinRoom">加入房间</div>
      </div>
      <mu-list>
        <mu-sub-header>最近聊天记录</mu-sub-header>
        <mu-list-item :title="item.roomId&&item.roomId.name" v-for="(item, index) in roomList" @click="chatwindow(item.roomId._id)">
          <div class="avatar" slot="leftAvatar">
            <span class="tip" v-if="item.unRead&&item.unRead!==0">{{item.unRead > 99 ? '99+' : item.unRead}}</span>
            <mu-avatar :src="item.roomId&&item.roomId.src"/>
          </div>
          <mu-icon value="chat_bubble" slot="right"/>
        </mu-list-item>
      </mu-list>
      <mu-divider/>
      <mu-list>
        <mu-sub-header>客服</mu-sub-header>
        <mu-list-item title="客服大白(微信群，作者联系方式，找我)" @click="chatRobot()">
          <mu-avatar :src="robot" slot="leftAvatar"/>
          <mu-icon value="chat_bubble" slot="right"/>
        </mu-list-item>
      </mu-list>
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import {ROBOT_URL} from "../const/index";
  import socket from "../socket";
  import {getUserRoomList, createRoom, joinRoom} from '../api/server.js';

  export default {
    data() {
      return {
        roomList: [],
        robot: ROBOT_URL,
        createRoomName: '',
        joinRoomName: '',
      };
    },
    mounted() {
      this.$store.commit("setTab", true);
      // 登录了,发送进入信息。
      if (this.userid) {
        this.getUserRoomList();
//        socket.on("roomList", roomList => {
//          console.log('roomList', roomList);
//          this.roomList = roomList;
//        });
        // 处理未读消息
        socket.on("count", userCount => {
          this.$store.commit("setUnread", userCount);
          console.log(userCount);
        });
      }
    },
    methods: {
      createRoom() {
        createRoom({userId: this.userid, name: this.createRoomName}).then(res => {
          if(res.data.code == 200) {
            this.$Toast({
              content: '创建房间成功',
              timeout: 3000,
              background: "#2196f3"
            });
            this.getUserRoomList();
          }else {
            this.$Alert({
              show: true,
              content: this.$errorCode[res.data.code]
            });
          }
        });
      },
      joinRoom() {
        joinRoom({userId: this.userid, name: this.joinRoomName}).then(res => {
          if(res.data.code == 200) {
            this.$Toast({
              content: '加入房间成功',
              timeout: 3000,
              background: "#2196f3"
            });
//            this.chatwindow(res.data.data._id);
          }else {
            this.$Alert({
              show: true,
              content: this.$errorCode[res.data.code]
            });
          }
        });
      },
      getUserRoomList() {
        getUserRoomList({userId: this.userid}).then(res => {
          console.log('getUserRoomList', res);
          if(res.data.code == 200) {
            this.roomList = res.data.data;
          }
        });
      },
      chatwindow(roomID) {
        const uerId = this.userid;
        if (!uerId) {
          this.$Confirm({
            show: true,
            title: "提示",
            content: "聊天请先登录，但是你可以查看聊天记录哦~"
          }).then(res => {
            if (res === "submit") {
              this.$router.push({path: "login"});
            }
          });
        }
        this.$store.commit("setTab", false);
        this.$router.push({path: "/chat", query: {roomId: roomID}});
      },
      chatRobot() {
        this.$store.commit("setTab", false);
        this.$router.push({path: "/robot"});
      }
    },
    computed: {
      ...mapState({
        userid: state => state.userInfo.userid,
        src: state => state.userInfo.src,
        unRead: state => state.unRead,
      })
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  .item {
    width: 100%;
    margin: 10px 10px 0 10px;
  }
  .btn {
    display: inline-block;
    padding: 0 8px;
    height: 40px;
    border: 1px solid rgba(255, 255, 255, 0.38);
    background: #095efb;
    color: #fff;
    line-height: 40px;
    text-align: center;
    vertical-align: middle;
    border-radius: 4px;
  }
  .avatar {
    position: relative;

    .tip {
      position: absolute;
      right: -5px;
      top: -8px;
      padding: 0px 5px;
      border-radius: 10px;
      line-height: 20px;
      text-align: center;
      background: #ff2a2a;
      color: #fff;
      font-size: 12px;
    }

    .mu-avatar {
      img {
        border-radius: 5px;
      }
    }
  }
</style>
