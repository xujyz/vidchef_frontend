<script setup>
import Header from '@/components/Header.vue'
import FooterCopyright from '@/components/FooterCopyright.vue'

</script>

<template>
    <el-container>
        <div class="header">
            <Header></Header>
        </div>
        <div class="main">
            <el-main>
                <div>账号管理</div>
            </el-main>
        </div>
        <div class="footer">
            <FooterCopyright></FooterCopyright>
        </div>
    </el-container>

</template>

<style scoped>
.el-container {
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .header {
        height: fit-content;
    }

    .main {
        flex: 1;
        color: #000000;
        background-color: #f9fafb;
    }

    .footer {
        height: fit-content;
        width: 100%;
    }
}
</style>