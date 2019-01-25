<template>
  <div class="app-container">

    <!-- 过滤器 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name__icontains"
        placeholder="产品名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleSearch" />

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleSearch">搜索</el-button>

      <div style="float:right;">
        <el-button
          class="filter-item"
          icon="el-icon-refresh"
          @click="handleRefresh">刷新</el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="dialogFormVisible=true">创建产品</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column label="产品名称">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column
        label="产品版本"
        width="110"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="ProductKey"
        width="110"
        align="center">
        <template slot-scope="scope">{{ scope.row.product_key }}</template>
      </el-table-column>
      <el-table-column
        label="设备数"
        width="110"
        align="center">
        <template slot-scope="scope">{{ scope.row.device_count }}</template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="节点类型"
        width="110"
        align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_time"
        label="添加时间"
        width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="productDetail(scope.row)">查看
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteProduct(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      v-show="total>0"
      :total="total"
      :page-size="listQuery.limit"
      layout="prev, pager, next"
      @current-change="handleCurrentChange" />

    <!-- 添加产品弹出框 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      title="添加产品">

      <!-- 表单区域 -->
      <el-form ref="form" :model="productForm" :rules="rules" style="width: 620px; margin-left:50px;">
        <el-form-item label-width="120px" label="产品名称" prop="name">
          <el-input v-model="productForm.name"/>
        </el-form-item>

        <el-form-item label-width="120px" label="产品版本" prop="version">
          <el-input v-model="productForm.version"/>
        </el-form-item>

        <el-form-item label-width="120px" label="产品描述" product="product_desc">
          <el-input
            v-model="productForm.product_desc"
            :rows="5"
            placeholder="请输入产品描述（最多100个字符）"
            type="textarea"
          />
        </el-form-item>
      </el-form>

      <!-- 表单footer -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getProductList, deleteProduct, createProduct } from '@/api/product'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
      productForm: {},
      listQuery: {
        page: 1,
        limit: 10,
        name__icontains: ''
      },
      rules: {
        name: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        version: [
          { required: true, message: '请输入产品版本号', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
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
      getProductList(this.listQuery).then(response => {
        this.total = response.data.count
        this.list = response.data.results
        this.listLoading = false
      })
    },
    handleCurrentChange: function(val) {
      this.listQuery.page = val
      this.getListData()
    },
    // 处理搜索
    handleSearch() {
      this.getListData()
    },
    handleRefresh() {
      this.getListData()
    },
    // 查看产品详情
    productDetail(row) {
      this.$router.push({ name: 'ProductDetail', params: { id: row.id }})
    },
    // 删除产品
    deleteProduct(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProduct(row.id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getListData()
        })
      })
    },
    resetForm() {
      this.productForm = {}
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          createProduct(this.productForm)
            .then(() => {
              this.$message({
                type: 'success',
                message: '创建产品成功!'
              })
              this.getListData()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '创建产品失败!'
              })
              this.getListData()
            })
        }
      })
    }
  }
}
</script>
