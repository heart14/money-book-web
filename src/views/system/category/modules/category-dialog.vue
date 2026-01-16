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
      <ElButton @click="dialogVisible = false">取消</ElButton>
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
    level: 1,
    path: '',
    isDeleted: 0,
    description: ''
  })

  const rules = {
    name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
  }

  const formItems = computed<FormItem[]>(() => [
    ...(form.parentId && Number(form.level) === 2
      ? [{ label: '上级分类', key: 'parentName', type: 'input', props: { disabled: true } }]
      : []),
    { label: '分类名称', key: 'name', type: 'input' },
    {
      label: '类型',
      key: 'type',
      type: 'select',
      props: {
        options: [
          { label: '收入', value: 1 },
          { label: '支出', value: 2 },
          { label: '收支', value: 3 }
        ],
        // 禁用规则：编辑时不可改；新增子类（有 parentId）时也不可改；仅在新增顶级分类时可改。
        disabled: isEdit.value || !!form.parentId
      }
    },
    {
      label: '层级',
      key: 'level',
      type: 'select',
      props: {
        options: [
          { label: '一级分类', value: 1 },
          { label: '二级分类', value: 2 }
        ],
        disabled: isEdit.value || !!form.parentId
      }
    },
    {
      label: '状态',
      key: 'isDeleted',
      type: 'switch',
      props: {
        activeValue: 0,
        inactiveValue: 1,
        activeColor: '#67C23A',
        inactiveColor: '#F56C6C',
        activeText: '正常',
        inactiveText: '禁用',
        inlinePrompt: true,
        // showText: true,
        style: '--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949'
      }
    },
    { label: '描述', key: 'description', type: 'textarea', props: { rows: 4 } }
  ])

  function loadData() {
    if (!props.editData) return
    Object.assign(form, {
      id: props.editData.id,
      parentId: props.editData.parentId,
      parentName: props.editData.parentName,
      name: props.editData.name,
      // 优先使用 editData.type（编辑已有项），若不存在则使用父分类的类型（新增子类场景）
      type: props.editData.type ?? props.editData.parentType ?? 1,
      level:
        props.editData.level ??
        (props.editData.parentId ? Number(props.editData.level ?? 1) + 1 : 1),
      path: props.editData.path ?? '',
      isDeleted: props.editData.isDeleted ?? 0,
      description: props.editData.description ?? ''
    })
  }

  function onSubmit() {
    formRef.value.validate((valid: boolean) => {
      if (!valid) return
      // 提交时只发送后台需要的字段
      const payload: any = {
        id: form.id,
        parentId: form.parentId,
        name: form.name,
        type: Number(form.type),
        level: Number(form.level),
        path: form.path,
        isDeleted: Number(form.isDeleted),
        description: form.description
      }

      emit('submit', payload)
    })
  }

  function onClosed() {
    formRef.value?.reset()
    Object.assign(form, {
      id: undefined,
      parentId: undefined,
      parentName: '',
      name: '',
      type: 1,
      level: 1,
      path: '',
      isDeleted: 0,
      description: ''
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
