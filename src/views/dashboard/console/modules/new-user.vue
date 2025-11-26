<template>
  <div class="art-card h-128 p-5 mb-5 overflow-hidden max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>分类支出统计</h4>
      </div>
    </div>
    <div class="overflow-auto h-full">
      <ArtTable
        :data="dataList"
        style="width: 100%"
        size="large"
        :border="false"
        :stripe="false"
        :header-cell-style="{ background: 'transparent' }"
      >
        <ElTableColumn prop="name" label="分类名称" width="200" />
        <ElTableColumn prop="count" label="热度">
          <template #default="scope">
            <ElProgress
              :percentage="scope.row.count"
              :color="getColor(scope.row.count)"
              :stroke-width="8"
              :show-text="false"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="num" label="金额" width="120">
          <template #default="scope">
            <span
              :style="{
                color: getColor(scope.row.count),
                backgroundColor: `rgba(${hexToRgb(getColor(scope.row.count))}, 0.08)`,
                border: '1px solid',
                padding: '3px 6px',
                borderRadius: '4px',
                fontSize: '12px'
              }"
              >{{ scope.row.num }}</span
            >
          </template>
        </ElTableColumn>
      </ArtTable>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { hexToRgb } from '@/utils/ui'
  import { ref, onMounted } from 'vue'
  import { fetchCategoryExpense } from '@/api/dashboard'

  /* 响应式数据 */
  const dataList = ref<Api.Dashboard.CategoryExpenseItem[]>([])
  const loading = ref(false)
  const error = ref('')

  /* 拉取数据 */
  const loadData = async () => {
    loading.value = true
    error.value = ''
    try {
      const res = await fetchCategoryExpense()
      dataList.value = (res as any).data ?? res
    } catch (e: any) {
      error.value = e?.message || '网络错误'
    } finally {
      loading.value = false
    }
  }

  /* 组件挂载后自动请求 */
  onMounted(() => loadData())

  const COLOR_THRESHOLDS = {
    LOW: 25,
    MEDIUM: 50,
    HIGH: 75
  } as const

  const POPULARITY_COLORS = {
    LOW: '#00E096',
    MEDIUM: '#0095FF',
    HIGH: '#884CFF',
    VERY_HIGH: '#FE8F0E'
  } as const

  /**
   * 根据热度百分比获取对应的颜色
   * @param percentage 热度百分比 (0-100)
   * @returns 对应的颜色值
   */
  const getColor = (percentage: number): string => {
    if (percentage < COLOR_THRESHOLDS.LOW) return POPULARITY_COLORS.LOW
    if (percentage < COLOR_THRESHOLDS.MEDIUM) return POPULARITY_COLORS.MEDIUM
    if (percentage < COLOR_THRESHOLDS.HIGH) return POPULARITY_COLORS.HIGH
    return POPULARITY_COLORS.VERY_HIGH
  }
</script>
