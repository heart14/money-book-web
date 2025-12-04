<template>
  <div class="page-content mb-5">
    <!-- 日历主体 -->
    <ElCalendar v-model="currentDate" v-loading="loading">
      <template #date-cell="{ data }">
        <!-- 根节点加上点击事件，但事件块自己 stop 阻止冒泡 -->
        <div
          class="relative flex flex-col h-full min-h-30 max-h-30 p-1 overflow-hidden c-p"
          :class="{ 'is-selected': data.isSelected }"
          @click="handleCellClick(data.day)"
        >
          <!-- 草稿图标：仅弹出日记窗，不再冒泡到新增事件 -->
          <div
            @click.stop="handleDiaryClick(data.day)"
            class="c-p px-1 py-0.5 rounded"
            :class="
              diaryMap[data.day]?.workShift
                ? [
                    getEventClasses(diaryMap[data.day].workShift as any).bgClass,
                    getEventClasses(diaryMap[data.day].workShift as any).textClass
                  ]
                : []
            "
          >
            <ArtSvgIcon icon="ri:heart-2-line" />
          </div>

          <!-- 日期 -->
          <p class="absolute top-1 right-1 text-sm">{{ formatDate(data.day) }}</p>

          <!-- 事件列表：点击自己 stop，避免冒泡到根节点触发新增 -->
          <div class="flex flex-col gap-1 w-full max-h-21 pr-1 mt-6 overflow-y-auto">
            <div
              v-for="event in getEvents(data.day)"
              :key="`${event.date}-${event.content}`"
              @click.stop="handleEventClick(event)"
            >
              <div
                class="min-w-25 px-3 py-1.5 overflow-hidden text-xs/6 font-medium text-ellipsis whitespace-nowrap rounded hover:opacity-80"
                :class="[event.bgClass, event.textClass]"
              >
                {{ event.content }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </ElCalendar>

    <!-- 事件编辑弹窗 -->
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="600px" @closed="resetForm">
      <ElForm :model="eventForm" label-width="80px">
        <ElFormItem label="活动标题" required>
          <ElInput v-model="eventForm.content" placeholder="请输入活动标题" />
        </ElFormItem>
        <ElFormItem label="开始日期" required>
          <ElDatePicker
            style="width: 100%"
            v-model="eventForm.date"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </ElFormItem>
        <ElFormItem label="结束日期">
          <ElDatePicker
            style="width: 100%"
            v-model="eventForm.endDate"
            type="date"
            placeholder="选择结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :min-date="eventForm.date"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <span class="dialog-footer">
          <ElButton v-if="isEditing" type="danger" @click="handleDeleteEvent"> 删除 </ElButton>
          <ElButton type="primary" @click="handleSaveEvent">
            {{ isEditing ? '更新' : '添加' }}
          </ElButton>
        </span>
      </template>
    </ElDialog>

    <!-- 日记编辑弹窗 -->
    <ElDialog v-model="diaryDialog" title="日记" width="600px" @closed="diaryDialog = false">
      <ElForm :model="diaryForm" label-width="80px">
        <ElFormItem label="日期">
          <ElInput v-model="diaryForm.date" disabled />
        </ElFormItem>
        <ElFormItem label="班次">
          <ElRadioGroup v-model="diaryForm.workShift">
            <ElRadio v-for="type in workShiftTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="内容">
          <ElInput
            v-model="diaryForm.diaryContent"
            type="textarea"
            :rows="6"
            placeholder="请输入日记内容"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton type="primary" @click="handleSaveDiary">保存</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { fetchEventList, fetchDiaryList } from '@/api/dashboard'

  const loading = ref(false)
  const error = ref('')
  /**
   * 后端接口返回的数据结构
   */
  const eventData = ref<Api.CalendarEvent.CalendarEventItem[]>([])

  /**
   * 日历事件类型定义
   */
  interface CalendarEvent {
    date: string
    endDate?: string
    content: string
    type?: 'info' | 'primary' | 'success' | 'warning' | 'danger'
    bgClass?: string
    textClass?: string
  }

  /**
   * 事件类型选项
   */
  const workShiftTypes = [
    { label: '早班', value: 'primary' },
    { label: '白班', value: 'success' },
    { label: '晚班', value: 'warning' },
    { label: '休息', value: 'info' }
  ] as const

  const currentDate = ref(new Date())
  const dialogVisible = ref(false)
  const dialogTitle = ref('添加事件')
  const editingEventIndex = ref<number>(-1)

  /**
   * 事件列表数据
   */
  const events = ref<CalendarEvent[]>([])

  const loadEventData = async (ym: string) => {
    loading.value = true
    error.value = ''
    try {
      const res = await fetchEventList({ yearMonth: ym })
      eventData.value = (res as any).data ?? res
      // 将后端返回数据映射到前端所需要的数据结构
      events.value = eventData.value.map((it: any) => ({
        date: it.date,
        endDate: it.endDate,
        content: it.content,
        type: it.type || 'info'
      }))
    } catch (e: any) {
      error.value = e?.message || '网络错误'
    } finally {
      loading.value = false
    }
  }

  /**
   * 事件表单数据
   */
  const eventForm = ref<CalendarEvent>({
    date: '',
    endDate: '',
    content: '',
    type: 'primary'
  })

  /**
   * 是否处于编辑模式
   */
  const isEditing = computed(() => editingEventIndex.value >= 0)

  /**
   * 格式化日期，只显示日
   * @param date 完整日期字符串
   * @returns 日期中的日部分
   */
  const formatDate = (date: string) => date.split('-')[2]

  /**
   * 获取事件类型对应的样式类名
   * @param type 事件类型
   * @returns 包含背景和文字颜色的类名对象
   */
  const getEventClasses = (type: CalendarEvent['type'] = 'primary') => {
    const classMap = {
      info: { bgClass: 'bg-info/12', textClass: 'text-info' },
      primary: { bgClass: 'bg-theme/12', textClass: 'text-theme' },
      success: { bgClass: 'bg-success/12', textClass: 'text-success' },
      warning: { bgClass: 'bg-warning/12', textClass: 'text-warning' },
      danger: { bgClass: 'bg-danger/12', textClass: 'text-danger' }
    }
    return classMap[type]
  }

  /**
   * 获取指定日期的所有事件
   * 支持跨日期事件的显示
   * @param day 日期字符串
   * @returns 该日期的事件列表
   */
  const getEvents = (day: string) => {
    return events.value
      .filter((event) => {
        const eventDate = new Date(event.date)
        const currentDate = new Date(day)
        const endDate = event.endDate ? new Date(event.endDate) : new Date(event.date)

        return currentDate >= eventDate && currentDate <= endDate
      })
      .map((event) => {
        const { bgClass, textClass } = getEventClasses(event.type)
        return { ...event, bgClass, textClass }
      })
  }

  /**
   * 重置表单数据
   */
  const resetForm = () => {
    eventForm.value = {
      date: '',
      endDate: '',
      content: '',
      type: 'primary'
    }
    editingEventIndex.value = -1
  }

  /**
   * 处理日历单元格点击事件
   * 打开添加事件弹窗
   * @param day 点击的日期
   */
  const handleCellClick = (day: string) => {
    dialogTitle.value = '添加事件'
    eventForm.value = {
      date: day,
      content: '',
      type: 'primary'
    }
    editingEventIndex.value = -1
    dialogVisible.value = true
  }

  /**
   * 处理事件点击
   * 打开编辑事件弹窗
   * @param event 点击的事件对象
   */
  const handleEventClick = (event: CalendarEvent) => {
    dialogTitle.value = '编辑事件'
    eventForm.value = { ...event }
    editingEventIndex.value = events.value.findIndex(
      (e) => e.date === event.date && e.content === event.content
    )
    dialogVisible.value = true
  }

  /**
   * 保存事件
   * 根据编辑模式决定是新增还是更新
   */
  const handleSaveEvent = () => {
    if (!eventForm.value.content || !eventForm.value.date) return

    if (isEditing.value) {
      events.value[editingEventIndex.value] = { ...eventForm.value }
    } else {
      events.value.push({ ...eventForm.value })
    }

    dialogVisible.value = false
    resetForm()
  }

  /**
   * 删除事件
   */
  const handleDeleteEvent = () => {
    if (isEditing.value) {
      events.value.splice(editingEventIndex.value, 1)
      dialogVisible.value = false
      resetForm()
    }
  }

  const diaryMap = ref<Record<string, { diaryContent: string; workShift: string }>>({})
  /* 日记弹窗 */
  const diaryDialog = ref(false)
  const diaryForm = ref({
    date: '',
    diaryContent: '',
    workShift: ''
  })

  const handleDiaryClick = (day: string) => {
    diaryForm.value.date = day
    const hit = diaryMap.value[day]
    diaryForm.value.diaryContent = hit?.diaryContent ?? ''
    diaryForm.value.workShift = hit?.workShift ?? ''
    diaryDialog.value = true
  }

  const handleSaveDiary = async () => {
    // 这里调用你后台的保存接口，例如 saveDiary(diaryForm.value)
    // 保存成功后刷新当月数据
    await loadDiaryData(
      `${currentDate.value.getFullYear()}-${String(currentDate.value.getMonth() + 1).padStart(2, '0')}`
    )
    diaryDialog.value = false
  }

  const loadDiaryData = async (ym: string) => {
    const res = await fetchDiaryList({ yearMonth: ym })
    const list = (res as any).data ?? res
    diaryMap.value = {}
    list.forEach((it: any) => {
      diaryMap.value[it.date] = { diaryContent: it.diaryContent, workShift: it.workShift }
    })
  }

  const loadAllData = async (ym: string) => {
    loading.value = true
    error.value = ''
    try {
      await Promise.all([loadEventData(ym), loadDiaryData(ym)])
    } catch (e: any) {
      error.value = e?.message || '网络错误'
    } finally {
      loading.value = false
    }
  }

  watch(
    currentDate,
    (newVal) => {
      const ym = `${newVal.getFullYear()}-${String(newVal.getMonth() + 1).padStart(2, '0')}`
      loadAllData(ym)
    },
    { immediate: true }
  )
</script>

<style scoped>
  :deep(.el-calendar) {
    height: 100%;
  }

  :deep(.el-calendar__body) {
    height: calc(100% - 70px);
  }

  :deep(.el-calendar-table) {
    height: 100%;
  }

  :deep(.is-selected) {
    background-color: var(--el-color-warning-light-9) !important;
  }

  :deep(.el-calendar-day) {
    height: 100%;
  }

  :deep(.el-calendar-day:hover) {
    background-color: transparent !important;
  }

  :deep(.el-dialog__body) {
    padding-top: 20px;
  }
</style>
