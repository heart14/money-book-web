<template>
  <div class="art-card h-105 p-5 mb-5 max-sm:mb-4">
    <ArtLineChart
      height="calc(100% - 56px)"
      :data="chartData"
      :xAxisData="xAxisLabels"
      :showAreaColor="true"
      :showAxisLine="false"
    />
    <div class="ml-1">
      <h3 class="mt-5 text-lg font-medium">🔼支出情况（元）</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject, watch } from 'vue'
  import type { Ref } from 'vue'
  import { fetchMonthlyExpense } from '@/api/dashboard'
  const monthlyExpenseList = ref<Api.Dashboard.MonthlyExpenseItem[]>([])
  const loading = ref(false)
  const error = ref('')

  const xAxisLabels = ref()
  const chartData = ref()

  const consoleYear = inject('consoleYear') as Ref<string> | undefined

  const loadMonthlyExpenseData = async () => {
    loading.value = true
    error.value = ''
    try {
      const res = await fetchMonthlyExpense({ year: consoleYear?.value })
      console.log('res---', res)
      monthlyExpenseList.value = (res as any).data ?? res
      // 月份中文
      const monthName = (m: string) => `${Number(m.slice(-2))}月`

      xAxisLabels.value = monthlyExpenseList.value.map((item) => monthName(item.month))
      chartData.value = monthlyExpenseList.value.map((item) => item.totalExpense)
    } catch (e: any) {
      error.value = e?.message || '网络错误'
    } finally {
      loading.value = false
    }
  }

  watch(consoleYear ?? ref(''), () => loadMonthlyExpenseData(), { immediate: true })
</script>
