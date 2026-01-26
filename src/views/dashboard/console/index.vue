<!-- 工作台页面 -->
<template>
  <div>
    <ElRow justify="space-between" style="margin-bottom: 12px">
      <ElCol :span="12">
        <div class="card-list-title">统计概览</div>
      </ElCol>
      <ElCol :span="12" style="text-align: right">
        <ElDatePicker
          v-model="selectedYear"
          :clearable="false"
          type="year"
          placeholder="选择年份"
          value-format="YYYY"
          format="YYYY"
          size="small"
        />
      </ElCol>
    </ElRow>

    <CardList />

    <ElRow :gutter="20">
      <ElCol :sm="24" :md="12" :lg="10">
        <Income />
      </ElCol>
      <ElCol :sm="24" :md="12" :lg="14">
        <Expense />
      </ElCol>
    </ElRow>

    <ElRow :gutter="20">
      <ElCol :sm="24" :md="24" :lg="10">
        <CategoryExpense />
      </ElCol>
      <ElCol :sm="24" :md="12" :lg="8">
        <LargeConsume />
      </ElCol>
      <ElCol :sm="24" :md="12" :lg="6">
        <TodoList />
      </ElCol>
    </ElRow>

    <AboutProject />
  </div>
</template>

<script setup lang="ts">
  import { ref, provide } from 'vue'
  import CardList from './modules/card-list.vue'
  import Income from './modules/income.vue'
  import Expense from './modules/expense.vue'
  import CategoryExpense from './modules/category-expense.vue'
  import LargeConsume from './modules/large-consume.vue'
  import TodoList from './modules/todo-list.vue'
  import AboutProject from './modules/about-project.vue'

  const selectedYear = ref<string>(new Date().getFullYear().toString())
  provide('consoleYear', selectedYear)

  defineOptions({ name: 'Console' })
</script>
