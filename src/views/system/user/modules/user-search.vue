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
  const statusOptions = ref<{ label: string; value: number; disabled?: boolean }[]>([
    { label: '正常', value: 1 },
    { label: '异常', value: 0 },
    { label: '注销', value: 2 }
  ])

  // onMounted(async () => {
  //   statusOptions.value = await fetchStatusOptions()
  // })

  // 表单配置
  const formItems = computed(() => [
    {
      label: '用户账号',
      key: 'username',
      type: 'input',
      placeholder: '请输入用户名',
      clearable: true
    },
    {
      label: '用户昵称',
      key: 'nickname',
      type: 'input',
      placeholder: '请输入用户昵称',
      clearable: true
    },
    {
      label: '状态',
      key: 'status',
      type: 'select',
      props: {
        placeholder: '请选择状态',
        options: statusOptions.value
      }
    }
    // {
    //   label: '性别',
    //   key: 'userGender',
    //   type: 'radiogroup',
    //   props: {
    //     options: [
    //       { label: '男', value: '1' },
    //       { label: '女', value: '2' }
    //     ]
    //   }
    // }
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
