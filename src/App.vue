<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div id="app" class="app-container">
    <Navbar />
    <router-view />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
}
</style>
