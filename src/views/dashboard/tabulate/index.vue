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
          <span :style="{ color: '#f56c6c', fontWeight: 'bold' }">￥{{ row.total }}</span>
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
          sortable: true,
          label: '1月'
        },
        {
          prop: 'month2',
          sortable: true,
          label: '2月'
        },
        {
          prop: 'month3',
          sortable: true,
          label: '3月'
        },
        {
          prop: 'month4',
          sortable: true,
          label: '4月'
        },
        {
          prop: 'month5',
          sortable: true,
          label: '5月'
        },
        {
          prop: 'month6',
          sortable: true,
          label: '6月'
        },
        {
          prop: 'month7',
          sortable: true,
          label: '7月'
        },
        {
          prop: 'month8',
          sortable: true,
          label: '8月'
        },
        {
          prop: 'month9',
          sortable: true,
          label: '9月'
        },
        {
          prop: 'month10',
          sortable: true,
          label: '10月'
        },
        {
          prop: 'month11',
          sortable: true,
          label: '11月'
        },
        {
          prop: 'month12',
          sortable: true,
          label: '12月'
        },
        {
          prop: 'total',
          width: 120,
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
