<!-- src/views/Home.vue -->
<template>
  <div class="main-container">
    <div class="top-container">
      <el-form :inline="true" :model="topFormData" class="top-form-inline">
        <el-form-item label="账单年份">
          <el-date-picker v-model="topFormData.byYear" type="year" :disabled-date="disabledDate"
            @change="onTopFormDataChange" value-format="YYYY" placeholder="账单年份" clearable />
        </el-form-item>
        <el-form-item label="总计收入">
          <el-input v-model="topFormData.income" placeholder="总计收入" disabled />
        </el-form-item>
        <el-form-item label="总计支出">
          <el-input v-model="topFormData.expenses" placeholder="总计支出" disabled />
        </el-form-item>
      </el-form>
    </div>

    <div class="charts-row">
      <div class="chart-container">
        <p style="font-weight: bold;">{{ monthDataForm.byYear }}年：月支出统计表</p>

        <el-form :inline="true" :model="monthDataForm" class="demo-form-inline">
          <el-form-item label="统计年份">
            <el-date-picker v-model="monthDataForm.byYear" type="year" :disabled-date="disabledDate"
              @change="onMonthDataFormChange" value-format="YYYY" placeholder="统计年份" clearable />
          </el-form-item>
        </el-form>

        <div ref="chartDom" style="width: 600px;height: 400px;"></div>
      </div>

      <div class="pie-container">
        <p style="font-weight: bold;">{{ categoryDataForm.byYear }}年：分类支出统计表</p>

        <el-form :inline="true" :model="categoryDataForm" class="demo-form-inline">
          <el-form-item label="统计年份">
            <el-date-picker v-model="categoryDataForm.byYear" type="year" :disabled-date="disabledDate"
              @change="onCategoryDataFormChange" value-format="YYYY" placeholder="统计年份" clearable />
          </el-form-item>
        </el-form>

        <div ref="pieChartDom" style="width: 600px;height: 400px;"></div>
      </div>
    </div>

    <div class="table-container">
      <p style="font-weight: bold;">{{ monthCategoryDataForm.byYear }}年：月分类支出统计表</p>

      <el-form :inline="true" :model="monthCategoryDataForm" class="demo-form-inline">
        <el-form-item label="统计年份">
          <el-date-picker v-model="monthCategoryDataForm.byYear" type="year" :disabled-date="disabledDate"
            @change="onMonthCategoryDataFormChange" value-format="YYYY" placeholder="统计年份" clearable />
        </el-form-item>
      </el-form>

      <el-table :data="monthCategoryData" stripe style="width: 100%">
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
import { ref, inject, watch, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { annualDataByYear, monthData, categoryData, monthCateData } from '@/request/api';
import { useRouter } from 'vue-router';

const router = useRouter();

// 注入来自导航栏的 selectedUser
const selectedUser = inject('selectedUser');
// 监视 selectedUser 的变化
watch(selectedUser, (newValue) => {
  console.log('当前选择的用户:', newValue);
  // 可以在这里执行其他逻辑，比如发起请求等
  monthDataForm.value.username = newValue
  categoryDataForm.value.username = newValue
  monthCategoryDataForm.value.username = newValue
  topFormData.value.username = newValue
  // 切换所选用户时重新加载页面数据与图表
  fetchAnnualDataByYear();
  fetchMonthData()
  fetchCategoryData()
  fetchMonthCateData()
});

// 顶部统计年份与年度收支数据
const topFormData = ref({
  byYear: new Date().getFullYear().toString(),
  income: '',
  expenses: '',
  username: ''
})


// 修改顶部统计年份时重新加载页面数据与图表
const onTopFormDataChange = () => {
  monthDataForm.value.byYear = topFormData.value.byYear
  categoryDataForm.value.byYear = topFormData.value.byYear
  monthCategoryDataForm.value.byYear = topFormData.value.byYear
  fetchAnnualDataByYear();
  fetchMonthData();
  fetchCategoryData();
  fetchMonthCateData()
}


// 月份统计图CHART数据
const chartMonthData = ref({
  months: [],
  values: []
});
// 分类统计图CHART数据
const chartCategoryData = ref({
  categories: [],
  totalAmounts: []
});
// 月份分类统计表TABLE数据
const monthCategoryData = ref([])

// 月份统计图查询年份参数
const monthDataForm = ref({
  username: '',
  byYear: ''
})
// 分类统计图查询年份参数
const categoryDataForm = ref({
  username: '',
  byYear: ''
})
// 月份分类统计表查询参数
const monthCategoryDataForm = ref({
  username: '',
  byYear: ''
})


// 月份统计图DOM元素
const chartDom = ref(null);
let chartInstance = null;
// 分类统计图DOM 元素
const pieChartDom = ref(null);
let pieChartInstance = null;

// 查询年度收支数据
const fetchAnnualDataByYear = async () => {
  const res = await annualDataByYear(topFormData.value)
  topFormData.value.income = res.data.totalIncome
  topFormData.value.expenses = res.data.totalExpense
}

// 查询月份统计图数据
const fetchMonthData = async () => {
  const res = await monthData(monthDataForm.value);
  chartMonthData.months = res.data.map(item => item.byMonth)
  chartMonthData.value = res.data.map(item => item.totalAmount)
  initChart();
}

// 查询分类统计图数据
const fetchCategoryData = async () => {
  const res = await categoryData(categoryDataForm.value);
  chartCategoryData.categories = res.data.map(item => item.category)
  chartCategoryData.totalAmounts = res.data.map(item => item.totalAmount)
  initPieChart();
}

// 查询月份分类统计表数据
const fetchMonthCateData = async () => {
  const res = await monthCateData(monthCategoryDataForm.value);
  monthCategoryData.value = res.data
}


// 修改统计年份时触发刷新统计图
const onMonthDataFormChange = () => {
  fetchMonthData()
}
// 修改统计年份时触发刷新统计图
const onCategoryDataFormChange = () => {
  fetchCategoryData()
}
// 修改统计年份时触发刷新表格
const onMonthCategoryDataFormChange = () => {
  fetchMonthCateData()
}


// 初始化月份统计图的方法
const initChart = async () => {
  await nextTick(); // 确保DOM已经渲染完成

  if (chartInstance && chartMonthData.value) {
    const option = {
      // chartMonthData.value作为数据源
      title: {
        // text: '月支出统计图',
        // left: 'center', // 标题水平位置，默认为 'left'
        // top: 'top', // 标题垂直位置，默认为 'top'
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
        data: chartMonthData.months
      },
      yAxis: {},
      series: [{
        name: '月总支出',
        type: 'bar',
        data: chartMonthData.value,
        label: {
          show: true,
          position: 'top',
          formatter: '{c}元'
        }
      }]
    };
    chartInstance.setOption(option);

    // 添加点击事件监听器
    chartInstance.on('click', (params) => {
      // params.dataIndex 是点击的柱子索引
      const monthIndex = params.dataIndex;
      const selectedMonth = chartMonthData.months[monthIndex];
      // 使用 Vue Router 进行路由切换
      router.push({
        name: 'About', // 目标页面的路由名称
        query: { month: selectedMonth } // 将月份作为查询参数
      });
    });
  }
};
// 初始化分类统计图的方法
const initPieChart = async () => {
  await nextTick(); // 确保DOM已经渲染完成
  if (pieChartInstance && chartCategoryData.value) {
    const option = {
      title: {
        // text: '饼图示例',
        // left: 'center'
      },
      tooltip: {
        trigger: 'item', // 当鼠标悬停在某个数据项上时显示提示框
        formatter: '{a} <br/>{b}: {c} ({d}%)' // 提示框内容格式化
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '分类',
          type: 'pie',
          radius: '80%',
          center: ['55%', '50%'],
          data: chartCategoryData.categories.map((category, index) => ({
            name: category,
            value: chartCategoryData.totalAmounts[index]
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    pieChartInstance.setOption(option);
  }
}

// 日期选择器中禁用今天之后的日期
const disabledDate = (date) => {
  return date.getTime() > Date.now()
}

// 钩子函数
onMounted(async () => {
  chartInstance = echarts.init(chartDom.value);
  pieChartInstance = echarts.init(pieChartDom.value);
  // 页面加载时从localStorage取当前所选用户值
  const u = localStorage.getItem('selectedUser')
  monthDataForm.value.username = u
  categoryDataForm.value.username = u
  monthCategoryDataForm.value.username = u
  monthDataForm.value.byYear = topFormData.value.byYear
  categoryDataForm.value.byYear = topFormData.value.byYear
  monthCategoryDataForm.value.byYear = topFormData.value.byYear
  console.log(monthDataForm)
  console.log(categoryDataForm)
  console.log(monthCategoryDataForm)
  // 页面加载时请求后台获取数据
  fetchAnnualDataByYear();
  fetchMonthData();
  fetchCategoryData();
  fetchMonthCateData()
});

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
}

.charts-row {
  display: flex;
  justify-content: space-between;
  /* 可以根据需要调整 */
  margin-bottom: 20px;
  /* 为了给下方表格留出一些空间 */
  /* width: 100%; */
}

.chart-container,
.pie-container {
  flex: 1;
  /* 让两个容器平分可用宽度 */
  margin-right: 10px;
  /* 为了给两个容器之间留出间隔 */
}

.pie-container {
  margin-right: 0;
  /* 最后一个容器不需要右边距 */
}

.table-container {
  width: 100%;
  /* 确保表格容器占满全宽 */
}

.top-container {
  background-color: #f5f5f5;
  /* 浅灰色背景 */
  padding-top: 10px;
  padding-bottom: 0px;
  border-radius: 5px;
}

.top-form-inline {
  text-align: center;
}

.top-form-inline .el-input {
  width: 240px;
}
</style>