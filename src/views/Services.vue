<!-- src/views/Services.vue -->
<template>
  <div class="main-container">
    <el-calendar>

      <template #date-cell="{ data }">
        <div class="date-cell" @mouseover="onMousehover(data.day)" @mouseleave="onMouseleave">
          <p :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split('-')[2] }}
            {{ data.isSelected ? '✔️' : '' }}
          </p>

          <p>
            今天是{{ data.day }}
          </p>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const hoveredDate = ref({
  byDate: ''
})

const onMousehover = (day) => {
  hoveredDate.value.byDate = day
  console.log('mouse hover:' + day)
}

const onMouseleave = () => {
  hoveredDate.value.byDate = ''
  console.log('mouse leave')
}


</script>
<style>
.is-selected {
  color: #1989fa;
}

.main-container {
  width: 100%;
}
</style>