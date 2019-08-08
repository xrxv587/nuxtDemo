<template>
  <div>
    <AsiderBar />
    <div class="content-wrapper">
      <Header />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import session from '../assets/js/session';
import AsiderBar from '../componnets/AsiderBar';
import Header from '../componnets/HeaderNav';

export default {
  components: {
    AsiderBar,
    Header
  }
}
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
html {
  height: 100%;
}
body {
  position: relative;
  min-height: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.content-wrapper {
  margin-left: 220px;
}
.content {
  // padding: 30px;
  position: relative;
}
</style>


