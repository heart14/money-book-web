<template>
  <ArtTableFullScreen>
    <div class="account-page" id="table-full-screen">
      <!-- 搜索栏 -->
      <ArtSearchBar
        v-model:filter="formFilters"
        :items="formItems"
        @reset="handleReset"
        @search="handleSearch"
      ></ArtSearchBar>

      <ElCard shadow="never" class="art-table-card">
        <!-- 表格头部 -->
        <ArtTableHeader
          :columnList="columnOptions"
          v-model:columns="columnChecks"
          @refresh="handleRefresh"
        >
          <template #left>
            <ElButton @click="showDialog('add')">新增</ElButton>
          </template>
        </ArtTableHeader>

        <!-- 表格 -->
        <ArtTable
          ref="tableRef"
          row-key="id"
          :loading="loading"
          :data="tableData"
          :currentPage="pagination.currentPage"
          :pageSize="pagination.pageSize"
          :total="pagination.total"
          :marginTop="10"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <template #default>
            <ElTableColumn v-for="col in columns" :key="col.prop || col.type" v-bind="col" />
          </template>
        </ArtTable>

        <ElDialog
          v-model="dialogVisible"
          :title="dialogType === 'add' ? '添加' : '编辑'"
          width="30%"
          align-center
        >
          <ElForm ref="formRef" :model="formData" :rules="rules" label-width="80px">
            <ElFormItem label="ID" prop="id" style="display: none">
              <ElInput v-model="formData.id" />
            </ElFormItem>
            <ElFormItem label="时间" prop="datetime">
              <ElDatePicker
                v-model="formData.datetime"
                type="datetime"
                format="YYYY-MM-DD HH:mm:ss"
                :disabled="dialogType === 'add' ? false : true"
              />
            </ElFormItem>
            <ElFormItem label="标题" prop="title">
              <ElInput v-model="formData.title" />
            </ElFormItem>
            <ElFormItem label="金额" prop="amount">
              <ElInput v-model="formData.amount" :disabled="dialogType === 'add' ? false : true" />
            </ElFormItem>
            <ElFormItem label="类型" prop="type">
              <ElSelect v-model="formData.type" :disabled="dialogType === 'add' ? false : true">
                <ElOption label="支出" value="支出" />
                <ElOption label="收入" value="收入" />
              </ElSelect>
            </ElFormItem>
            <ElFormItem label="分类" prop="categoryId">
              <ElSelect v-model="formData.categoryId">
                <ElOption
                  v-for="category in categoryListData"
                  :key="category.label"
                  :value="category.value"
                  :label="category.label"
                />
              </ElSelect>
            </ElFormItem>
            <ElFormItem label="备注" prop="remark">
              <ElInput v-model="formData.remark" />
            </ElFormItem>
          </ElForm>
          <template #footer>
            <div class="dialog-footer">
              <ElButton @click="dialogVisible = false">取消</ElButton>
              <ElButton type="primary" @click="handleSubmit">提交</ElButton>
            </div>
          </template>
        </ElDialog>
      </ElCard>
    </div>
  </ArtTableFullScreen>
</template>

