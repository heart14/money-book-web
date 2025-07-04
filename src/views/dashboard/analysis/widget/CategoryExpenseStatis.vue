<template>
  <div class="custom-card art-custom-card top-products">
    <div class="custom-card-header">
      <span class="title">分类支出统计</span>
    </div>
    <div class="custom-card-body">
      <art-table
        :data="categoryData"
        style="width: 100%"
        :pagination="false"
        size="large"
        :border="false"
        :stripe="false"
        :show-header-background="false"
      >
        <el-table-column prop="categoryName" label="分类名称" />
        <!-- <el-table-column prop="popularity" :label="t('analysis.topProducts.columns.popularity')">
          <template #default="scope">
            <el-progress
              :percentage="scope.row.popularity"
              :color="getColor(scope.row.popularity)"
              :stroke-width="5"
              :show-text="false"
            />
          </template>
        </el-table-column> -->
        <el-table-column prop="totalAmount" label="金额">
          <template #default="scope">
            <span
              :style="{
                color: getColor(scope.row.totalAmount),
                backgroundColor: `rgba(${hexToRgb(getColor(scope.row.totalAmount))}, 0.08)`,
                border: '0px solid',
                padding: '3px 6px',
                borderRadius: '4px',
                fontSize: '12px'
              }"
              >{{ scope.row.totalAmount }}</span
            >
          </template>
        </el-table-column>
      </art-table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { hexToRgb } from '@/utils/color'
  import { useI18n } from 'vue-i18n'
  import { moneyBookService } from '@/api/moneyBookApi'
  import { ApiStatus } from '@/utils/http/status'
  import { defineProps } from 'vue'
  const { t } = useI18n()

  const categoryData = ref([
    {
      name: t('analysis.topProducts.products.homeDecor.name'),
      popularity: 10,
      sales: t('analysis.topProducts.products.homeDecor.sales')
    },
    {
      name: t('analysis.topProducts.products.disneyBag.name'),
      popularity: 29,
      sales: t('analysis.topProducts.products.disneyBag.sales')
    },
    {
      name: t('analysis.topProducts.products.bathroom.name'),
      popularity: 65,
      sales: t('analysis.topProducts.products.bathroom.sales')
    },
    {
      name: t('analysis.topProducts.products.smartwatch.name'),
      popularity: 32,
      sales: t('analysis.topProducts.products.smartwatch.sales')
    },
    {
      name: t('analysis.topProducts.products.fitness.name'),
      popularity: 78,
      sales: t('analysis.topProducts.products.fitness.sales')
    },
    {
      name: t('analysis.topProducts.products.earbuds.name'),
      popularity: 41,
      sales: t('analysis.topProducts.products.earbuds.sales')
    }
  ])

  const getCategoryData = async () => {
    const params = {
      conditionType: props.statisCondition,
      billType: '支出'
    }

    const res = await moneyBookService.getCategoryStatisticData(params)

    if (res.code == ApiStatus.success) {
      categoryData.value = res.data
    }
  }

  onMounted(() => {
    getCategoryData()
  })

  const getColor = (percentage: number) => {
    if (percentage < 100) return '#00E096'
    if (percentage < 1000) return '#0095FF'
    if (percentage < 10000) return '#884CFF'
    return '#FE8F0E'
  }

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
      getCategoryData()
    },
    { immediate: true }
  )
</script>

<style lang="scss" scoped>
  .custom-card {
    height: 330px;
    overflow-y: scroll;

    // 隐藏滚动条
    &::-webkit-scrollbar {
      display: none;
    }

    &-body {
      padding: 0 6px;
    }
  }

  @media (width <= 1200px) {
    .custom-card {
      height: auto;
    }
  }
</style>
