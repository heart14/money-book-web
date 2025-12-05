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
                    getShiftClasses(diaryMap[data.day]?.workShift).bgClass,
                    getShiftClasses(diaryMap[data.day]?.workShift).textClass
                  ]
                : []
            "
          >
            <ArtSvgIcon icon="ri:book-3-line" />
          </div>

          <!-- 日期 -->
          <p class="absolute top-2 right-2 text-sm">{{ formatDate(data.day) }}</p>

          <!-- 事件列表：点击自己 stop，避免冒泡到根节点触发新增 -->
          <div class="flex flex-col gap-1 w-full max-h-21 pr-1 mt-6 overflow-y-auto">
            <div
              v-for="event in getEvents(data.day)"
              :key="`${event.date}-${event.content}`"
              @click.stop="handleEventClick(event)"
            >
              <div
                class="min-w-25 px-2.5 py-0.4 overflow-hidden text-xs/6 font-medium text-ellipsis whitespace-nowrap rounded hover:opacity-80"
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
        <ElFormItem label="Tag" required>
          <ElInput v-model="eventForm.content" placeholder="请输入事件tag" />
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
  import {
    fetchEventList,
    postEventTag,
    deleteEventTag,
    fetchDiaryList,
    postDiary
  } from '@/api/dashboard'

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
    id: number
    date: string
    endDate?: string
    content: string
    bgClass?: string
    textClass?: string
  }

  /**
   * 事件类型选项
   */
  const workShiftTypes = [
    { label: '早班', value: 'EARLY' },
    { label: '白班', value: 'DAY' },
    { label: '晚班', value: 'NIGHT' },
    { label: '休息', value: 'REST' }
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
        id: it.id,
        date: it.date,
        endDate: it.endDate,
        content: it.content
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
    id: 0,
    date: '',
    endDate: '',
    content: ''
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
   * 班次 -> 颜色类名
   */
  const shiftColorMap = {
    EARLY: { bgClass: 'bg-success/3', textClass: 'text-success' },
    DAY: { bgClass: 'bg-primary/3', textClass: 'text-primary' },
    NIGHT: { bgClass: 'bg-warning/3', textClass: 'text-warning' },
    REST: { bgClass: 'bg-info/3', textClass: 'text-info' }
  } as const

  /**
   * 获取班次对应的样式类名
   * @param shift 班次
   * @returns 包含背景和文字颜色的类名对象
   */
  const getShiftClasses = (shift: string | undefined) => {
    return shift
      ? shiftColorMap[shift as keyof typeof shiftColorMap]
      : { bgClass: '', textClass: '' }
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
        const { bgClass, textClass } = { bgClass: 'bg-info/12', textClass: 'text-info' }
        return { ...event, bgClass, textClass }
      })
  }

  /**
   * 重置表单数据
   */
  const resetForm = () => {
    eventForm.value = {
      id: 0,
      date: '',
      endDate: '',
      content: ''
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
      id: 0,
      date: day,
      content: ''
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
  const handleSaveEvent = async () => {
    if (!eventForm.value.content || !eventForm.value.date) return

    const payload = {
      id: isEditing.value ? eventForm.value.id : undefined, // 新增不传 id
      date: eventForm.value.date,
      endDate: eventForm.value.endDate || undefined,
      content: eventForm.value.content.trim()
    }

    try {
      await postEventTag(payload)
      ElMessage.success('保存成功')
      // 保存成功后刷新当月数据
      await loadEventData(
        `${currentDate.value.getFullYear()}-${String(currentDate.value.getMonth() + 1).padStart(2, '0')}`
      )
      dialogVisible.value = false
      resetForm()
    } catch (e: any) {
      ElMessage.error(e?.message || '保存失败')
    }
  }

  /**
   * 删除事件
   */
  const handleDeleteEvent = async () => {
    if (!isEditing.value) return
    try {
      await deleteEventTag({ id: eventForm.value.id })
      ElMessage.success('删除成功')
      await loadEventData(
        `${currentDate.value.getFullYear()}-${String(currentDate.value.getMonth() + 1).padStart(2, '0')}`
      )
      dialogVisible.value = false
      resetForm()
    } catch (e: any) {
      ElMessage.error(e?.message || '删除失败')
    }
  }

  const diaryMap = ref<Record<string, { id: number; diaryContent: string; workShift: string }>>({})
  /* 日记弹窗 */
  const diaryDialog = ref(false)
  const diaryForm = ref({
    id: 0,
    date: '',
    diaryContent: '',
    workShift: ''
  })

  const handleDiaryClick = (day: string) => {
    diaryForm.value.date = day
    const hit = diaryMap.value[day]
    diaryForm.value.id = hit?.id ?? 0
    diaryForm.value.diaryContent = hit?.diaryContent ?? ''
    diaryForm.value.workShift = hit?.workShift ?? ''
    diaryDialog.value = true
  }

  const handleSaveDiary = async () => {
    if (!diaryForm.value.diaryContent && !diaryForm.value.workShift) return

    const payload = {
      id: diaryForm.value.id,
      date: diaryForm.value.date,
      workShift: diaryForm.value.workShift,
      diaryContent: diaryForm.value.diaryContent.trim()
    }

    try {
      await postDiary(payload)
      // 保存成功后刷新当月数据
      await loadDiaryData(
        `${currentDate.value.getFullYear()}-${String(currentDate.value.getMonth() + 1).padStart(2, '0')}`
      )
      ElMessage.success('保存成功')
      // 关闭日记弹窗
      diaryDialog.value = false
    } catch (e: any) {
      ElMessage.error(e?.message || '保存失败')
    }
  }

  const loadDiaryData = async (ym: string) => {
    const res = await fetchDiaryList({ yearMonth: ym })
    const list = (res as any).data ?? res
    diaryMap.value = {}
    list.forEach((it: any) => {
      diaryMap.value[it.date] = {
        id: it.id,
        diaryContent: it.diaryContent,
        workShift: it.workShift
      }
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
