<template>
  <div class="art-card h-128 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>大额消费</h4>
        <p>单笔金额<span class="text-success">>= 1000</span></p>
      </div>
    </div>

    <div class="h-9/10 mt-2 overflow-hidden">
      <ElScrollbar>
        <div
          class="h-17.5 leading-17.5 border-b border-g-300 text-sm overflow-hidden last:border-b-0"
          v-for="(item, index) in dataList"
          :key="index"
        >
          <span class="text-g-800 font-medium">{{ item.date }}</span>
          <span class="mx-2 text-g-600">购买</span>
          <span class="text-theme">{{ item.title }}({{ item.amount }})</span>
        </div>
      </ElScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { fetchLargeConsume } from '@/api/dashboard'

  /* 响应式数据 */
  const dataList = ref<Api.Dashboard.LargeConsumeItem[]>([])
  const loading = ref(false)
  const error = ref('')

  /* 拉取数据 */
  const loadData = async () => {
    loading.value = true
    error.value = ''
    try {
      const res = await fetchLargeConsume()
      dataList.value = (res as any).data ?? res
    } catch (e: any) {
      error.value = e?.message || '网络错误'
    } finally {
      loading.value = false
    }
  }

  /* 组件挂载后自动请求 */
  onMounted(() => loadData())
</script>
