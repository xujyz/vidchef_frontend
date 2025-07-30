<template>
    <!-- 底部信息 -->
    <el-footer class="layout-footer">
        <div class="footer-container">
            <div class="grid">
                <div class="grid-content">
                    <h4 class="text-header">关于我们</h4>
                    <ul class="text-content">
                        <li><a href="#" class="text">公司介绍</a></li>
                        <li><a href="#" class="text">团队成员</a></li>
                        <li><a href="#" class="text">加入我们</a></li>
                    </ul>
                </div>
                <div class="grid-content">
                    <h4 class="text-header">产品</h4>
                    <ul class="text-content">
                        <li><a href="#" class="text">功能特点</a></li>
                        <li><a href="#" class="text">最新更新</a></li>
                        <li><a href="#" class="text">定价方案</a></li>
                    </ul>
                </div>
                <div class="grid-content">
                    <h4 class="text-header">支持</h4>
                    <ul class="text-content">
                        <li><a href="#" class="text">帮助中心</a></li>
                        <li><a href="#" class="text">API 文档</a></li>
                        <li><a href="#" class="text">联系我们</a></li>
                    </ul>
                </div>
                <div class="grid-content">
                    <h4 class="text-header">关注我们</h4>
                    <div class="icon-content">
                        <a href="#" class="text">
                            <el-icon>
                                <Position />
                            </el-icon>
                        </a>
                        <a href="#" class="text">
                            <el-icon>
                                <Message />
                            </el-icon>
                        </a>
                        <a href="#" class="text">
                            <el-icon>
                                <ChatDotRound />
                            </el-icon>
                        </a>
                    </div>
                </div>
            </div>
            <FooterCopyright></FooterCopyright>
        </div>
    </el-footer>
</template>

<script setup>
import FooterCopyright from './FooterCopyright.vue'
import { Position, Message, ChatDotRound } from '@element-plus/icons-vue';
</script>

<style scoped lang="scss">
.layout-footer {
    background-color: #111827;
    color: #ffffff;
    padding-top: 2rem;
    height: fit-content;

    .footer-container {
        max-width: 80rem; // Default container max-width in Tailwind (1280px)
        margin-left: auto;
        margin-right: auto;
        padding-left: 2rem;
        padding-right: 2rem;

        .grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            margin-bottom: 2rem;
            justify-content: space-around;

            .text-header {
                font-size: 1.125rem;
                line-height: 1.75rem;
                font-weight: 600;
                margin-bottom: 1rem;
            }

            .text-content {
                list-style: none;
                color: #9ca3af;
                padding-left: 0;

                &:not(:first-child) {
                    margin-top: 0.5rem;
                }

                &:hover {
                    color: #ffffff;
                }

            }

            .text-content a {
                list-style: none;
                color: #9ca3af;
                padding-left: 0;
                text-decoration: none;

                &:not(:first-child) {
                    margin-top: 0.5rem;
                }

                &:hover {
                    color: #ffffff;
                }
            }

            .icon-content {
                display: flex;
                gap: 1rem;
                color: #9ca3af;

                &:hover {
                    color: #ffffff;
                }

            }

            .icon-content a {
                display: flex;
                gap: 1rem;
                color: #9ca3af;

                &:hover {
                    color: #ffffff;
                }

            }
        }
    }
}
</style>