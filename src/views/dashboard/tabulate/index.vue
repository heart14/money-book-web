<!-- 基础表格 -->
<template>
  <div class="user-page art-full-height">
    <ElCard class="art-table-card" shadow="never" style="margin-top: 0">
      <!-- 标题 -->
      <template #header>
        <div class="table-title">月/分类支出统计表（单位：元）</div>
      </template>
      <!-- 表格 -->
      <ArtTable
        rowKey="id"
        :show-table-header="false"
        :loading="loading"
        :data="data"
        :columns="columns"
        :row-style="rowStyle"
      >
        <template #total="{ row }">
          <span :style="{ color: '#f56c6c', fontWeight: 'bold' }">{{ row.total }}</span>
        </template>
      </ArtTable>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { useTable } from '@/hooks/core/useTable'
  import { fetchTabulateList } from '@/api/dashboard'

  const { data, columns, loading } = useTable({
    core: {
      apiFn: fetchTabulateList,
      apiParams: {},
      columnsFactory: () => [
        {
          prop: 'categoryName',
          label: '分类'
        },
        {
          prop: 'month1',
          label: '1月'
        },
        {
          prop: 'month2',
          label: '2月'
        },
        {
          prop: 'month3',
          label: '3月'
        },
        {
          prop: 'month4',
          label: '4月'
        },
        {
          prop: 'month5',
          label: '5月'
        },
        {
          prop: 'month6',
          label: '6月'
        },
        {
          prop: 'month7',
          label: '7月'
        },
        {
          prop: 'month8',
          label: '8月'
        },
        {
          prop: 'month9',
          label: '9月'
        },
        {
          prop: 'month10',
          label: '10月'
        },
        {
          prop: 'month11',
          label: '11月'
        },
        {
          prop: 'month12',
          label: '12月'
        },
        {
          prop: 'total',
          sortable: true,
          label: '总计',
          useSlot: true
        }
      ]
    }
  })

  const rowStyle = ({ row }: any) =>
    row.categoryName === '合计' ? { color: '#f56c6c', fontWeight: 'bold' } : {}
</script>
<style scoped>
  .table-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }
</style>
