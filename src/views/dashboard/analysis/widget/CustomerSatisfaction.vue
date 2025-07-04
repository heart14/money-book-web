<template>
  <div class="custom-card art-custom-card customer-satisfaction">
    <div class="custom-card-header">
      <span class="title">收支趋势图</span>
    </div>
    <div class="custom-card-body">
      <div ref="chartRef" style="height: 300px; margin-top: 10px"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import * as echarts from 'echarts'
  import { useI18n } from 'vue-i18n'
  import { useChart } from '@/composables/useChart'
  import { moneyBookService } from '@/api/moneyBookApi'
  import { ApiStatus } from '@/utils/http/status'
  import { defineProps } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'

  const settingStore = useSettingStore()
  const { systemThemeColor } = storeToRefs(settingStore)

  const { t } = useI18n()

  const { chartRef, isDark, initChart } = useChart()

  const monthlyData = ref({
    date: [],
    totalIncome: [],
    totalExpense: []
  })

  const getMonthlyData = async () => {
    const params = {
      conditionType: props.statisCondition
    }

    const res = await moneyBookService.getMonthlyData(params)

    if (res.code == ApiStatus.success) {
      monthlyData.value = res.data
      initChart(options())
    }
  }

  const options: () => echarts.EChartsOption = () => ({
    grid: {
      top: 20,
      right: 3,
      bottom: 40,
      left: 3,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: [
        t('analysis.customerSatisfaction.trend.income'),
        t('analysis.customerSatisfaction.trend.expense')
      ],
      bottom: 0,
      icon: 'cicle',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 15,
      textStyle: {
        fontSize: 12,
        color: isDark.value ? '#808290' : '#222B45'
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: monthlyData.value.date,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        // show: true, // 隐藏 x 轴标签
        color: isDark.value ? '#808290' : '#222B45'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: isDark.value ? '#808290' : '#222B45' },
      splitLine: {
        show: true, // 将 show 设置为 false 以去除水平线条
        lineStyle: {
          color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : '#EFF1F3',
          width: 0.8
        }
      }
    },
    series: [
      {
        name: t('analysis.customerSatisfaction.trend.income'),
        type: 'bar',
        data: monthlyData.value.totalIncome,
        barWidth: '25%',
        itemStyle: {
          borderRadius: 4,
          color: '#0095FF'
        },
        animationDelay: (idx) => idx * 50 + 300,
        animationDuration: (idx) => 1500 - idx * 50,
        animationEasing: 'quadraticOut'
      },
      {
        name: t('analysis.customerSatisfaction.trend.expense'),
        type: 'bar',
        data: monthlyData.value.totalExpense,
        barWidth: '25%',
        itemStyle: {
          borderRadius: 4,
          color: systemThemeColor.value
        },
        animationDelay: (idx) => idx * 50 + 300,
        animationDuration: (idx) => 1500 - idx * 50,
        animationEasing: 'quadraticOut'
      }
    ]
  })

  watch(isDark, () => {
    initChart(options())
  })

  onMounted(() => {
    getMonthlyData()
    // initChart(options())
  })

  const props = defineProps({
    statisCondition: {
      type: String,
      default: null
    }
  })

  watch(
    () => props.statisCondition,
    (newVal) => {
      console.log('收到新值:', newVal)
      // 这里可以加载数据
      getMonthlyData()
    },
    { immediate: true }
  )
</script>
<style lang="scss" scoped>
  .custom-card {
    // height: 400px;
    box-sizing: border-box;
    width: 100%;
    height: 420px;
    padding: 16px;

    &-body {
      // padding: 10px 0;
      box-sizing: border-box;
      width: 100%;
      height: 220px;
      padding: 20px 0 20px 20px;
      border-radius: calc(var(--custom-radius) / 2 + 4px) !important;
    }
  }

  @media (max-width: $device-notebook) {
    .custom-card {
      height: 350px;

      &-body {
        > div {
          height: 260px !important;
        }
      }
    }
  }
</style>
