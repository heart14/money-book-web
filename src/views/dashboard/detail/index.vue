<!-- 用户管理页面 -->
<!-- art-full-height 自动计算出页面剩余高度 -->
<!-- art-table-card 一个符合系统样式的 class，同时自动撑满剩余高度 -->
<!-- 更多 useTable 使用示例请移步至 功能示例 下面的高级表格示例或者查看官方文档 -->
<!-- useTable 文档：https://www.artd.pro/docs/zh/guide/hooks/use-table.html -->
<template>
  <div class="user-page art-full-height">
    <!-- 搜索栏 -->
    <TransSearch v-model="searchForm" @search="handleSearch" @reset="resetSearchParams" />

    <ElCard class="art-table-card" shadow="never">
      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
        <template #left>
          <ElSpace wrap>
            <ElButton @click="showDialog('add')" v-ripple>记一笔</ElButton>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <!-- 表格 -->
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @selection-change="handleSelectionChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>

      <!-- 用户弹窗 -->
      <TransDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :user-data="currentTransData"
        @submit="handleDialogSubmit"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTable } from '@/hooks/core/useTable'
  import { fetchTransDetailList } from '@/api/dashboard'
  import TransSearch from './modules/trans-search.vue'
  import TransDialog from './modules/trans-dialog.vue'
  import { ElTag, ElMessageBox } from 'element-plus'
  import { DialogType } from '@/types'

  defineOptions({ name: 'User' })

  type TransDetailItem = Api.TransDetail.TransDetailItem

  // 弹窗相关
  const dialogType = ref<DialogType>('add')
  const dialogVisible = ref(false)
  const currentTransData = ref<Partial<TransDetailItem>>({})

  // 选中行
  const selectedRows = ref<TransDetailItem[]>([])

  // 搜索表单
  const searchForm = ref({
    title: undefined,
    type: undefined,
    cid: undefined,
    remark: undefined,
    dateRangeStart: undefined,
    dateRangeEnd: undefined
  })

  // 收支类型配置
  const TRANSACTION_TYPE_CONFIG = {
    1: { type: 'success' as const, text: '收入' },
    2: { type: 'danger' as const, text: '支出' },
    3: { type: 'warning' as const, text: '收支' }
  } as const

  // 获取收支类型
  const getTransactionTypeConfig = (type: number) => {
    return (
      TRANSACTION_TYPE_CONFIG[type as keyof typeof TRANSACTION_TYPE_CONFIG] || {
        type: 'info' as const,
        text: '未知'
      }
    )
  }

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    getData,
    searchParams,
    resetSearchParams,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable({
    // 核心配置
    core: {
      apiFn: fetchTransDetailList,
      apiParams: {
        current: 1,
        size: 15,
        ...searchForm.value
      },
      columnsFactory: () => [
        // { type: 'selection' }, // 勾选列
        // { type: 'index', width: 60, label: '序号' }, // 序号
        { prop: 'id', label: 'id', visible: false },
        {
          prop: 'type',
          label: '',
          width: 70,
          formatter: (row) => {
            const typeConfig = getTransactionTypeConfig(row.type)
            return h(ElTag, { type: typeConfig.type }, () => typeConfig.text)
          }
        },
        { prop: 'title', label: '标题' },
        { prop: 'amount', label: '金额（元）', sortable: true },
        { prop: 'categoryPath', label: '分类' },
        { prop: 'remark', label: '备注' },
        {
          prop: 'transTime',
          label: '交易时间',
          sortable: true
        },
        {
          prop: 'recordTime',
          label: '记录时间',
          sortable: true
        },
        {
          prop: 'operation',
          label: '操作',
          width: 120,
          fixed: 'right', // 固定列
          formatter: (row) =>
            h('div', [
              h(ArtButtonTable, {
                type: 'edit',
                onClick: () => showDialog('edit', row)
              }),
              h(ArtButtonTable, {
                type: 'delete',
                onClick: () => deleteUser(row)
              })
            ])
        }
      ]
    }
  })

  /**
   * 搜索处理
   * @param params 参数
   */
  const handleSearch = (params: Record<string, any>) => {
    console.log('search params')
    console.log(params)
    // 搜索参数赋值
    Object.assign(searchParams, params)
    if (params.daterange && params.daterange.length === 2) {
      searchParams.dateRangeStart = params.daterange[0]
      searchParams.dateRangeEnd = params.daterange[1]
    }
    getData()
  }

  /**
   * 显示用户弹窗
   */
  const showDialog = (type: DialogType, row?: TransDetailItem): void => {
    console.log('打开弹窗:', { type, row })
    dialogType.value = type
    currentTransData.value = row || {}
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  /**
   * 删除用户
   */
  const deleteUser = (row: TransDetailItem): void => {
    console.log('删除用户:', row)
    ElMessageBox.confirm(`确定要注销该用户吗？`, '注销用户', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(() => {
      ElMessage.success('注销成功')
    })
  }

  /**
   * 处理弹窗提交事件
   */
  const handleDialogSubmit = async () => {
    try {
      dialogVisible.value = false
      currentTransData.value = {}
    } catch (error) {
      console.error('提交失败:', error)
    }
  }

  /**
   * 处理表格行选择变化
   */
  const handleSelectionChange = (selection: TransDetailItem[]): void => {
    selectedRows.value = selection
    console.log('选中行数据:', selectedRows.value)
  }
</script>
