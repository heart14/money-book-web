<template>
  <div class="analysis-dashboard">
    <el-row :gutter="20">
      <el-col :xl="14" :lg="24" :xs="24">
        <TodaySales @update:statisCondition="handleStatisConditionChange" />
      </el-col>
      <!-- <el-col :xl="10" :lg="9" :xs="24">
        <VisitorInsights />
      </el-col> -->
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <!-- <el-col :xl="10" :lg="10" :xs="24">
        <TotalRevenue />
      </el-col> -->
      <el-col :xl="24" :lg="24" :xs="24">
        <CustomerSatisfaction :statisCondition="statisCondition" />
      </el-col>
      <!-- <el-col :xl="7" :lg="7" :xs="24">
        <TargetVsReality />
      </el-col> -->
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :xl="12" :lg="12" :xs="24">
        <CategoryIncomeStatis :statisCondition="statisCondition" />
      </el-col>
      <el-col :xl="12" :lg="12" :xs="24">
        <CategoryExpenseStatis :statisCondition="statisCondition" />
      </el-col>
      <!-- <el-col :xl="8" :lg="8" :xs="24">
        <SalesMappingByCountry />
      </el-col> -->
      <!-- <el-col :xl="7" :lg="7" :xs="24">
        <VolumeServiceLevel />
      </el-col> -->
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import TodaySales from './widget/TodaySales.vue'
  // import VisitorInsights from './widget/VisitorInsights.vue'
  // import TotalRevenue from './widget/TotalRevenue.vue'
  import CustomerSatisfaction from './widget/CustomerSatisfaction.vue'
  // import TargetVsReality from './widget/TargetVsReality.vue'
  import CategoryExpenseStatis from './widget/CategoryExpenseStatis.vue'
  import CategoryIncomeStatis from './widget/CategoryIncomeStatis.vue'
  // import SalesMappingByCountry from './widget/SalesMappingByCountry.vue'
  // import VolumeServiceLevel from './widget/VolumeServiceLevel.vue'

  const statisCondition = ref<string>()

  const handleStatisConditionChange = (value: string) => {
    console.log('子组件emit new val: ' + value)
    statisCondition.value = value
  }
</script>

<style lang="scss" scoped>
  @use './style';
</style>
