<template>
    <!-- 底部信息 -->
    <footer class="footer">
        <div class="footer-link">
            <div class="link-group">
                <h4>关于我们</h4>
                    <ul>
                        <li>公司介绍</li>
                        <li>团队成员</li>
                        <li>加入我们</li>
                    </ul>
                    <h4>产品</h4>
                    <ul>
                        <li>功能特点</li>
                        <li>最新更新</li>
                        <li>定价方案</li>
                    </ul>
                    <h4>支持</h4>
                    <ul>
                        <li>帮助中心</li>
                        <li>API文档</li>
                        <li>联系我们</li>
                    </ul>
                    <h4>关注我们</h4>
            </div>               
        </div>
        <div class="copyright">
            <p>Copyright © 2024 VideoChef 保留所有权利 </p>
        </div>
    </footer>
    
</template>

<script setup>
</script>

<style scoped lang="scss">
.footer {
    background-color: #2d3748;
    color: #cbd5e0;
    padding: 60px 5% 30px;
    text-align: center;
    color: #666;

    .footer-link {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 40px;
        max-width: 1200px;
        margin: 0 auto 40px;

        .link-group {
            .h4 {
                color: white;
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 20px;
            }
            .ul {
                list-style: none;
                padding: 0;
                margin: 0;

                .li {
                    margin-bottom: 10px;
                }
            }
        }
    }

    .copyright {
        text-align: center;
        padding-top: 30px;
        border-top: 1px solid #4a5568;
        font-size: 14px;
    }

}
</style>