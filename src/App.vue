<template>
  <div id="app" class="app-container">
    <Navbar @update:selectedUser="handleUserChange"/>
    <router-view />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue';
import Navbar from './components/Navbar.vue'

const selectedUser = ref(''); // 存储选中的值

const handleUserChange = (value) => {
  selectedUser.value = value; // 更新选中的值
}

// 提供选中的值以便其他组件使用
provide('selectedUser', selectedUser);
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
}
</style>
