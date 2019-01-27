<template>
  <el-card class="card">
    <div slot="header" class="clearfix">
      <span>产品列表</span>
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
          @click="dialogFormVisible=true">添加产品</el-button>
      </div>
    </div>

    <div >
      <!-- 过滤器 -->
      <div class="filter-container">
        <el-input
          v-model="listQuery.name__icontains"
          :clearable="true"
          size="small"
          placeholder="产品名称"
          style="width: 200px;"
          class="filter-item"
          @clear = "clear"
          @keyup.enter.native="search" />

        <el-button
          class="filter-item"
          type="primary"
          size="small"

          icon="el-icon-search"
          @click="search">搜索</el-button>

      </div>

      <!-- 表格 -->
      <el-table
        v-loading="listLoading"
        :data="list"
        size="small"
        border
        stripe
        element-loading-text="Loading"
        fit
        highlight-current-row>
        <el-table-column label="产品名称">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column
          label="产品版本"
          align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.version }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="ProductKey"
          align="center">
          <template slot-scope="scope">{{ scope.row.product_key }}</template>
        </el-table-column>
        <el-table-column
          label="设备数"
          align="center">
          <template slot-scope="scope">{{ scope.row.device_count }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="created_time"
          label="添加时间">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.create_time | datetimeFormat }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
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
        @current-change="currentChange" />

      <!-- 添加产品弹出框 -->
      <el-dialog
        :visible.sync="dialogFormVisible"
        title="添加产品">

        <!-- 表单区域 -->
        <el-form
          ref="form"
          :model="productForm"
          :rules="rules"
          style="width: 620px; margin-left:50px;">
          <el-form-item
            label-width="120px"
            label="产品名称"
            prop="name">
            <el-input v-model="productForm.name" />
          </el-form-item>

          <el-form-item
            label-width="120px"
            label="产品版本"
            prop="version">
            <el-input v-model="productForm.version" />
          </el-form-item>

          <el-form-item
            label-width="120px"
            label="产品描述"
            product="product_desc">
            <el-input
              v-model="productForm.product_desc"
              :rows="5"
              placeholder="请输入产品描述（最多100个字符）"
              type="textarea" />
          </el-form-item>
        </el-form>

        <!-- 表单footer -->
        <div
          slot="footer"
          class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="createProduct">确 定</el-button>
        </div>
      </el-dialog>

    </div>

  </el-card>
</template>

<script>
import { parseTime } from '@/utils'
import { getProductList, deleteProduct, createProduct } from '@/api/product'

export default {
  filters: {
    datetimeFormat(datetime) {
      return parseTime(datetime)
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
          { required: true, message: '产品名称不能为空', trigger: 'blur' }
        ],
        version: [
          { required: true, message: '请输入产品版本号', trigger: 'blur' }
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
    // 查看产品详情
    productDetail(row) {
      this.$router.push({ name: 'ProductDetail', params: { id: row.id }})
    },
    // 删除产品
    deleteProduct(row) {
      // 如果产品中已包含了设备，则提示禁止删除
      if (row.device_count && row.device_count > 0) {
        this.$message({
          type: 'warning',
          message: '产品中已包含设备，无法进行删除，删除产品必须先删除产品中已添加的设备!'
        })
        return
      }

      this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProduct(row.id)
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功产品!'
            })
            this.getListData()
          })
          .catch(() => {
            this.$message({
              type: 'success',
              message: `删除产品失败`
            })
          })
      })
    },
    resetForm() {
      this.productForm = {}
    },
    createProduct() {
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

<style lang="scss" scoped>
.card {
  margin: 20px;
}
</style>
