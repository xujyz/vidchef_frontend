<template>
    <!-- 顶部导航 -->
    <el-header class="layout-header">
        <div class="navigator">
            <div class="logo-container">
                <img :src="LogoImage" alt="VideoChef" class="logo-image" />
                <div class="logo">VideoChef</div>
            </div>

            <nav class="menu">
                <router-link to="/">主页</router-link>
                <router-link to="/price">定价</router-link>
                <router-link to="/create">前往创作</router-link>
                <router-link to="/login" class="login-btn">登录</router-link>
            </nav>
        </div>
    </el-header>

</template>

<script setup>
import LogoImage from '@/assets/VidChef-logo.png'
</script>

<style scoped lang="scss">
.app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.layout-header {
    width: 100vw;
    height: fit-content;
    background-color: #ffffff;
    padding: 10px 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    .navigator {
        width: 100%;
        min-width: 900px;
        padding: 0 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 4rem;
        border-bottom: 1px solid #e5e7eb;

        .logo-container {
            display: flex;
            align-items: center;
            gap: 0.5rem;

            .logo-image {
                height: 5rem;
            }

            .logo {
                font-size: 1.25rem;
                line-height: 1.75rem;
                font-weight: 600;
                color: #000000;
            }
        }



        .menu {
            display: flex;
            font-size: 14px;
            align-items: center;
            gap: 2rem;

            .login-btn {
                border-radius: 0.375rem !important;
                padding-left: 1.5rem;
                padding-right: 1.5rem;
                padding-top: 0.5rem;
                padding-bottom: 0.5rem;
                background-color: #2563eb;
                color: #ffffff;
                white-space: nowrap;

                &:hover {
                    background-color: #1d4ed8;
                }
            }
        }

        .menu a {
            color: #000000;
            font-size: 14px;
            text-decoration: none;
            transition: 0.4s;
            padding: 3px;

            .login-btn {
                border-radius: 0.375rem !important;
                padding-left: 1.5rem;
                padding-right: 1.5rem;
                padding-top: 0.5rem;
                padding-bottom: 0.5rem;
                background-color: #2563eb;
                color: #ffffff;
                white-space: nowrap;

                &:hover {
                    background-color: #1d4ed8;
                }
            }

            &:hover {
                color: #2563eb;
            }
        }
    }
}
</style>