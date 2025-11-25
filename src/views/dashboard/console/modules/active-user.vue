<template>
  <div class="art-card h-105 p-4 box-border mb-5 max-sm:mb-4">
    <ArtBarChart
      class="box-border p-2"
      barWidth="50%"
      height="13.7rem"
      :showAxisLine="false"
      :data="chartData"
      :xAxisData="xAxisLabels"
    />
    <div class="ml-1">
      <!-- <p class="mt-1 text-sm"> - </p> -->
      <h3 class="mt-5 text-lg font-medium">收入情况（元）</h3>
      <!-- <p class="mt-1 text-sm"> - </p> -->
    </div>
    <div class="flex-b mt-2">
      <div class="flex-1" v-for="(item, index) in categoryIncomeList" :key="index">
        <p class="text-2xl text-g-900">{{ item.num }}</p>
        <p class="text-xs text-g-500">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { fetchMonthlyIncome, fetchCategoryIncome } from '@/api/dashboard'
  const monthlyIncomeList = ref<Api.Dashboard.MonthlyIncomeItem[]>([])
  const loading = ref(false)
  const error = ref('')

  const categoryIncomeList = ref<Api.Dashboard.CategoryIncomeItem[]>([])

  const xAxisLabels = ref()
  const chartData = ref()

  const loadMonthlyIncomeData = async () => {
    loading.value = true
    error.value = ''
    try {
      const res = await fetchMonthlyIncome()
      console.log('res---', res)
      monthlyIncomeList.value = (res as any).data ?? res
      // 月份中文
      const monthName = (m: string) => `${Number(m.slice(-2))}月`

      const monthList = monthlyIncomeList.value.map((item) => monthName(item.month))
      const incomeList = monthlyIncomeList.value.map((item) => item.totalIncome)

      xAxisLabels.value = monthList
      chartData.value = incomeList
    } catch (e: any) {
      error.value = e?.message || '网络错误'
    } finally {
      loading.value = false
    }
  }

  const loadCategoryIncomeData = async () => {
    loading.value = true
    error.value = ''
    try {
      const res = await fetchCategoryIncome()
      console.log('res---', res)
      categoryIncomeList.value = (res as any).data ?? res
    } catch (e: any) {
      error.value = e?.message || '网络错误'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadMonthlyIncomeData()
    loadCategoryIncomeData()
  })
</script>
