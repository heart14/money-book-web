<!-- src/views/About.vue -->
<template>
  <div class="main-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="账单描述">
        <el-input v-model="formInline.title" placeholder="账单描述" clearable />
      </el-form-item>
      <el-form-item label="账单类型">
        <el-select v-model="formInline.type" placeholder="账单类型" clearable>
          <el-option label="支出" value="支出" />
          <el-option label="收入" value="收入" />
        </el-select>
      </el-form-item>
      <el-form-item label="账单分类">
        <el-select v-model="formInline.category" placeholder="账单分类" clearable>
          <el-option label="餐饮" value="餐饮" />
          <el-option label="交通" value="交通" />
          <el-option label="汽车" value="汽车" />
        </el-select>
      </el-form-item>
      <el-form-item label="查询维度">
        <el-select v-model="queryType" @change="handleTypeChange" placeholder="查询维度" :style="{ width: '64px' }">
          <el-option label="年" value="年" />
          <el-option label="月" value="月" />
          <el-option label="日" value="日" />
        </el-select>
      </el-form-item>
      <el-form-item label="账单日期">
        <el-date-picker v-if="queryType === '年'" v-model="formInline.byYear" type="year" :disabled-date="disabledDate"
          value-format="YYYY" placeholder="账单年份" clearable />
        <el-date-picker v-if="queryType === '月'" v-model="formInline.byMonth" type="month" :disabled-date="disabledDate"
          value-format="YYYY-MM" placeholder="账单月份" clearable />
        <el-date-picker v-if="queryType === '日'" v-model="formInline.byDate" type="date" :disabled-date="disabledDate"
          value-format="YYYY-MM-DD" placeholder="账单日期" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(formInline)">查询</el-button>
      </el-form-item>
    </el-form>


    <el-table :data="data" height="1000px" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180" sortable></el-table-column>
      <el-table-column prop="type" label="类型" width="180"></el-table-column>
      <el-table-column prop="category" label="分类" width="180"></el-table-column>
      <el-table-column prop="title" label="描述" width="180"></el-table-column>
      <el-table-column prop="amount" label="金额(元)" width="180"></el-table-column>
      <!-- <el-table-column prop="remark" label="备注" width="180"></el-table-column> -->
      <el-table-column prop="recordTime" label="时间" width="180"></el-table-column>
      <!-- <el-table-column prop="username" label="用户名" width="180"></el-table-column> -->
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { reactive } from 'vue'
import { queryRecord } from '@/request/api';
import { ElTable, ElTableColumn } from 'element-plus';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const formInline = reactive({
  title: '',
  type: '',
  category: '',
  byYear: '',
  byMonth: '',
  byDate: (() => {
    const date = new Date();
    date.setDate(date.getDate() - 0); // 设置为前一天
    return date.toLocaleString().split(' ')[0].replaceAll('/','-'); // 获取YYYY-MM-DD格式
  })()
})
const queryType = ref('日')
const data = ref([])


// 日期选择器中禁用今天之后的日期
const disabledDate = (date) => {
  return date.getTime() > Date.now()
}

// 切换查询维度时重置参数值
const handleTypeChange = () => {
  formInline.byYear = ''
  formInline.byMonth = ''
  formInline.byDate = ''
}

// 提交查询
const onSubmit = async () => {
  console.log("formInline " + formInline)
  const res = await queryRecord(formInline);
  data.value = res.data
}

// 在组件挂载时调用 onSubmit
// onSubmit();onMounted里面进行调用了，这里可以不要了

// 从概览页面点击统计图，路由跳转到此页面，并带上参数进行查询
const route = useRoute();
const router = useRouter();
onMounted(() => {
  console.log('11 ' + route.query.month)
  handleTypeChange(); // 查询前先初始化参数值
  if (route.query.month !== '' && route.query.month !== undefined) {
    formInline.byMonth = route.query.month; // 获取月份参数
    queryType.value = '月';
    // 因为从概览页面通过路由跳转过来时，会在url上加个month=xxxx参数，这里再replace一下，移除参数，就可以让url不显示了，但会多刷新一次页面
    router.replace({
      name: 'About',
      query: {}
    });
  }
  onSubmit(); // 调用 onSubmit 函数进行查询

});
</script>

<style>
.demo-form-inline .el-input {
  --el-input-width: 120px;
}

.demo-form-inline .el-select {
  --el-select-width: 120px;
}

.demo-form-inline .el-date-editor {
  --el-date-editor-width: 200px
}

.el-button:focus {
  outline: none;
  /* 去掉聚焦框 */
}
</style>