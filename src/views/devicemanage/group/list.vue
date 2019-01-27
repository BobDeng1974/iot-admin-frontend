<template>
  <el-card class="card">
    <div slot="header" class="clearfix">
      <span>分组管理</span>
      <div style="float:right;">
        <el-button
          size="small"
          class="filter-item"
          icon="el-icon-refresh"
          @click="refresh">刷新</el-button>

        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="addGroupDialogVisible=true">
          新建分组
        </el-button>
      </div>
    </div>

    <div >

      <!-- 过滤器 -->
      <div class="filter-container">
        <el-input
          v-model="listQuery.name__icontains"
          :clearable="true"
          size="small"
          placeholder="分组名称"
          style="width: 200px;"
          class="filter-item"
          @clear = "clear"
          @keyup.enter.native="search" />

        <el-button
          class="filter-item"
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="search">搜索
        </el-button>
      </div>

      <tree-table
        :data="data"
        :colums="colums"
        :expand-all="false"
        border>
        <el-table-column label="分组名称">
          <template slot-scope="scope">
            <span >{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span >{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="groupDetail(scope.row)">查看</el-button>
            <el-button type="text" @click="deleteGroup(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </tree-table>

      <!-- 分页器 -->
      <el-pagination
        v-show="total>0"
        :total="total"
        :page-size="listQuery.limit"
        layout="prev, pager, next"
        @current-change="currentChange" />

      <!-- 新建分组弹出框 -->
      <el-dialog
        :visible.sync="addGroupDialogVisible"
        title="新建分组">

        <!-- 表单区域 -->
        <el-form
          ref="addGroupForm"
          :model="addGroupForm"
          :rules="rules"
          style="width: 620px; margin-left:50px;">

          <el-form-item
            label-width="120px"
            label="上级分组"
            prop="parent">
            <el-cascader
              :options="data"
              v-model="addGroupForm.parentList"
              :props="props"
              change-on-select
              placeholder="选择上级分组"
              expand-trigger="hover"
            />
          </el-form-item>

          <el-form-item
            label-width="120px"
            label="分组名称"
            prop="name">
            <el-input v-model="addGroupForm.name" placeholder="请输入分组名称" />
          </el-form-item>

          <el-form-item
            label-width="120px"
            label="分组描述"
            prop="desc">
            <el-input
              v-model="addGroupForm.desc"
              rows="5"
              type="textarea"
              placeholder="请输入分组描述" />
          </el-form-item>
        </el-form>

        <!-- 表单footer -->
        <div
          slot="footer"
          class="dialog-footer">
          <el-button @click="addGroupDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="createGroup">确 定</el-button>
        </div>
      </el-dialog>

    </div>

  </el-card>
</template>

<script>

import { getGroupTree, deleteGroup, createGroup } from '@/api/group'
import TreeTable from '@/components/TreeTable'

export default {
  components: {
    TreeTable
  },
  data() {
    return {
      data: [],
      props: {
        value: 'id',
        label: 'name'
      },
      list: null,
      groupList: [],
      total: 0,
      listLoading: true,
      addGroupDialogVisible: false,
      addGroupForm: {},
      listQuery: {
        page: 1,
        limit: 10,
        name__icontains: ''
      },
      rules: {
        name: [
          { required: true, message: '分组名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    getListData() {
      this.listLoading = true
      getGroupTree(this.listQuery).then((res) => {
        this.data = res.data
        console.log(this.data)
      })
    },
    currentChange: function(val) {
      this.listQuery.page = val
      this.getListData()
    },
    // 处理搜索
    search() {
      this.getListData()
    },
    clear() {
      this.getListData()
    },
    refresh() {
      this.getListData()
    },
    // 查看分组详情
    groupDetail(row) {
      this.$router.push({ name: 'GroupDetail', params: { id: row.id }})
    },
    // 删除分组
    deleteGroup(row) {
      this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGroup(row.id)
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功设备!'
            })
            this.getListData()
          })
          .catch(() => {
            this.$message({
              type: 'success',
              message: `删除设备失败`
            })
          })
      })
    },
    resetForm() {
      this.addGroupForm = {}
      this.batchaddGroupForm = { addType: '自动生成', count: 1 }
    },
    createGroup() {
      this.$refs['addGroupForm'].validate((valid) => {
        if (valid) {
          // cascader选中值为所有路径的列表，取到最后一个值即可
          if (this.addGroupForm.parentList) {
            this.addGroupForm.parent = this.addGroupForm.parentList.pop()
          }
          this.addGroupDialogVisible = false
          createGroup(this.addGroupForm)
            .then(() => {
              this.$message({
                type: 'success',
                message: '创建分组成功!'
              })
              this.getListData()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '创建分组失败!'
              })
              this.getListData()
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  margin: 20px;
}
</style>
