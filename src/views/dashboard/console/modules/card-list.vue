<template>
  <ElRow :gutter="20" class="flex">
    <ElCol v-for="(item, index) in dataList" :key="index" :sm="12" :md="6" :lg="6">
      <div class="art-card relative flex flex-col justify-center h-35 px-5 mb-5 max-sm:mb-4">
        <span class="text-g-700 text-sm">{{ item.des }}</span>
        <ArtCountTo
          class="text-[26px] font-medium mt-2"
          :target="item.num"
          :duration="1300"
          :decimals="2"
        />
        <div class="flex-c mt-1">
          <span class="text-xs text-g-600">较上年</span>
          <span
            class="ml-1 text-xs font-semibold"
            :class="item.change.includes('+') ? 'text-success' : 'text-danger'"
          >
            {{ item.change }}
          </span>
        </div>
        <div
          class="absolute top-0 bottom-0 right-5 m-auto size-12.5 rounded-xl flex-cc bg-theme/10"
        >
          <!-- 本地字典取图标 -->
          <ArtSvgIcon :icon="DASHBOARD_ICON[item.des]" class="text-xl text-theme" />
        </div>
      </div>
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { fetchStatCardList } from '@/api/dashboard'
  import { DASHBOARD_ICON } from '@/utils/constants/icon'

  /* 响应式数据 */
  const dataList = ref<Api.Dashboard.CardDataItem[]>([])
  const loading = ref(false)
  const error = ref('')

  /* 拉取数据 */
  const loadData = async () => {
    loading.value = true
    error.value = ''
    try {
      const res = await fetchStatCardList()
      dataList.value = (res as any).data ?? res
    } catch (e: any) {
      error.value = e?.message || '网络错误'
    } finally {
      loading.value = false
    }
  }

  /* 组件挂载后自动请求 */
  onMounted(() => loadData())
</script>
