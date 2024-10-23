<!-- src/views/Home.vue -->
<template>
  <div class="main-container">
    <div class="chart-container">
      <div ref="chartDom" style="width: 100%; height: 400px;"></div>
    </div>
    <div class="table-container">
      <el-table :data="monthCategoryData" height="1000px" style="width: 100%">
      <el-table-column prop="category" label="分类" width="100px"></el-table-column>
      <el-table-column prop="01月" label="01月" width="100px"></el-table-column>
      <el-table-column prop="02月" label="02月" width="100px"></el-table-column>
      <el-table-column prop="03月" label="03月" width="100px"></el-table-column>
      <el-table-column prop="04月" label="04月" width="100px"></el-table-column>
      <el-table-column prop="05月" label="05月" width="100px"></el-table-column>
      <el-table-column prop="06月" label="06月" width="100px"></el-table-column>
      <el-table-column prop="07月" label="07月" width="100px"></el-table-column>
      <el-table-column prop="08月" label="08月" width="100px"></el-table-column>
      <el-table-column prop="09月" label="09月" width="100px"></el-table-column>
      <el-table-column prop="10月" label="10月" width="100px"></el-table-column>
      <el-table-column prop="11月" label="11月" width="100px"></el-table-column>
      <el-table-column prop="12月" label="12月" width="100px"></el-table-column>
    </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { monthData, monthCateData } from '@/request/api';

const monthCategoryData = ref([])

// 查询月份分类数据
const fetchMonthCateData = async () => {
  const res = await monthCateData('2024');
  monthCategoryData.value = res.data
}


// 创建一个响应式引用来保存DOM元素
const chartDom = ref(null);
let chartInstance = null;
// 创建一个响应式引用来保存chart数据
const chartMonthData = ref({
  months: [],
  values: []
});

fetchMonthCateData();

// 初始化ECharts实例并设置配置项（这里以折线图为例，但可灵活替换）
onMounted(async () => {
  await nextTick(); // 确保DOM已经渲染完成
  chartInstance = echarts.init(chartDom.value);

  const res = await monthData('2024');
  console.log(res.data)
  chartMonthData.months = res.data.map(item => item.byMonth)
  chartMonthData.value = res.data.map(item => item.totalAmount)
  initChart();
});

// 初始化图表的方法
const initChart = () => {
  if (chartInstance && chartMonthData.value) {
    const option = {
      // chartMonthData.value作为数据源
      title: {
        text: '月支出统计',
        left: 'center', // 标题水平位置，默认为 'left'
        top: 'top', // 标题垂直位置，默认为 'top'
        // 你也可以使用像素值来精确控制位置，如：
        // left: '50px', 
        // top: '30px',
      },
      tooltip: {
        trigger: 'axis', // 触发类型：'axis' 表示坐标轴触发
        axisPointer: {
          type: 'shadow' // 指示器类型：'line' 表示直线指示器
        }
      },
      xAxis: {
        data: chartMonthData.months // 假设数据中包含类别数组
      },
      yAxis: {},
      series: [{
        name: '月总支出',
        type: 'bar',
        data: chartMonthData.value, // 假设数据中包含数值数组
        label: {
          show: true,
          position: 'top',
          formatter: '{c}元'
        }
      }]
    };
    chartInstance.setOption(option);
  }
};

// 销毁ECharts实例
onUnmounted(() => {
  if (chartInstance != null && chartInstance.dispose) {
    chartInstance.dispose();
  }
});

</script>
<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 使内容从左上角开始 */
  padding: 20px; /* 根据需要调整内边距 */
  padding: 3rem;
}

.chart-container {
  width: 800px;
  height: 400px;
  margin-bottom: 20px; /* 根据需要调整外边距 */
}
</style>