<script setup lang="ts">
  import { h } from 'vue'
  import { SearchChangeParams, SearchFormItem } from '@/types/search-form'
  import { ElDialog, FormInstance } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import type { FormRules } from 'element-plus'
  import { useCheckedColumns } from '@/composables/useCheckedColumns'
  import ArtButtonTable from '@/components/core/forms/ArtButtonTable.vue'
  import { moneyBookService } from '@/api/moneyBookApi'
  import { categoryService } from '@/api/categoryApi'
  import { ApiStatus } from '@/utils/http/status'

  const dialogType = ref('add')
  const dialogVisible = ref(false)
  const loading = ref(false)

  // 定义表单搜索初始值
  const initialSearchState = {
    title: '',
    type: '支出',
    date: '',
    dateRange: [],
    categoryId: -1,
    path: ''
  }

  // 响应式表单数据
  const formFilters = reactive({ ...initialSearchState })

  // 分页导航数据
  const pagination = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0
  })

  // 表格数据
  const tableData = ref<any[]>([])

  // 分类数据
  const categoryListData = ref([{ label: '请选择', value: -1 }])

  // 表格实例引用
  const tableRef = ref()

  // 重置表单
  const handleReset = () => {
    Object.assign(formFilters, { ...initialSearchState })
    pagination.currentPage = 1 // 重置到第一页
    // getUserList()
    getPageListData()
  }

  // 搜索处理
  const handleSearch = () => {
    console.log('搜索参数:', formFilters)
    pagination.currentPage = 1 // 搜索时重置到第一页
    // getUserList()
    getPageListData()
  }

  // 表单项变更处理
  const handleFormChange = (params: SearchChangeParams): void => {
    console.log('表单项变更:', params)

    // 选择一个日期或日期范围时，重置另一个日期选择框
    if (params.prop == 'date') {
      formFilters.dateRange = []
    }
    if (params.prop == 'dateRange') {
      formFilters.date = ''
    }

    // if(params.prop=='categoryId'){
    // 条件改变时直接进行查询
    handleSearch()
    // }
  }

  // 表单配置项
  const formItems: SearchFormItem[] = [
    {
      label: '标题',
      prop: 'title',
      type: 'input',
      config: {
        clearable: true
      },
      onChange: handleFormChange
    },
    {
      label: '类型',
      prop: 'type',
      type: 'select',
      config: {
        clearable: false
      },
      options: () => [
        { label: '收入', value: '收入' },
        { label: '支出', value: '支出' }
        // { label: '高级VIP', value: 'svip' },
        // { label: '企业用户', value: 'enterprise', disabled: true }
      ],
      onChange: handleFormChange
    },
    {
      label: '分类',
      prop: 'categoryId',
      type: 'select',
      config: {
        clearable: true
      },
      options: () => categoryListData.value,
      onChange: handleFormChange
    },
    // 支持 9 种日期类型定义
    // 具体可参考 src/components/core/forms/art-search-bar/widget/art-search-date/README.md
    {
      prop: 'date',
      label: '日期',
      type: 'date',
      config: {
        type: 'date',
        placeholder: '请选择日期'
      },
      onChange: handleFormChange
    },
    {
      prop: 'dateRange',
      label: '日期范围',
      type: 'daterange',
      config: {
        type: 'daterange',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间'
      },
      onChange: handleFormChange
    }
  ]

  // 列配置
  const columnOptions = [
    { label: '勾选', type: 'selection' },
    { label: '用户名', prop: 'avatar' },
    { label: '手机号', prop: 'userPhone' },
    { label: '性别', prop: 'gender' },
    { label: '角色', prop: 'role' },
    { label: '状态', prop: 'status' },
    { label: '创建日期', prop: 'createTime' },
    { label: '操作', prop: 'operation' }
  ]

  // 显示对话框
  const showDialog = (type: string, row?: any) => {
    dialogVisible.value = true
    dialogType.value = type

    // 重置表单验证状态
    if (formRef.value) {
      formRef.value.resetFields()
    }

    if (type === 'edit' && row) {
      formData.id = row.id
      formData.datetime = row.recordTime
      formData.title = row.title
      formData.amount = row.amount
      formData.type = row.type
      formData.categoryId = row.category
      formData.remark = row.remark
    } else {
      formData.id = ''
      formData.datetime = getFormattedDatetime()
      formData.title = ''
      formData.amount = '0'
      formData.type = '支出'
      formData.categoryId = -1
      formData.remark = ''
    }
  }

  // 删除用户
  // const deleteUser = () => {
  //   ElMessageBox.confirm('确定要注销该用户吗？', '注销用户', {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     type: 'error'
  //   }).then(() => {
  //     ElMessage.success('注销成功')
  //   })
  // }

  // 动态列配置
  const { columnChecks, columns } = useCheckedColumns(() => [
    {
      prop: 'date',
      label: '日期',
      sortable: true
      //   formatter: (row) => (row.userGender === 1 ? '男' : '女')
    },
    { prop: 'title', label: '标题' },
    { prop: 'amount', label: '金额' },
    { prop: 'type', label: '类型' },
    { prop: 'categoryName', label: '分类' },
    { prop: 'remark', label: '备注' },
    { prop: 'recordTime', label: '记录时间', sortable: true },
    {
      prop: 'operation',
      label: '操作',
      width: 150,
      // fixed: 'right', // 固定在右侧
      // disabled: true,
      formatter: (row: any) => {
        return h('div', [
          h(ArtButtonTable, {
            type: 'edit',
            onClick: () => showDialog('edit', row)
          })
          // h(ArtButtonTable, {
          //   type: 'delete',
          //   onClick: () => deleteUser()
          // })
        ])
      }
    }
  ])

  // 表单实例
  const formRef = ref<FormInstance>()

  // 表单数据
  const formData = reactive({
    id: '',
    datetime: '',
    title: '',
    amount: '0',
    type: '支出',
    categoryId: -1,
    remark: ''
  })

  onMounted(() => {
    getCategoryList()
    getPageListData()
  })

  const handleRefresh = () => {
    getPageListData()
  }

  // 表单验证规则
  const rules = reactive<FormRules>({
    datetime: [{ required: true, message: '请选择时间', trigger: 'change' }],
    title: [{ required: true, message: '请输入描述', trigger: 'blur' }],
    amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
    type: [{ required: true, message: '请选择类型', trigger: 'change' }],
    categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
    remark: [{ required: false, message: '请输入金额', trigger: 'blur' }]
  })

  // 提交表单
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate((valid) => {
      if (valid) {
        console.log('提交form表单:', formData)

        if (dialogType.value === 'add') {
          saveMoneyBook()
        } else {
          editMoneyBook()
        }
        getPageListData()
      }
    })
  }

  // 处理表格分页变化
  const handleSizeChange = (newPageSize: number) => {
    pagination.pageSize = newPageSize
    getPageListData()
  }

  const handleCurrentChange = (newCurrentPage: number) => {
    pagination.currentPage = newCurrentPage
    getPageListData()
  }

  // 查询分页数据
  const getPageListData = async () => {
    loading.value = true
    const params = {
      current: pagination.currentPage,
      size: pagination.pageSize,
      date: formFilters.date,
      title: formFilters.title,
      categoryId: formFilters.categoryId,
      type: formFilters.type,
      dateRangeStart: formFilters.dateRange == null ? '' : formFilters.dateRange[0],
      dateRangeEnd: formFilters.dateRange == null ? '' : formFilters.dateRange[1],
      path: formFilters.path
    }

    try {
      const res = await moneyBookService.getPageList(params)

      if (res.code == ApiStatus.success) {
        tableData.value = res.data.records
        loading.value = false

        pagination.currentPage = res.data.current
        pagination.pageSize = res.data.size
        pagination.total = res.data.total
      }
    } catch (error) {
      console.log('查询失败:', error)
      loading.value = false
    }
  }

  // 新增记录
  const saveMoneyBook = async () => {
    try {
      const res = await moneyBookService.save(formData)

      if (res.code == ApiStatus.success) {
        ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
        dialogVisible.value = false
      } else {
        ElMessage.error(dialogType.value === 'add' ? '添加失败' : '更新失败')
      }
    } catch (error) {
      console.log('新增失败:', error)
      ElMessage.error(dialogType.value === 'add' ? '添加失败' : '更新失败')
    }
  }

  // 更新记录
  const editMoneyBook = async () => {
    try {
      const res = await moneyBookService.edit(formData)

      if (res.code == ApiStatus.success) {
        ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
        dialogVisible.value = false
      } else {
        ElMessage.error(dialogType.value === 'add' ? '添加失败' : '更新失败')
      }
    } catch (error) {
      console.log('更新失败:', error)
      ElMessage.error(dialogType.value === 'add' ? '添加失败' : '更新失败')
    }
  }

  // 查询分类列表
  const getCategoryList = async () => {
    try {
      const res = await categoryService.getLeafList()

      if (res.code == ApiStatus.success) {
        categoryListData.value = res.data
      }
    } catch (error) {
      console.log('查询失败:', error)
    }
  }

  const getFormattedDatetime = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = (today.getMonth() + 1).toString().padStart(2, '0') // 月份是从 0 开始的，需要加 1
    const day = today.getDate().toString().padStart(2, '0') // 前补零
    const hour = today.getHours().toString().padStart(2, '0') // 前补零
    const minute = today.getMinutes().toString().padStart(2, '0') // 前补零
    const second = today.getSeconds().toString().padStart(2, '0') // 前补零

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }
</script>

<style lang="scss" scoped>
  .account-page {
    :deep(.user) {
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 6px;
      }

      > div {
        margin-left: 10px;

        .user-name {
          font-weight: 500;
          color: var(--art-text-gray-800);
        }
      }
    }
  }
</style>
