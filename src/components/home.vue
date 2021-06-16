<template>
  <el-container class='home-container'>

  <!-- 头部区域 -->
  <el-header>
    <div>
      <img src="../assets/imgs/home.png" alt="header image">
      <span>书籍管理</span>
    </div>
    <el-dropdown split-button type="primary" class="user-menu" @command="handleCommand">
      我的账户
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="user">个人中心</el-dropdown-item>
        <el-dropdown-item command="login">登录</el-dropdown-item>
        <el-dropdown-item command="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-header>

  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse? '64px': '200px'">
      <div class="toggle-button" @click='toggleCollapse'>|||</div>

      <!-- 侧边栏菜单区域 -->
      <el-menu
        class="el-menu-vertical-demo"
        background-color="#333744"
        text-color="#fff"
        active-text-color="#ffd04b"
        unique-opened
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        >

        <!-- 一级菜单 我的书籍 部分 -->
        <el-submenu index="/books" @open='refreshBooks'>
          <template slot="title">
              <i class="el-icon-notebook-1"></i>
              <span slot="title">我的书籍</span>
          </template>
          <el-menu-item :index='"/books/" + item.id' v-for='item in addressList' :key='item.id'
          :route="{ path: '/books', query: { addressId: item.id, address: item.address } }">
            <template slot="title">
              <!-- 图标 -->
              <i class='el-icon-location'></i>
              <!-- 文本 -->
              <span>{{item.address}}</span>
            </template>
          </el-menu-item>
        </el-submenu>

        <!-- 一级菜单 地址管理 -->
        <el-menu-item index="/address">
          <i class="el-icon-location"></i>
          <span slot="title">地址管理</span>
        </el-menu-item>

        <!-- 一级菜单 书籍分类管理 -->
        <el-menu-item index="/class">
          <i class="el-icon-paperclip"></i>
          <span slot="title">分类管理</span>
        </el-menu-item>

        <!-- 一级菜单 数据统计 -->
        <el-menu-item index="/report">
          <i class="el-icon-document"></i>
          <span slot="title">数据统计</span>
        </el-menu-item>

      </el-menu>
    </el-aside>

    <!-- 右侧主体区域 -->
    <el-main>
      <!-- 占位符，存放主页内容 -->
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      addressList: [],
      isCollapse: false
    }
  },

  created () {
    this.getAddressList()
  },

  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getAddressList () {
      // 解构，提取返回信息中的 body 部分
      const id = window.sessionStorage.getItem('id')
      const { data: res } = await this.$http.get(`address/all/${id}`)
      // console.log(res)
      this.addressList = res
    },

    refreshBooks () {
      this.getAddressList()
    },

    // 点击按钮，实现侧边菜单的折叠和展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },

    // 下拉菜单控制
    handleCommand (command) {
      switch (command) {
        case 'logout': {
          this.logout()
          break
        }
        case 'user': {
          this.$router.push('/user')
          break
        }
      }
      this.$message('click on item ' + command)
    }
  }
}
</script>

<style lang="less" scoped>
 .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0%;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
    max-width: 200px;
    .el-menu {
      border-right: none;
      max-width: 200px;
    }
  }

  .el-main {
    background-color: #EAEDF1;
  }
  .home-container {
    height: 100%;
  }

   .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }

  .toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
