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
          <el-input placeholder="请输入内容" v-model="addressParam.address">
            <el-button slot="append" icon="el-icon-search" @click="getAddressList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="handleAdd">添加地址</el-button>
        </el-col>
      </el-row>
      <el-table :data="addressList" stripe style="width: 50%" border >
        <el-table-column prop="address" label="地址" align="center"></el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template v-slot="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)"
                       icon="el-icon-edit">
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)"
                       icon="el-icon-delete">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 弹出框 -->
    <el-dialog title="编辑地址" :visible.sync="editVisible" center>
      <el-form :model="addressInfo" :ref="addressInfo">
        <el-form-item label="地址" prop="address">
          <el-input v-model="addressInfo.address"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item>
          <el-button type="primary" @click="submitEdit(editMenu.move)">{{ editMenu.text }}</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="editVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      addressList: [],

      addressParam: {
        userId: window.sessionStorage.getItem('id'),
        address: ''
      },

      addressInfo: {
        userId: window.sessionStorage.getItem('id'),
        address: ''
      },

      editVisible: false,

      editMenu: {
        move: 'edit',
        text: '修改'
      }
    }
  },

  created () {
    this.getAddressList()
  },

  methods: {
    async getAddressList () {
      const { data: res } = await this.$http.post('address/all', this.addressParam)
      this.addressList = res
      console.log(this.addressList)
    },

    async addAddress () {
      await this.$http.post('address/add', this.addressInfo)
      await this.getAddressList()
    },

    async deleteAddress (addressId) {
      const res = await this.$http.post(`address/delete/${addressId}`)
      if (res.status !== 200) {
        return this.$message.error('地址删除失败')
      }
    },

    // 设置弹出框中是修改还是添加书籍
    setEditMenuStatus (isEdit) {
      if (isEdit) {
        this.editMenu.move = 'edit'
        this.editMenu.text = '修改'
      } else {
        this.editMenu.move = 'add'
        this.editMenu.text = '添加'
      }
    },

    submitEdit () {
      if (this.editMenu.move === 'edit') {
        console.log('提交修改')
      } else {
        console.log('提交添加')
      }
      console.log(this.editBook)
    },

    handleEdit (index, row) {
      this.setEditMenuStatus(true)
      this.editVisible = true
    },

    handleAdd () {
      this.setEditMenuStatus(false)
      this.editVisible = true
    },

    handleReset () {
      this.$refs.addressInfo.resetFileds()
    },

    handleDelete (index, row) {
      console.log(row)
      const addressId = row.id
      this.deleteAddress(addressId)
      this.refresh()
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

.el-table {
  text-align-all: center;
  margin-top: 10px;
}
</style>
