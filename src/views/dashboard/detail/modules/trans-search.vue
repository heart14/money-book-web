<template>
  <ArtSearchBar
    ref="searchBarRef"
    v-model="formData"
    :items="formItems"
    :rules="rules"
    @reset="handleReset"
    @search="handleSearch"
  >
  </ArtSearchBar>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { fetchCategoryList } from '@/api/dashboard'

  interface Props {
    modelValue: Record<string, any>
  }
  interface Emits {
    (e: 'update:modelValue', value: Record<string, any>): void
    (e: 'search', params: Record<string, any>): void
    (e: 'reset'): void
  }
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 表单数据双向绑定
  const searchBarRef = ref()
  const formData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  // 校验规则
  const rules = {
    // userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
  }

  // 动态 options
  const categoryOptions = ref<{ label: string; value: number }[]>([])

  // 收支类型数据
  const typeOptions = ref([
    { label: '收入', value: '1' },
    { label: '支出', value: '2' },
    { label: '收支', value: '3' }
  ])

  // 获取分类数据
  const loadCategoryOptions = async () => {
    const res = await fetchCategoryList({ type: formData.value.type, level: 2 })
    categoryOptions.value = res.map((i) => ({ label: i.name, value: i.id }))
  }

  /**
   * 日期快捷选项
   */
  const DATE_SHORTCUTS = [
    {
      text: '今日',
      value: [new Date(), new Date()]
    },
    {
      text: '昨日',
      value: () => {
        const start = new Date()
        const end = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24)
        end.setTime(end.getTime() - 3600 * 1000 * 24)
        return [start, end]
      }
    },
    {
      text: '近七日',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        return [start, end]
      }
    },
    {
      text: '近三十天',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        return [start, end]
      }
    }
  ]

  onMounted(async () => {
    loadCategoryOptions()
  })

  watch(
    () => formData.value.type,
    () => {
      formData.value.cid = undefined
      loadCategoryOptions()
    },
    { immediate: true }
  )

  // 表单配置
  const formItems = computed(() => [
    {
      label: '收支类型',
      key: 'type',
      type: 'select',
      props: {
        placeholder: '请选择收支类型',
        options: typeOptions.value
      }
    },
    {
      label: '交易分类',
      key: 'cid',
      type: 'select',
      props: {
        placeholder: '请选择分类',
        options: categoryOptions.value
      }
    },
    {
      label: '日期范围',
      key: 'daterange',
      type: 'datetime',
      props: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        rangeSeparator: '至',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        shortcuts: DATE_SHORTCUTS
      }
    },
    {
      label: '标题',
      key: 'title',
      type: 'input',
      placeholder: '请输入交易标题',
      clearable: true
    },
    {
      label: '备注',
      key: 'remark',
      type: 'input',
      props: { placeholder: '请输入备注' }
    }
  ])

  // 事件
  function handleReset() {
    console.log('重置表单')
    emit('reset')
  }

  async function handleSearch() {
    await searchBarRef.value.validate()
    emit('search', formData.value)
    console.log('表单数据', formData.value)
  }
</script>
