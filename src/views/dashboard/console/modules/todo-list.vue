<template>
  <div class="art-card h-128 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>✅心愿单</h4>
        <p>已实现<span class="text-danger">3</span></p>
      </div>
    </div>

    <div class="h-[calc(100%-40px)] overflow-auto">
      <ElScrollbar>
        <div
          class="flex-cb h-17.5 border-b border-g-300 text-sm last:border-b-0"
          v-for="(item, index) in list"
          :key="index"
        >
          <div>
            <p class="text-sm" :class="item.complate ? 'text-warning' : 'text-success'">
              {{ item.username }}
            </p>
            <p class="text-g-500 mt-1">{{ item.date }}</p>
          </div>
          <ElCheckbox v-model="item.complate" />
        </div>
      </ElScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface TodoItem {
    username: string
    date: string
    complate: boolean
  }

  /**
   * 待办事项列表
   * 记录每日工作任务及完成状态
   */
  const list = reactive<TodoItem[]>([
    {
      username: 'Jaguar XEL',
      date: '2023.08.23',
      complate: true
    },
    {
      username: 'Tesla Model 3',
      date: '2024.11.09',
      complate: true
    },
    {
      username: 'iPhone 15 pro',
      date: '2024.05.22',
      complate: true
    },
    {
      username: 'iPhone 17 pro',
      date: '',
      complate: false
    },
    {
      username: '大疆无人机',
      date: '',
      complate: false
    },
    {
      username: 'Mac mini m4',
      date: '',
      complate: false
    }
  ])
</script>
