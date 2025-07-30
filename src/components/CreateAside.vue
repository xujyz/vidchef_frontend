<template>
    <!-- 底部信息 -->
    <el-aside class="layout-aside" width="200px">
        <div class="aside-content">
            <el-menu router default-active="/create/generate">
                <el-menu-item index="/create/generate">
                    <template #title>
                        <el-icon>
                            <message />
                        </el-icon>生成视频
                    </template>
                </el-menu-item>
                <el-menu-item index="/create/space">
                    <template #title>
                        <el-icon><icon-menu /></el-icon>我的空间
                    </template>
                </el-menu-item>
                <el-menu-item index="/create/subscription">
                    <template #title>
                        <el-icon>
                            <setting />
                        </el-icon>我的订阅
                    </template>
                </el-menu-item>
            </el-menu>
        </div>
    </el-aside>

</template>

<script setup>
</script>

<style scoped lang="scss">
.layout-aside {
    min-height: 100%;
    display: flex;
    flex-direction: column;

    .aside-content {
        min-height: 100%;
    }
}
</style>