<script setup>
import { ref } from 'vue';
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import heroImage from '@/assets/home-banner.png'

// const heroImage = 'https://ai-public.mastergo.com/ai/img_res/8ff7bfbfa05a286cc5e0149645ddb1bc.jpg';

const features = ref([
    {
        title: '智能人群定位',
        description: '基于商品特征，精准定位目标受众，提供个性化营销策略建议',
        image: 'https://ai-public.mastergo.com/ai/img_res/8c79bd063159bd4ea0b599536b12cc31.jpg'
    },
    {
        title: '一键生成模板',
        description: '海量视频模板智能匹配，快速生成符合平台规范的短视频内容',
        image: 'https://ai-public.mastergo.com/ai/img_res/fc83166e2340e142bdb94c51d85dfee5.jpg'
    },
    {
        title: '实时预览编辑',
        description: '所见即所得的编辑体验，支持灵活调整视频内容和特效',
        image: 'https://ai-public.mastergo.com/ai/img_res/85ae6a9262a873cde72b01a5aa077f07.jpg'
    }
]);

const stats = ref([
    { value: '100,000+', label: '注册用户' },
    { value: '500,000+', label: '生成视频' },
    { value: '98%', label: '用户满意度' },
    { value: '300%', label: '平均转化提升' }
]);

const cases = ref([
    {
        title: '某知名化妆品品牌',
        description: '使用 ClipCook 一个月内生成超过 100 个短视频，销售额提升 280%',
        date: '2024-01-15',
        image: 'https://ai-public.mastergo.com/ai/img_res/fde9b9067843eaec6657fcbcc17027e9.jpg'
    },
    {
        title: '新锐运动品牌',
        description: '借助智能人群定位功能，精准触达目标用户，投放效果提升 200%',
        date: '2024-01-20',
        image: 'https://ai-public.mastergo.com/ai/img_res/917ed372e541025a9f53a0ef27c073f5.jpg'
    },
    {
        title: '电子产品制造商',
        description: '通过平台快速制作产品展示视频，月均订单量增长 150%',
        date: '2024-01-25',
        image: 'https://ai-public.mastergo.com/ai/img_res/0beb744c745712af095fb49bbe616ff3.jpg'
    }
]);

</script>

<template>
    <el-container>
        <div class="header">
            <Header></Header>
        </div>
        <div class="main">
            <el-main>
                <!-- Hero区域 -->
                <div class="hero-section">
                    <div class="hero-overlay">
                        <div class="hero-content">
                            <div class="hero-text-container">
                                <h1 class="hero-title">从商品到爆款视频</h1>
                                <h1 class="hero-title2">电商短视频，AI一键生成</h1>
                                <p class="hero-description">短视频掘金时代，每多发一条视频就是多无数成单的机会。</p>
                                <p class="hero-description">手搓的速度永远比不过大数据，手搓的人力成本却比AI高得多。</p>
                                <p class="hero-description">一站式AI电商视频生成工具，轻松帮您生成高质量产品视频。</p>
                                <div class="hero-buttons">
                                    <el-button type="primary" class="start-button">立即开始</el-button>
                                    <el-button plain type="primary" class="demo-button">查看演示</el-button>
                                </div>
                            </div>
                            <div class="hero-image">
                                <img :src="heroImage" alt="home-banner"></img>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 功能特点 -->
                <div class="features-section">
                    <div class="section-container">
                        <h2 class="section-title">三步轻松生成专业视频</h2>
                        <div class="features-grid">
                            <div v-for="(feature, index) in features" :key="index" class="feature-card">
                                <img :src="feature.image" :alt="feature.title" class="feature-image" />
                                <h3 class="feature-title">{{ feature.title }}</h3>
                                <p class="feature-description">{{ feature.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 数据统计 -->
                <div class="stats-section">
                    <div class="section-container">
                        <div class="stats-grid">
                            <div v-for="(stat, index) in stats" :key="index" class="stat-item">
                                <div class="stat-value">{{ stat.value }}</div>
                                <div class="stat-label">{{ stat.label }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 客户案例 -->
                <div class="cases-section">
                    <div class="section-container">
                        <h2 class="section-title">成功案例</h2>
                        <div class="cases-grid">
                            <div v-for="(case_, index) in cases" :key="index" class="case-card">
                                <img :src="case_.image" :alt="case_.title" class="case-image" />
                                <div class="case-content">
                                    <h3 class="case-title">{{ case_.title }}</h3>
                                    <p class="case-description">{{ case_.description }}</p>
                                    <div class="case-footer">
                                        <span class="case-link">查看详情</span>
                                        <span class="case-date">{{ case_.date }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-main>
        </div>
        <div class="footer">
            <Footer></Footer>
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

        /* Hero 区域 */
        .hero-section {
            position: relative;
            height: 600px;
            background-size: cover;
            background-position: center;
        }

        .hero-overlay {
            position: absolute;
            inset: 0;
            background-color: #EFF6FF;
        }

        .hero-content {
            margin: 0 auto;
            padding: 6rem 2rem;
            display: flex;
        }

        .hero-text-container {
            max-width: 42rem;
        }

        .hero-title {
            font-size: 3rem;
            font-weight: 700;
            /* margin-bottom: 0.5rem; */
        }

        .hero-title2 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            color: #2563EB;
        }

        .hero-description {
            font-size: 1.25rem;
            color: #4b5563;
            margin-bottom: 0.5rem;
        }

        .hero-buttons {
            display: flex;
            margin-top: 2rem;
        }

        .start-button {
            height: auto;
            border-radius: 0.375rem;
            padding: 0.75rem 2rem;
            background-color: #2563eb;
            color: white;
            font-size: 1.125rem;
            white-space: nowrap;

            &:hover {
                background-color: #1d4ed8;
            }
        }

        .hero-image {
            margin-left: 4rem;
            height: 600px;
            width: 800px;
            flex: 1;
        }

        .demo-button {
            height: auto;
            border-radius: 0.375rem;
            padding: 0.75rem 2rem;
            border: 1px solid #2563eb;
            color: #2563eb;
            font-size: 1.125rem;
            white-space: nowrap;

            &:hover {
                background-color: #eff6ff;
            }
        }

        /* 功能特点 */
        .features-section {
            padding: 5rem 0;
            background-color: #f9fafb;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
        }

        .feature-card {
            background-color: white;
            border-radius: 0.5rem;
            padding: 2rem;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .feature-image {
            width: 100%;
            height: 12rem;
            object-fit: cover;
            border-radius: 0.5rem;
            margin-bottom: 1.5rem;
        }

        .feature-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }

        .feature-description {
            color: #4b5563;
        }

        /* 数据统计 */
        .stats-section {
            padding: 5rem 0;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
        }

        .stat-item {
            text-align: center;
        }

        .stat-value {
            font-size: 2.25rem;
            font-weight: 700;
            color: #2563eb;
            margin-bottom: 0.5rem;
        }

        .stat-label {
            color: #4b5563;
        }

        /* 客户案例 */
        .cases-section {
            padding: 5rem 0;
            background-color: #f9fafb;
        }

        .cases-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
        }

        .case-card {
            background-color: white;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .case-image {
            width: 100%;
            height: 12rem;
            object-fit: cover;
        }

        .case-content {
            padding: 1.5rem;
        }

        .case-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }

        .case-description {
            color: #4b5563;
            margin-bottom: 1rem;
        }

        .case-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .case-link {
            color: #2563eb;
        }

        .case-date {
            color: #6b7280;
        }
    }

    .footer {
        height: fit-content;
        width: 100%;
    }
}
</style>