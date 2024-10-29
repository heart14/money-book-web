<template>
  <nav class="top-navbar">
    <div class="container">
      <div class="logo">
        <a href="/"><img src="/vite.svg" alt="Logo" /> 钱书 </a>
      </div>
      <ul class="menu">
        <li><router-link to="/">概览</router-link></li>
        <li><router-link to="/about">明细</router-link></li>
        <li><router-link to="/services">日历</router-link></li>
          <!-- <li><router-link to="/contact">Contact</router-link></li> -->
        <li>
          <div class="custom-select-container">
            <select v-model="selectedUser" @change="updateValue" class="custom-select">
              <option value="" selected>---</option>
              <option v-for="option in options" :key="option.name" :value="option.value">{{ option.name }}</option>
            </select>
          </div>

        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
// 这里可以添加任何需要的逻辑
import { ref, onMounted } from 'vue';

const emit = defineEmits();
const selectedUser = ref('');
const options = [
  { name: '李', value: 'liwenfei' },
  { name: '钱', value: 'qianlulu' }
];

// 从 Local Storage 中恢复下拉框的值
onMounted(() => {
  const storedValue = localStorage.getItem('selectedUser');
  if (storedValue) {
    selectedUser.value = storedValue;
  }
});

// 更新 Local Storage 中的值
const updateValue = () => {
  localStorage.setItem('selectedUser', selectedUser.value);
  emit('update:selectedUser', selectedUser.value); // Emit 事件以传递值
};
</script>

<style scoped>
.top-navbar {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  padding: 10px 0;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 85%;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}

.logo {
  margin-left: 0;
  /* 移除左边内边距 */
  display: flex;
  align-items: center;
  /* 垂直居中 */
}

.logo a {
  display: flex;
  align-items: center;
  /* 让 a 标签内的内容也居中 */
}

.logo img {
  height: 40px;
  margin-right: 10px;
}

.menu {
  list-style: none;
  display: flex;
  gap: 20px;
}

.menu li a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

.menu li a:hover {
  color: #007bff;
}

span {
  text-align: center;
}

.custom-select-container {
  display: flex;
  /* 使用 flexbox */
  align-items: center;
  /* 垂直居中 */
}

.custom-select {
  border: 2px solid #007bff;
  /* 边框颜色 */
  border-radius: 35px;
  /* 圆形边框 */
  padding: 0px 15px;
  /* 内边距 */
  font-weight: bold;
  /* 字体加粗 */
  background-color: #ffffff;
  /* 背景颜色 */
  appearance: none;
  /* 去掉默认下拉样式 */
  cursor: pointer;
  /* 鼠标指针样式 */
  height: 28px;
  /* 设置高度与其他菜单项一致 */

}

.custom-select:focus {
  outline: none;
  /* 去掉焦点框 */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  /* 添加阴影 */
}
</style>