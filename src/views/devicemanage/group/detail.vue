<template>
  <div class="app-container">
    <div
      v-if="productInfo"
      class="header">
      <div>{{ productInfo.name }}
      </div>
      <div style="display:flex;flex-direction:row;justify-content:space-between">
        <div>
          ProductKey:{{ productInfo.product_key }}复制
        </div>
        <div>
          ProductSecret:{{ productInfo.product_secret }}显示
        </div>
        <div>
          设备数量:1 前往管理
        </div>
      </div>
    </div>

    <el-tabs v-model="activeName">
      <el-tab-pane
        label="产品信息"
        name="first">
        <table class="table">
          <tr>
            <th>产品名称</th>
            <td>{{ productInfo.name }}</td>
            <th>节点类型</th>
            <td>{{ productInfo.name }}</td>
            <th>创建时间</th>
            <td>{{ productInfo.create_time }}</td>
          </tr>
          <tr>
            <th>产品描述</th>
            <td colspan="5">dasdas</td>
          </tr>
          <tr>
            <th>Product Key</th>
            <td>{{ productInfo.product_key }}</td>
            <th>Product Secret</th>
            <td colspan="3">xasdasd12123!</td>
          </tr>
        </table>
      </el-tab-pane>
      <el-tab-pane
        label="Topic类列表"
        name="second">Topic类列表</el-tab-pane>
      <el-tab-pane
        label="服务端订阅"
        name="third">服务端订阅</el-tab-pane>
      <el-tab-pane
        label="日志服务"
        name="fourth">日志服务</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getProduct } from '@/api/product'
export default {
  data() {
    return {
      productInfo: null,
      activeName: 'first'
    }
  },
  created() {
    this.getProduct(this.$route.params.id)
  },
  methods: {
    getProduct(id) {
      getProduct(id).then((response) => {
        this.productInfo = response.data
      })
    }
  }
}
</script>
<style>
.el-tabs__item.is-active {
  color: rgb(55, 173, 175);
}
.el-tabs__active-bar {
  background-color: rgb(55, 173, 175);
}
</style>
<style lang="scss" scoped>
.table {
  width: 100%;
  border: 0;
  border-left: 1px solid #ebecec;
  border-top: 1px solid;
  border-color: #ebecec;
  margin-bottom: 18px;
  font-size: 14px;
  color: #333;
  tr {
    height: 48px;
    width: 100%;
    th {
      min-width: 120px;
      text-align: left;
      color: #74777a;
      font-weight: 400;
      background: #fafafc;
      border-right: 1px solid #ebecec;
      border-bottom: 1px solid #ebecec;
    }
    td {
      width: 22%;
      word-break: break-all;
      border-right: 1px solid #ebecec;
      border-bottom: 1px solid #ebecec;
    }
  }
}
</style>
