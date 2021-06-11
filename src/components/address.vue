<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>地址管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="addressInfo.address">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addAddress">添加地址</el-button>
        </el-col>
      </el-row>
      <div v-for='address in addressList' :key="address.address" class="text item">
        {{ address.address }}
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      addressList: [],

      addressInfo: {
        user_id: 8,
        address: ''
      }
    }
  },

  created () {
    this.getAddressList()
  },

  methods: {
    async getAddressList () {
      const { data: res } = await this.$http.get('address/8')
      this.addressList = res
    },

    async addAddress () {
      console.log(this.addressInfo)
      const { data: res } = await this.$http.post('address/add', this.addressInfo)
      console.log(res)
      this.getAddressList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}

.el-card {
  box-shadow: 0 1px 1px rgb(0, 0, 0, 0.15) !important;
}
</style>
