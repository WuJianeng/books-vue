<template>
  <div>
    <!-- 面包屑视图区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的书籍</el-breadcrumb-item>
      <el-breadcrumb-item>{{ this.address }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- 搜索与添加 -->
          <el-input placeholder="请输入内容" v-model="bookParam.bookName"
            class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getBooksList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <!-- 添加按钮 -->
          <el-button type="primary" @click="handleAddNewBook">添加新书</el-button>
        </el-col>
      </el-row>
      <el-button :disabled="selectedButtonIsDisabled" icon="el-icon-edit" type="primary"
                 @click="editSelection">批量转移</el-button>
      <el-button :disabled="selectedButtonIsDisabled" icon="el-icon-delete" type="danger"
                 @click="deleteDialogIsVisible=true">批量删除</el-button>

      <!-- 书籍表格区域 -->
      <el-table :data="bookList"
        stripe
        style="width: 100%"
        border
        highlight-current-row
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" min-width="5%"></el-table-column>
        <el-table-column type="index" label="序号" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="bookName" label="书名" min-width="30%" align="center"></el-table-column>
        <el-table-column prop="bookClass" label="类型" min-width="10%" align="center"
          :filters="bookClassFilters"
          :filter-method="filterClassTag"></el-table-column>
        <el-table-column prop="readPage" label="已读页数" min-width="10%" align="center"></el-table-column>
        <el-table-column label="操作" min-width="20%" align="center">
          <template v-slot="scope">
            <!-- 对话框用于编辑书籍 -->
            <el-tooltip content="编辑书籍" placement="top" :enterable="false">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)"
                  icon="el-icon-edit"></el-button>
            </el-tooltip>

            <el-tooltip content="删除书籍" placement="top" :enterable="false">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

    <!-- 编辑单本书弹出框 -->
    <el-dialog title="编辑书籍" :visible.sync="editBookVisible" center>
      <el-form :model="editBook" :ref="editBook">
        <el-form-item label="书籍名" prop="bookName">
          <el-input v-model="editBook.bookName"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="bookClassId">
          <el-select v-model="editBook.bookClassId" placeholder="请选择书籍类型">
            <el-option
              v-for='bookClass in bookClassList'
              :key="bookClass.id"
              :label="bookClass.className"
              :value="bookClass.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="已读页数" prop="readPage">
          <el-input-number v-model="editBook.readPage"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEdit(editMenu.move)">{{ editMenu.text }}</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="editBookVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="deleteDialogIsVisible" width="30%">
      <span>确认删除选中书籍 ?</span>
      <span slot="footer" class="dialog-footer" center>
        <el-button type="primary" @click="deleteDialogIsVisible=false">取 消</el-button>
        <el-button type="danger" @click="deleteSelection">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      addressId: this.$route.query.addressId,
      address: this.$route.query.address,
      searchInputText: '',
      bookList: [],
      // 用于书籍分类的过滤
      bookClassFilters: [],
      // 多选
      selectedBooks: [],
      selectedButtonIsDisabled: true,
      bookParam: {
        userId: window.sessionStorage.getItem('id'),
        bookClassId: null,
        addressId: this.$route.query.addressId,
        bookName: ''
      },
      editBookVisible: false,
      deleteDialogIsVisible: false,
      editBook: {
        addressId: this.$route.query.addressId,
        bookName: '',
        bookClassId: 0,
        bookClass: '',
        readPage: 0,
        userId: window.sessionStorage.getItem('id'),
        id: 0,
        selectedIndex: 0
      },
      bookClassList: [],
      editMenu: {
        move: 'edit',
        text: '修改'
      }
    }
  },
  methods: {
    // 重新加载
    reload () {
      this.$forceUpdate()
    },
    // 获取本地址下的所有书籍
    async getBooksList () {
      const data = await this.$http.post('/book/bookinfo/all', this.bookParam)
      if (data.status !== 200) {
        return this.$message.error('获取书籍列表失败')
      }
      this.$message.success('更新书籍列表')
      this.bookList = data.data
    },
    async getBookClass () {
      const userId = sessionStorage.getItem('id')
      const { data } = await this.$http.get(`/book/class/all/${userId}`)
      this.bookClassList = data

      // 更新分类过滤的标签
      for (let i = 0; i < this.bookClassList.length; ++i) {
        const className = this.bookClassList[i].className
        this.bookClassFilters.push({ text: className, value: className })
      }

      console.log(this.bookClassFilters)
    },
    async addBook () {
      const res = await this.$http.post('book/book/add', this.editBook)
      if (res.status !== 200) {
        return this.$message.error('添加书籍失败')
      }
    },
    async updateBook (bookId) {
      const res = await this.$http.post('book/book/update', this.editBook)
      if (res.status !== 200) {
        return this.$message.error('更新书籍信息失败')
      }
    },
    async deleteBook (bookId) {
      const res = await this.$http.post(`book/book/delete/${bookId}`)
      if (res.status !== 200) {
        return this.$message.error('删除书籍失败')
      }
    },
    // 多选变化触发方法
    handleSelectionChange (val) {
      this.selectedBooks = val
      this.selectedButtonIsDisabled = val.length === 0
    },
    // 编辑选中的行
    editSelection () {
      console.log(this.selectedBooks)
    },
    transferSelectedBooksToIds (books) {
      const bookIds = []
      for (let i = 0; i < books.length; ++i) {
        const bookId = books[i].id
        console.log(bookId)
        bookIds.push(bookId)
      }
      return bookIds
    },
    // 删除选中的行
    deleteSelection () {
      const bookIds = this.transferSelectedBooksToIds(this.selectedBooks)
      for (const id of bookIds) {
        console.log(id)
        this.deleteBook(id)
      }
      this.$message.success('批量删除成功')
      this.reload()
    },
    // 标签筛选方法
    filterClassTag (value, row) {
      return row.bookClass === value
    },
    // 初始化编辑书籍信息的弹出框，初始值为该行书籍的默认值
    initEditBook (index) {
      this.editBook.bookName = this.bookList[index].bookName
      this.editBook.bookClassId = this.bookList[index].bookClassId
      this.editBook.bookClass = this.bookList[index].bookClass
      this.editBook.readPage = this.bookList[index].readPage
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
    // 编辑按钮的触发方法，获取书籍种类并初始化EditBook
    handleEdit (index, row) {
      this.getBookClass()
      this.initEditBook(index)
      this.setEditMenuStatus(true)
      this.editBook.id = row.id
      this.editBook.selectedIndex = index
      this.editBookVisible = true
    },
    // 添加新书的触发方法
    handleAddNewBook () {
      this.getBookClass()
      this.setEditMenuStatus(false)
      this.editBookVisible = true
    },
    // 删除按钮的触发方法
    handleDelete (index, row) {
      this.$message(`delete index: ${index} row: ${row}`)
      this.deleteBook(row.id)
      this.bookList.splice(index, 1)
    },
    // URL 地址中地址参数发生变化时，调用本方法更新参数
    refreshAddress () {
      this.addressId = this.$route.query.addressId
      this.bookParam.addressId = this.addressId
      this.address = this.$route.query.address
      this.getBooksList()
    },
    submitEdit () {
      if (this.editMenu.move === 'edit') {
        console.log('提交修改')
        this.updateBook()
      } else {
        this.addBook()
      }
      this.editBookVisible = false
      this.reload()
    },
    handleReset () {
      this.$refs.editBook.resetFields()
    }
  },
  // 监听属性变化
  watch: {
    $route: {
      immediate: true,
      handler () {
        this.refreshAddress()
      }
    }
  },
  created () {
    this.getBookClass()
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 10px;
}

.el-table {
  margin-top: 15px;
}

.el-dialog {
  border-radius: 20px;
}
</style>
