<template>
  <ArtBasicBanner
    class="banner"
    :title="`欢迎回来 ${userInfo.nickname}`"
    :showButton="false"
    backgroundColor="var(--el-color-primary-light-9)"
    titleColor="var(--art-gray-900)"
    subtitleColor="#666"
    style="height: 13.3rem"
    :backgroundImage="bannerCover"
    :showDecoration="false"
    imgWidth="18rem"
    imgBottom="-7.5rem"
    :showMeteors="true"
    @click="handleBannerClick"
  >
    <div class="banner-slot">
      <div class="item">
        <p class="title"
          >¥
          <CountTo
            class="number box-title"
            :endVal="totalExpense"
            :duration="1000"
            separator=","
            :decimals="2"
          ></CountTo
          ><i class="iconfont-sys text-success">&#xe8d5;</i></p
        >
        <p class="subtitle">今日支出</p>
      </div>
      <div class="item">
        <p class="title"
          >¥
          <CountTo
            class="number box-title"
            :endVal="totalIncome"
            :duration="1000"
            separator=","
            :decimals="2"
          ></CountTo
          ><i class="iconfont-sys text-success">&#xe8d5;</i></p
        >
        <p class="subtitle">今日收入</p>
      </div>
    </div>
  </ArtBasicBanner>
</template>

<script setup lang="ts">
  import bannerCover from '@imgs/login/lf_icon2.png'
  import { useUserStore } from '@/store/modules/user'
  import { CountTo } from 'vue3-count-to'
  import { moneyBookService } from '@/api/moneyBookApi'
  import { ApiStatus } from '@/utils/http/status'

  const userStore = useUserStore()

  const userInfo = computed(() => userStore.getUserInfo)

  const totalExpense = ref(0)
  const totalIncome = ref(0)

  const handleBannerClick = () => {
    getTotalAmountData()
  }

  const getTotalAmountData = async () => {
    const params = {
      date: getFormattedDate()
    }

    const res = await moneyBookService.getTotalAmount(params)

    // TODO
    if (res.code == ApiStatus.success) {
      totalExpense.value = res.data.totalExpense
      totalIncome.value = res.data.totalIncome
    }
  }

  onMounted(() => {
    getTotalAmountData()
  })

  function getFormattedDate(): string {
    const today = new Date()
    const year = today.getFullYear()
    const month = (today.getMonth() + 1).toString().padStart(2, '0') // 月份是从 0 开始的，需要加 1
    const day = today.getDate().toString().padStart(2, '0') // 日期前补零

    return `${year}-${month}-${day}`
  }
</script>

<style lang="scss" scoped>
  .banner {
    .banner-slot {
      display: flex;

      .item {
        margin-right: 30px;

        &:first-of-type {
          padding-right: 30px;
          border-right: 1px solid var(--art-gray-300);
        }

        .title {
          font-size: 30px;
          color: var(--art-gray-900) !important;

          i {
            position: relative;
            top: -10px;
            margin-left: 10px;
            font-size: 16px;
          }
        }

        .subtitle {
          margin-top: 4px;
          font-size: 14px;
          color: var(--art-gray-700) !important;
        }
      }
    }
  }
</style>
