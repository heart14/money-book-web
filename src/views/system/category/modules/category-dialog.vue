<template>
  <ElDialog
    :title="isEdit ? '编辑分类' : '新增分类'"
    v-model="dialogVisible"
    width="520px"
    align-center
    @closed="onClosed"
  >
    <ArtForm
      ref="formRef"
      v-model="form"
      :items="formItems"
      :rules="rules"
      :span="24"
      label-width="90px"
      :show-reset="false"
      :show-submit="false"
    />

    <template #footer>
      <ElButton @click:="dialogVisible">取消</ElButton>
      <ElButton type="primary" @click="onSubmit">确定</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormItem } from '@/components/core/forms/art-form/index.vue'
  import ArtForm from '@/components/core/forms/art-form/index.vue'

  interface Props {
    visible: boolean
    editData?: any
  }
  const props = defineProps<Props>()
  const emit = defineEmits(['update:visible', 'submit'])

  const formRef = ref()
  const isEdit = computed(() => !!props.editData?.id)

  const form = reactive({
    id: undefined as number | undefined,
    parentId: undefined as number | undefined,
    parentName: '',
    name: '',
    type: 1,
    sort: 1
  })

  const rules = {
    name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
  }

  const formItems = computed<FormItem[]>(() => [
    ...(form.parentId
      ? [{ label: '上级分类', key: 'parentName', type: 'input', props: { disabled: true } }]
      : []),
    { label: '分类名称', key: 'name', type: 'input' },
    {
      label: '类型',
      key: 'type',
      type: 'radio',
      props: {
        options: [
          { label: '收入', value: 0 },
          { label: '支出', value: 1 }
        ]
      }
    },
    { label: '排序', key: 'sort', type: 'number', props: { min: 1 } }
  ])

  function loadData() {
    if (!props.editData) return
    Object.assign(form, {
      id: props.editData.id,
      parentId: props.editData.parentId,
      parentName: props.editData.parentName,
      name: props.editData.name,
      type: props.editData.type,
      sort: props.editData.sort
    })
  }

  function onSubmit() {
    formRef.value.validate((valid: boolean) => {
      if (!valid) return
      emit('submit', { ...form })
    })
  }

  function onClosed() {
    formRef.value.resetFields()
    Object.assign(form, {
      id: undefined,
      parentId: undefined,
      parentName: '',
      name: '',
      type: 1,
      sort: 1
    })
  }

  const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
  })

  watch(
    () => props.visible,
    (v) => v && nextTick(loadData)
  )
</script>
