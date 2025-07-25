<script setup>
import Header from '@/components/Header.vue';
import FooterCopyright from '@/components/FooterCopyright.vue'
import CreateAside from './CreateAside.vue';
</script>

<template>
    <el-container>
        <div class="header">
            <Header></Header>
        </div>
        <div class="content">
            <div class="aside">
                <CreateAside></CreateAside>
            </div>
            <div class="main">
                <RouterView />
            </div>
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

    .content {
        flex: 1;
        display: flex;

        .aside {
            height: 100%;
            width: fit-content;
        }

        .main {
            background-color: #ffffff;
            flex: 1;
            color: #000000;
        }
    }



    .footer {
        height: fit-content;
        width: 100%;
    }
}
</style>