<template>
  <div class="category-page art-full-height">
    <!-- 搜索栏 -->
    <ArtSearchBar
      v-model="formFilters"
      :items="formItems"
      :showExpand="false"
      @reset="handleReset"
      @search="handleSearch"
    />

    <ElCard class="art-table-card" shadow="never">
      <ArtTableHeader
        :showZebra="false"
        :loading="loading"
        v-model:columns="columnChecks"
        @refresh="handleRefresh"
      >
        <template #left>
          <ElButton v-auth="'add'" @click="handleAdd" v-ripple> 新增分类 </ElButton>
          <ElButton @click="toggleExpand" v-ripple>
            {{ isExpanded ? '收起' : '展开' }}
          </ElButton>
        </template>
      </ArtTableHeader>

      <ArtTable
        ref="tableRef"
        rowKey="path"
        :loading="loading"
        :columns="columns"
        :data="tableData"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :default-expand-all="false"
      />

      <!-- 分类弹窗 -->
      <CategoryDialog v-model:visible="dialogVisible" :editData="editData" @submit="handleSubmit" />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTableColumns } from '@/hooks/core/useTableColumns'
  import { fetchCategoryTree } from '@/api/system-manage'
  import CategoryDialog from './modules/category-dialog.vue'
  import { ElTag, ElMessage, ElMessageBox } from 'element-plus'

  defineOptions({ name: 'Category' })

  // 状态
  const loading = ref(false)
  const isExpanded = ref(false)
  const tableRef = ref()

  // 弹窗
  const dialogVisible = ref(false)
  const editData = ref<any>(null)

  // 搜索
  const initialSearch = { name: '', type: '' }
  const formFilters = reactive({ ...initialSearch })
  const appliedFilters = reactive({ ...initialSearch })

  // 收支类型配置
  const TRANSACTION_TYPE_CONFIG = {
    1: { type: 'success' as const, text: '收入' },
    2: { type: 'danger' as const, text: '支出' },
    3: { type: 'warning' as const, text: '收支' }
  } as const

  // 获取收支类型
  const getTypeConfig = (type: number) => {
    return (
      TRANSACTION_TYPE_CONFIG[type as keyof typeof TRANSACTION_TYPE_CONFIG] || {
        type: 'info' as const,
        text: '未知'
      }
    )
  }

  // 表单项
  const formItems = computed(() => [
    { label: '分类名称', key: 'name', type: 'input', props: { clearable: true } },
    {
      label: '类型',
      key: 'type',
      type: 'select',
      props: {
        clearable: true,
        options: [
          { label: '全部', value: '' },
          { label: '收入', value: 1 },
          { label: '支出', value: 2 },
          { label: '收支', value: 3 }
        ]
      }
    }
  ])

  // 表格列
  const { columnChecks, columns } = useTableColumns(() => [
    {
      prop: 'name',
      label: '分类',
      // width: 270,
      formatter: (row: any) => {
        const typeConfig = getTypeConfig(row.type)
        return h('span', [
          h(ElTag, { type: typeConfig.type, size: 'small' }, () => typeConfig.text),
          h('span', ' ' + row.name)
        ])
      }
    },
    { prop: 'description', label: '描述' },
    // { prop: 'type', label: '类型' },
    // { prop: 'path', label: '路径' },
    // {
    //   prop: 'level',
    //   label: '层级',
    //   formatter: (row: any) => {
    //     const typeMap: Record<number, string> = {
    //       1: '一级分类',
    //       2: '二级分类',
    //       3: '三级分类'
    //     }
    //     return typeMap[row.level] ?? ''
    //   }
    // },
    {
      prop: 'isDeleted',
      label: '状态',
      formatter: (row: any) => {
        return row.isDeleted
          ? h(ElTag, { type: 'danger', size: 'small' }, () => '已删除')
          : h(ElTag, { type: 'success', size: 'small' }, () => '正常')
      }
    },
    {
      prop: 'operation',
      label: '操作',
      width: 180,
      align: 'center',
      formatter: (row: any) => {
        const buttonStyle = { style: 'text-align: right' }

        return h('div', buttonStyle, [
          h(ArtButtonTable, {
            type: 'add',
            onClick: () => handleAddChild(row),
            title: '新增子类'
          }),
          h(ArtButtonTable, {
            type: 'edit',
            onClick: () => handleEdit(row),
            title: '编辑'
          }),
          h(ArtButtonTable, {
            type: 'delete',
            onClick: () => handleDelete(row),
            title: '删除'
          })
        ])
      }
    }
  ])

  /* ---------- 数据 ---------- */
  const tableData = ref<any[]>([])
  const getTreeList = async () => {
    loading.value = true
    try {
      const list = await fetchCategoryTree()
      // const list = await fetchCategoryList(appliedFilters)
      tableData.value = list
    } finally {
      loading.value = false
    }
  }
  onMounted(getTreeList)

  /* ---------- 搜索/刷新 ---------- */
  const handleReset = () => {
    Object.assign(formFilters, initialSearch)
    Object.assign(appliedFilters, initialSearch)
    getTreeList()
  }
  const handleSearch = () => {
    Object.assign(appliedFilters, formFilters)
    getTreeList()
  }
  const handleRefresh = () => getTreeList()

  /* ---------- 弹窗 ---------- */
  const handleAdd = () => {
    editData.value = null
    dialogVisible.value = true
  }
  const handleAddChild = (row: any) => {
    editData.value = { parentId: row.id, parentName: row.name }
    dialogVisible.value = true
  }
  const handleEdit = (row: any) => {
    editData.value = row
    dialogVisible.value = true
  }
  const handleSubmit = (form: any) => {
    // TODO 调用保存接口
    ElMessage.success('保存成功')
    dialogVisible.value = false
    console.log('提交的表单数据:', form)
    getTreeList()
  }

  /* ---------- 删除 ---------- */
  const handleDelete = async (row: any) => {
    try {
      console.log('删除分类:', row)
      await ElMessageBox.confirm('确定删除？', '提示', { type: 'warning' })
      // TODO 调用删除接口
      ElMessage.success('删除成功')
      getTreeList()
    } catch (e) {
      ElMessage.error('删除失败' + e)
    }
  }

  /* ---------- 展开/收起 ---------- */
  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value
    nextTick(() => {
      const walk = (nodes: any[]) => {
        nodes.forEach((n) => {
          if (n.children?.length) {
            tableRef.value.elTableRef.toggleRowExpansion(n, isExpanded.value)
            walk(n.children)
          }
        })
      }
      walk(tableData.value)
    })
  }
</script>
