<template>
  <div class="custom-card art-custom-card today-sales">
    <div class="custom-card-header">
      <span class="title">{{ t('analysis.todaySales.title') }}</span>
      <span class="subtitle">{{ t('analysis.todaySales.subtitle') }}</span>
      <div class="export-btn">
        <i class="iconfont-sys">&#xe6d1;</i>
        <span>{{ t('analysis.todaySales.export') }}</span>
      </div>
    </div>
    <div class="sales-summary">
      <el-row :gutter="20">
        <el-col :span="4" :xs="24">
          <div :class="['sales-card art-custom-card']">
            <p>统计条件</p>
            <el-switch
              v-model="statisCondition"
              size="large"
              class="ml-2"
              inline-prompt
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #13ce66"
              active-text="本月"
              active-value="month"
              inactive-text="本年"
              inactive-value="year"
              @change="changeCondition"
            />
          </div>
        </el-col>
        <el-col :span="4" :xs="24" v-for="(item, index) in salesData" :key="index">
          <div :class="['sales-card art-custom-card']">
            <i class="iconfont-sys" :class="item.class" v-html="item.iconfont"></i>
            <h2>
              <CountTo
                class="number box-title"
                :endVal="item.value"
                :duration="1000"
                separator=""
                :decimals="2"
              ></CountTo>
            </h2>
            <p>{{ item.label }}</p>
            <small>{{ item.change }} {{ changeTitle }}</small>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, defineEmits } from 'vue'
  import { CountTo } from 'vue3-count-to'
  import { useI18n } from 'vue-i18n'
  import { moneyBookService } from '@/api/moneyBookApi'
  import { ApiStatus } from '@/utils/http/status'
  const emit = defineEmits<{
    (e: 'update:statisCondition', value: string): void
  }>()

  const { t } = useI18n()

  const statisCondition = ref('')
  const changeTitle = ref('')

  const changeCondition = () => {
    console.log('switch state: ' + statisCondition.value)
    if (statisCondition.value == 'year') {
      changeTitle.value = '较上年'
    } else {
      changeTitle.value = '较上月'
    }
    getStatisticData()
    emit('update:statisCondition', statisCondition.value)
  }

  const salesData = ref([
    {
      label: t('analysis.todaySales.cards.totalExpense.label'),
      value: 999,
      change: t('analysis.todaySales.cards.totalExpense.change'),
      iconfont: '&#xe7d9',
      class: 'bg-error'
    },
    {
      label: t('analysis.todaySales.cards.totalExpenseCount.label'),
      value: 300,
      change: t('analysis.todaySales.cards.totalExpenseCount.change'),
      iconfont: '&#xe7d9',
      class: 'bg-error'
    },
    {
      label: t('analysis.todaySales.cards.totalIncome.label'),
      value: 56,
      change: t('analysis.todaySales.cards.totalIncome.change'),
      iconfont: '&#xe70f',
      class: 'bg-warning'
    },
    {
      label: t('analysis.todaySales.cards.totalIncomeCount.label'),
      value: 68,
      change: t('analysis.todaySales.cards.totalIncomeCount.change'),
      iconfont: '&#xe70f',
      class: 'bg-warning'
    },
    {
      label: t('analysis.todaySales.cards.balance.label'),
      value: 28,
      change: t('analysis.todaySales.cards.balance.change'),
      iconfont: '&#xe712',
      class: 'bg-success'
    }
  ])

  const getStatisticData = async () => {
    const params = {
      conditionType: statisCondition.value
    }

    const res = await moneyBookService.getStatisticData(params)

    console.log('statis data : ' + res.data)

    if (res.code == ApiStatus.success) {
      salesData.value = res.data
    }
  }

  onMounted(() => {
    getStatisticData()
  })
</script>

<style lang="scss" scoped>
  .today-sales {
    height: 330px;

    .export-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 66px;
      padding: 6px 0;
      color: var(--art-gray-600);
      cursor: pointer;
      border: 1px solid var(--art-border-dashed-color);
      border-radius: 6px;
      transition: all 0.3s;

      &:hover {
        color: var(--main-color);
        border-color: var(--main-color);
      }

      .iconfont-sys {
        margin-right: 5px;
        font-size: 10px;
      }

      span {
        font-size: 12px;
      }
    }

    .sales-summary {
      padding: 20px;

      .sales-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 220px;
        padding: 0 20px;
        overflow: hidden;
        border-radius: calc(var(--custom-radius) / 2 + 4px) !important;

        .iconfont-sys {
          width: 48px;
          height: 48px;
          font-size: 20px;
          line-height: 48px;
          color: #fff;
          color: var(--el-color-primary);
          text-align: center;
          background-color: var(--el-color-primary-light-9);
          border-radius: 10px;
        }

        h2 {
          margin-top: 10px;
          font-size: 26px;
          font-weight: 400;
          color: var(--art-text-gray-900) !important;
        }

        p {
          margin-top: 10px;
          font-size: 16px;
          color: var(--art-text-gray-700) !important;

          @include ellipsis;
        }

        small {
          display: block;
          margin-top: 10px;
          color: var(--art-text-gray-500) !important;

          @include ellipsis;
        }
      }
    }
  }

  // 暗黑模式降低颜色强度
  .dark {
    .today-sales {
      .sales-summary {
        .sales-card {
          .iconfont-sys {
            &.red,
            &.yellow,
            &.green,
            &.purple {
              background-color: #222 !important;
            }
          }
        }
      }
    }
  }

  @media (max-width: $device-notebook) {
    .today-sales {
      height: 280px;

      .sales-summary {
        .sales-card {
          height: 170px;
        }
      }
    }
  }

  @media (width <= 768px) {
    .today-sales {
      height: auto;

      .sales-summary {
        padding-bottom: 0;

        .sales-card {
          margin-bottom: 20px;
        }
      }
    }
  }
</style>
