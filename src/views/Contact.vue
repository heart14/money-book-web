<!-- src/views/Contact.vue -->
<template>
  <el-form :model="form" label-width="auto" style="max-width: 600px">
    <el-form-item label="日期">
      <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" placeholder="记账日期"
        style="width: 100%" />
    </el-form-item>
    <el-form-item label="交易">
      <el-input v-model="form.title" placeholder="交易明细"/>
    </el-form-item>
    <el-form-item label="金额">
      <el-input v-model="form.amount" placeholder="记账金额"/>
    </el-form-item>
    <el-form-item label="类型">
      <el-select v-model="form.type" placeholder="选择类型">
        <el-option label="支出" value="支出" />
        <el-option label="收入" value="收入" />
      </el-select>
    </el-form-item>
    <el-form-item label="分类">
      <el-select v-model="form.category" placeholder="选择分类">
        <el-option v-for="(item, index) in categoryOptions" :key="index" :label="item" :value="item" />
      </el-select>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="form.remark" placeholder="备注"/>
    </el-form-item>
    <el-form-item label="归属">
      <el-input v-model="form.username" placeholder="归属用户"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit(form)">记一笔</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>

import { ref, reactive } from 'vue';
import { ElNotification } from 'element-plus'
import { saveRecord } from '@/request/api';

const categoryOptions = ref(["餐饮", "住房", "交通", "旅行", "服饰", "汽车", "宠物", "生活缴费", "医疗", "教育", "数码", "文娱", "日用", "转账", "其它", "现金", "薪酬"])

const form = reactive({
  date: '',
  title: '',
  amount: '',
  type: '',
  category: '',
  remark: '',
  username: 'liwenfei'
})

const onSubmit = async () => {
  console.log('submit!')
  const res = await saveRecord(form)
  if (res.code == 200) {
    // Reset the form values
    form.date = '';
    form.title = '';
    form.amount = '';
    form.type = '';
    form.category = '';
    form.remark = '';
    form.username = 'liwenfei';

    ElNotification({
      title: 'Success',
      message: '记录完成✅',
      type: 'success',
    })
  } else {
    ElNotification({
      title: 'Error',
      message: '记录失败！',
      type: 'error',
    })
  }
}
</script>