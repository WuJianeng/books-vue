<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span=7>
          <el-input placehold="请输入书籍分类" v-model="classParam.className">
            <el-button slot="append" icon="el-icon-search" @click="getBookClassList"></el-button>
          </el-input>
        </el-col>
        <el-col :span=5>
          <el-button type="primary" @click="handleAdd" icon="el-icon-circle-plus-outline"></el-button>
        </el-col>
      </el-row>

      <el-table :data="bookClassList" stripe style="width: 50%" border >
        <el-table-column prop="className" label="分类" align="center"></el-table-column>
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
    <el-dialog title="编辑分类" :visible.sync="editVisible" center>
      <el-form v-model="editParam" :ref="editParam">
        <el-form-item label="分类" prop="className">
          <el-input v-model="editParam.className"></el-input>
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
      bookClassList: [],
      userId: window.sessionStorage.getItem('id'),
      classParam: {
        className: '',
        userId: window.sessionStorage.getItem('id')
      },
      editParam: {
        className: '',
        userId: window.sessionStorage.getItem('id'),
        id: 0
      },
      editMenu: {
        move: 'edit',
        text: '修改'
      },
      editVisible: false,
      index: 0
    }
  },
  created () {
    this.getBookClassList()
  },
  methods: {
    async getBookClassList () {
      const { data } = await this.$http.post('book/class/all', this.classParam)
      this.bookClassList = data
    },
    async addBookClass () {
      const res = await this.$http.post('book/class/add', this.editParam)
      if (res.status !== 200) {
        return this.$message.error('添加分类失败!')
      }
    },
    async updateBookClass (bookClassId) {
      console.log('update')
      this.editParam.id = bookClassId
      console.log(this.editParam)
      const res = await this.$http.post('book/class/update', this.editParam)
      if (res.status !== 200) {
        return this.$message.error('更新分类失败!')
      }
    },
    async deleteBookClass (classId) {
      const res = await this.$http.post(`book/class/delete/${classId}`)
      if (res.status !== 200) {
        this.$message.error('删除分类失败')
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
    // 触发添加分类
    handleAdd () {
      this.editParam.className = ''
      this.setEditMenuStatus(false)
      this.editVisible = true
    },

    handleReset () {
      this.editParam.className = ''
    },
    handleEdit (index, row) {
      this.index = index
      this.editParam.className = row.className
      this.setEditMenuStatus(true)
      this.editVisible = true
    },
    handleDelete (index, row) {
      this.bookClassList.splice(index, 1)
      this.deleteBookClass(row.id)
    },
    submitEdit () {
      if (this.editMenu.move === 'edit') {
        this.updateBookClass(this.bookClassList[this.index].id)
      } else {
        this.addBookClass()
      }
      this.getBookClassList()
      this.editVisible = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
