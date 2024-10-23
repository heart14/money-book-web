<template>
    <nav class="top-navbar">
      <div class="container">
        <div class="logo">
          <img src="/vite.svg" alt="Logo" />
        </div>
        <ul class="menu">
          <li><router-link to="/">概览</router-link></li>
          <li><router-link to="/about">明细</router-link></li>
          <!-- <li><router-link to="/services">Services</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li> -->
        </ul>
      </div>
    </nav>
  </template>
  
  <script setup>
  // 这里可以添加任何需要的逻辑
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
    margin-left: 0; /* 移除左边内边距 */
  }
  
  .logo img {
    height: 40px;
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
  </style>