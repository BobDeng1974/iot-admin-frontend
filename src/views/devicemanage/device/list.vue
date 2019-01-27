<template>
  <el-card class="card">
    <div slot="header" class="clearfix">
      <span>设备列表</span>
      <div style="float:right;">
        <el-button
          size="small"
          class="filter-item"
          icon="el-icon-refresh"
          @click="refresh">刷新</el-button>

        <el-button
          class="filter-item"
          type="plain"
          icon="el-icon-plus"
          size="small"
          @click="batchAddDialogVisible=true">
          批量添加
        </el-button>

        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="addDialogVisible=true">
          添加设备
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
          placeholder="设备名称"
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
        <el-table-column label="设备名称">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>

        <el-table-column
          align="center"
          label="设备所属产品">
          <template slot-scope="scope">
            <span v-if="scope.row.product_detail">{{ scope.row.product_detail.name }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
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
              @click="deviceDetail(scope.row)">查看
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteDevice(scope.row)">删除
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

      <!-- 添加设备弹出框 -->
      <el-dialog
        :visible.sync="addDialogVisible"
        title="添加设备">

        <!-- 表单区域 -->
        <el-form
          ref="addDeviceForm"
          :model="addDeviceForm"
          :rules="rules"
          style="width: 620px; margin-left:50px;">

          <el-form-item
            label-width="120px"
            label="所属产品"
            prop="product">
            <el-select v-model="addDeviceForm.product" placeholder="请选择">
              <el-option
                v-for="item in productList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>

          <el-form-item
            label-width="120px"
            label="设备名称"
            prop="name">
            <el-input v-model="addDeviceForm.name" placeholder="请输入设备名称" />
            <span style="color:#999;font-size:14px;">设备名可以为空，如果为空，系统将颁发全局唯一标识符作为设备名</span>
          </el-form-item>

        </el-form>

        <!-- 表单footer -->
        <div
          slot="footer"
          class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="createDevice">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 批量添加设备弹出框 -->
      <el-dialog
        :visible.sync="batchAddDialogVisible"
        title="批量添加设备">

        <!-- 表单区域 -->
        <el-form
          ref="batchAddDeviceForm"
          :model="batchAddDeviceForm"
          :rules="rules"
          style="width: 620px; margin-left:50px;">

          <el-form-item
            label-width="120px"
            label="所属产品"
            prop="product">
            <el-select v-model="batchAddDeviceForm.product" placeholder="请选择">
              <el-option
                v-for="item in productList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>

          <el-form-item
            label-width="120px"
            label="添加方式"
            prop="resource">
            <el-radio-group v-model="batchAddDeviceForm.addType" size="small">
              <el-radio-button label="自动生成"/>
              <el-radio-button label="批量上传"/>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            v-if="batchAddDeviceForm.addType==='自动生成'"
            label-width="120px"
            label="设备数量"
          >
            <el-input-number v-model="batchAddDeviceForm.count" :min="1" :max="500" size="small" label="描述文字"/>
            <p v-if="batchAddDeviceForm.addType==='自动生成'" style="color:#999;font-size:14px;">设备名可以为空，如果为空，系统将颁发全局唯一标识符作为设备名</p>
          </el-form-item>

          <el-form-item
            v-if="batchAddDeviceForm.addType==='批量上传'"
            label-width="120px"
            label="上传文件"
            prop="file">
            <el-upload
              :file-list="fileList"
              accept=".csv,.CSV,"
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传csv文件，且不超过1M</div>
            </el-upload>
            <p v-if="batchAddDeviceForm.addType==='批量上传'" style="color:#999;font-size:14px;">
              单个文件不超过1M,一次最多包含500条记录,<a class="download-template-link" href="http://www.baidu.com/">下载.csv模板</a>
            </p>
          </el-form-item>

        </el-form>

        <!-- 表单footer -->
        <div
          slot="footer"
          class="dialog-footer">
          <el-button @click="batchAddDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="batchCreateDevice">确 定</el-button>
        </div>
      </el-dialog>

    </div>

  </el-card>
</template>

<script>
import { parseTime } from '@/utils'
import { getDeviceList, deleteDevice, createDevice, batchCreateDevice } from '@/api/device'
import { getProductList } from '@/api/product'

export default {
  filters: {
    datetimeFormat(datetime) {
      return parseTime(datetime)
    }
  },
  data() {
    return {
      list: null,
      productList: [],
      fileList: [],
      total: 0,
      listLoading: true,
      addDialogVisible: false,
      batchAddDialogVisible: false,
      addDeviceForm: {},
      batchAddDeviceForm: { addType: '自动生成', count: 1 },
      listQuery: {
        page: 1,
        limit: 10,
        name__icontains: ''
      },
      rules: {
        product: [
          { required: true, message: '所属产品不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getListData()
    getProductList().then((res) => {
      this.productList = res.data
    })
  },
  methods: {
    getListData() {
      this.listLoading = true
      getDeviceList(this.listQuery).then(response => {
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
    // 查看设备详情
    deviceDetail(row) {
      this.$router.push({ name: 'DeviceDetail', params: { id: row.id }})
    },
    // 删除设备
    deleteDevice(row) {
      this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDevice(row.id)
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
      this.addDeviceForm = {}
      this.batchAddDeviceForm = { addType: '自动生成', count: 1 }
    },
    createDevice() {
      this.$refs['addDeviceForm'].validate((valid) => {
        if (valid) {
          this.addDialogVisible = false
          createDevice(this.addDeviceForm)
            .then(() => {
              this.$message({
                type: 'success',
                message: '创建设备成功!'
              })
              this.getListData()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '创建设备失败!'
              })
              this.getListData()
            })
        }
      })
    },
    batchCreateDevice() {
      this.$refs['batchAddDeviceForm'].validate((valid) => {
        if (valid) {
          console.log(this.batchAddDeviceForm)
          this.batchAddDialogVisible = false
          batchCreateDevice(this.addDeviceForm)
            .then(() => {
              this.$message({
                type: 'success',
                message: '创建设备成功!'
              })
              this.getListData()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '创建设备失败!'
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

.download-template-link{
  color: aquamarine
}
</style>
