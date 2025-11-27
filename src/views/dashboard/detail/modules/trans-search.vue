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
  const typeOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([])
  const categoryOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([])

  // 模拟接口返回收支类型数据
  function fetchTypeOptions(): Promise<typeof typeOptions.value> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label: '收入', value: '1' },
          { label: '支出', value: '2' },
          { label: '收支', value: '3' }
        ])
      }, 1000)
    })
  }

  // 模拟接口返回分类数据
  function fetchCategoryOptions(): Promise<typeof categoryOptions.value> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label: '薪酬福利', value: '11' },
          { label: '绩效奖金', value: '12' },
          { label: '其它', value: '21' },
          { label: '餐饮美食', value: '31' },
          { label: '生鲜食材', value: '32' },
          { label: '烟酒茶叶', value: '33' },
          { label: '生活缴费', value: '41' },
          { label: '日用百货', value: '42' },
          { label: '医疗保健', value: '43' },
          { label: '服饰装扮', value: '44' },
          { label: '美妆护理', value: '45' },
          { label: '公共交通', value: '51' },
          { label: '汽车购置', value: '52' },
          { label: '保养维修', value: '53' },
          { label: '加油充电', value: '54' },
          { label: '停车过路', value: '55' },
          { label: '旅游出行', value: '61' },
          { label: '文娱演出', value: '62' },
          { label: '运动户外', value: '63' },
          { label: '3C数码', value: '64' },
          { label: '创意潮玩', value: '65' },
          { label: '充值订阅', value: '66' },
          { label: '宠物消费', value: '71' },
          { label: '订婚', value: '81' },
          { label: '婚礼', value: '82' },
          { label: '购房', value: '83' },
          { label: '装修', value: '84' },
          { label: '未分类', value: '85' },
          { label: '红包转账', value: '91' },
          { label: '投资理财', value: '92' },
          { label: '借贷还款', value: '93' }
        ])
      }, 1000)
    })
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
    typeOptions.value = await fetchTypeOptions()
    categoryOptions.value = await fetchCategoryOptions()
  })

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
