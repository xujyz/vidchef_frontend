<template>
    <!-- 顶部导航 -->
    <header class="nav">
        <div class="nav-flex">
            <div class="logo">VideoChef</div>
            <nav class="menu">
                <router-link to="/">主页</router-link>
                <router-link to="/price">定价</router-link>
                <router-link to="/create">前往创作</router-link>
                <router-link to="/login">登录</router-link>
            </nav>
        </div>
    </header>      

</template>

<script setup>
</script>

<style scoped lang="scss">
.app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.nav {
    background-color: #2f3b4b;
    padding: 10px 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    .nav-flex {
              width: 70%;
        max-width: 1480px;
        min-width: 1100px;
        display: flex;
        justify-content: space-between;
        align-items: center;

    }
}

.logo {
    font-size: 1.5em;
    padding: 0.4em;
    color: #fff;
    font-weight: bold;
}

.menu {
    display: flex;
    gap: 20px;
}

.menu a {
    color: #fff;
    font-size: 14px;
}

</style>