<!-- 工作台页面 -->
<template>
  <div>
    <CardList></CardList>

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
  import CardList from './modules/card-list.vue'
  import Income from './modules/income.vue'
  import Expense from './modules/expense.vue'
  import CategoryExpense from './modules/category-expense.vue'
  import LargeConsume from './modules/large-consume.vue'
  import TodoList from './modules/todo-list.vue'
  import AboutProject from './modules/about-project.vue'

  defineOptions({ name: 'Console' })
</script>
