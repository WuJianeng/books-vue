<template>
  <el-container class='home-container'>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/imgs/home.png" alt="header image">
        <span>个人中心</span>
      </div>
    </el-header>
  </el-container>
</template>

<script>

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
</style>
