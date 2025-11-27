<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '新增交易记录' : '编辑交易记录'"
    width="30%"
    align-center
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <ElFormItem label="标题" prop="title">
        <ElInput v-model="formData.title" placeholder="请输入标题" />
      </ElFormItem>
      <ElFormItem label="金额" prop="amount">
        <ElInput v-model="formData.amount" placeholder="请输入金额" />
      </ElFormItem>
      <ElFormItem label="类型" prop="type">
        <ElSelect v-model="formData.type">
          <ElOption label="收入" value="1" />
          <ElOption label="支出" value="2" />
          <ElOption label="收支" value="3" />
        </ElSelect>
      </ElFormItem>
      <!-- <ElFormItem label="角色" prop="role">
        <ElSelect v-model="formData.role">
          <ElOption
            v-for="role in roleList"
            :key="role.roleCode"
            :value="role.roleCode"
            :label="role.roleName"
          />
        </ElSelect>
      </ElFormItem> -->
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit">提交</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  // import { ROLE_LIST_DATA } from '@/mock/temp/formData'
  import type { FormInstance, FormRules } from 'element-plus'

  interface Props {
    visible: boolean
    type: string
    transData?: Partial<Api.TransDetail.TransDetailItem>
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 角色列表数据
  // const roleList = ref(ROLE_LIST_DATA)

  // 对话框显示控制
  const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  })

  const dialogType = computed(() => props.type)

  // 表单实例
  const formRef = ref<FormInstance>()

  // 表单数据
  const formData = reactive({
    title: '',
    amount: 0,
    type: 2,
    cid: 85
  })

  // 表单验证规则
  const rules: FormRules = {
    title: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    amount: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^-?\d+(\.\d{1,2})?$/, message: '金额格式错误，最多两位小数', trigger: 'blur' }
    ],
    type: [{ required: true, message: '请选择交易类型', trigger: 'blur' }]
  }

  /**
   * 初始化表单数据
   * 根据对话框类型（新增/编辑）填充表单
   */
  const initFormData = () => {
    const isEdit = props.type === 'edit' && props.transData
    const row = props.transData

    Object.assign(formData, {
      title: isEdit && row ? row.title || '' : '',
      amount: isEdit && row ? row.amount || '' : '',
      type: isEdit && row ? row.type || '' : ''
    })
  }

  /**
   * 监听对话框状态变化
   * 当对话框打开时初始化表单数据并清除验证状态
   */
  watch(
    () => [props.visible, props.type, props.transData],
    ([visible]) => {
      if (visible) {
        initFormData()
        nextTick(() => {
          formRef.value?.clearValidate()
        })
      }
    },
    { immediate: true }
  )

  /**
   * 提交表单
   * 验证通过后触发提交事件
   */
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate((valid) => {
      if (valid) {
        ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
        dialogVisible.value = false
        emit('submit')
      }
    })
  }
</script>
