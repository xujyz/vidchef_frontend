<template>
    <div class="app-container">
        <div class="content-wrapper">
            <!-- Header with logo and user info -->
            <div class="header">
                <h1 class="logo">ClipCook</h1>
                <div class="user-section">
                    <span class="current-step">人群定位</span>
                    <div class="user-info">
                        <el-avatar :size="28" icon="UserFilled" />
                        <span>ID: 2023071588</span>
                        <el-icon class="dropdown-icon">
                            <ArrowDown />
                        </el-icon>
                    </div>
                </div>
            </div>

            <!-- Progress steps -->
            <div class="progress-steps">
                <div class="progress-line-container">
                    <div class="progress-line"></div>
                </div>

                <!-- Step 1 -->
                <div class="step-container group">
                    <div class="step-number active">
                        <div class="pulse-animation"></div>
                        <el-icon>
                            <User />
                        </el-icon>
                        <span class="step-badge active">1</span>
                    </div>
                    <span class="step-label active">人群定位</span>
                    <el-popover placement="bottom" :width="200" trigger="hover">
                        <template #reference>
                            <div class="step-tooltip-trigger"></div>
                        </template>
                        <div class="step-tooltip-content">
                            <p>AI 精准分析目标人群特征</p>
                        </div>
                    </el-popover>
                </div>

                <!-- Step 2 -->
                <div class="step-container group">
                    <div class="step-number">
                        <el-icon>
                            <PieChart />
                        </el-icon>
                        <span class="step-badge">2</span>
                    </div>
                    <span class="step-label">模版匹配</span>
                    <el-popover placement="bottom" :width="200" trigger="hover">
                        <template #reference>
                            <div class="step-tooltip-trigger"></div>
                        </template>
                        <div class="step-tooltip-content">
                            <p>智能推荐最佳营销模版</p>
                        </div>
                    </el-popover>
                </div>

                <!-- Step 3 -->
                <div class="step-container group">
                    <div class="step-number">
                        <el-icon>
                            <VideoPlay />
                        </el-icon>
                        <span class="step-badge">3</span>
                    </div>
                    <span class="step-label">视频生成</span>
                    <el-popover placement="bottom" :width="200" trigger="hover">
                        <template #reference>
                            <div class="step-tooltip-trigger"></div>
                        </template>
                        <div class="step-tooltip-content">
                            <p>一键生成专业营销视频</p>
                        </div>
                    </el-popover>
                </div>
            </div>

            <!-- Main content -->
            <div class="main-content">
                <!-- Product info form -->
                <div class="product-form-container">
                    <h2 class="section-title">商品信息</h2>
                    <el-form :model="productForm" label-position="top">
                        <el-form-item label="商品名称" required>
                            <el-input v-model="productForm.name" placeholder="请输入商品名称" />
                        </el-form-item>

                        <el-form-item label="目标市场" required>
                            <el-select v-model="productForm.targetMarket" placeholder="请选择目标市场" class="w-100">
                                <el-option label="国内市场" value="domestic" />
                                <el-option label="国际市场" value="international" />
                                <el-option label="区域市场" value="regional" />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="商品核心卖点">
                            <div class="selling-points-container">
                                <div class="selling-point-input">
                                    <el-input v-model="productForm.sellingPointInput" placeholder="输入商品特点，AI 将为您推荐核心卖点">
                                        <template #suffix>
                                            <el-button class="ai-generate-button" :icon="Operation"
                                                @click="generateSellingPoints" />
                                        </template>
                                    </el-input>
                                </div>
                                <div class="suggested-points">
                                    <div v-for="(point, index) in suggestedPoints" :key="index" class="point-item"
                                        @click="selectPoint(point)">
                                        <el-icon color="#2563eb">
                                            <Check />
                                        </el-icon>
                                        <span>{{ point }}</span>
                                    </div>
                                </div>
                            </div>
                        </el-form-item>

                        <el-form-item label="商品图片">
                            <el-upload class="dropzone" drag action="#" :auto-upload="false" :limit="5" multiple
                                :on-change="handleFileChange" :on-exceed="handleExceed">
                                <el-icon class="upload-icon">
                                    <Upload />
                                </el-icon>
                                <div class="el-upload__text">
                                    <p class="upload-text">拖拽图片到此处或点击上传</p>
                                    <p class="upload-hint">支持 JPG/PNG 格式，单张大小不超过 10MB，最多 5 张</p>
                                </div>
                            </el-upload>
                        </el-form-item>

                        <div class="form-actions">
                            <el-button type="primary" class="analyze-button" @click="startAnalysis">
                                <el-icon>
                                    <DataAnalysis />
                                </el-icon>
                                开始分析
                            </el-button>
                        </div>
                    </el-form>
                </div>

                <!-- AI recommendations -->
                <div class="recommendations-container">
                    <h2 class="section-title">AI Boss 推荐</h2>
                    <div class="audience-groups">
                        <el-card v-for="(audience, index) in audienceGroups" :key="index" class="audience-card"
                            :class="{ 'is-selected': audience.id === selectedAudience.id }" shadow="hover"
                            @click="selectAudience(audience)">
                            <div class="audience-header">
                                <h3 class="audience-title">{{ audience.title }}</h3>
                                <span class="match-rate">匹配度 {{ audience.matchRate }}%</span>
                            </div>
                            <div class="audience-details">
                                <p class="audience-detail">
                                    <el-icon>
                                        <User />
                                    </el-icon>
                                    {{ audience.age }}
                                </p>
                                <p class="audience-detail">
                                    <el-icon>
                                        <Star />
                                    </el-icon>
                                    {{ audience.interests }}
                                </p>
                                <p class="audience-detail">
                                    <el-icon>
                                        <ShoppingCart />
                                    </el-icon>
                                    {{ audience.motivation }}
                                </p>
                            </div>
                        </el-card>
                    </div>

                    <!-- Next step button -->
                    <div class="recommendation-actions">
                        <el-button type="primary" class="next-button" @click="goToNextStep">
                            下一步
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import {
    User,
    UserFilled,
    PieChart,
    VideoPlay,
    Check,
    Upload,
    Operation,
    DataAnalysis,
    Star,
    ShoppingCart,
    ArrowDown
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// Form data
const productForm = ref({
    name: '',
    targetMarket: '',
    sellingPointInput: '',
    selectedPoints: []
});

// Suggested selling points
const suggestedPoints = ref([
    '超长续航，单次充电可持续使用48小时',
    'IP68级防水防尘，水下可用30分钟',
    '创新双重降噪技术，通话更清晰'
]);

// Audience groups data
const audienceGroups = ref([
    {
        id: 1,
        title: '25-35 岁户外运动爱好者',
        matchRate: 95,
        age: '年龄：25-35 岁，以都市白领为主',
        interests: '兴趣：户外运动、健身、摄影、旅行',
        motivation: '消费动机：追求高品质生活，注重产品性能与设计'
    },
    {
        id: 2,
        title: '35-45 岁家庭主导购者',
        matchRate: 85,
        age: '年龄：35-45 岁，已婚有子女',
        interests: '兴趣：亲子活动、家庭旅行、烹饪',
        motivation: '消费动机：关注产品实用性与性价比，重视家人使用体验'
    },
    {
        id: 3,
        title: '18-24 岁年轻时尚群体',
        matchRate: 75,
        age: '年龄：18-24 岁，学生及职场新人',
        interests: '兴趣：社交媒体、时尚潮流、音乐、游戏',
        motivation: '消费动机：追求个性化与时尚感，易受网红推荐影响'
    }
]);

const selectedAudience = ref(audienceGroups.value[0]);
const fileList = ref([]);

// Methods
const generateSellingPoints = () => {
    // In a real app, this would call an API to generate points based on input
    if (!productForm.value.sellingPointInput) {
        ElMessage.warning('请先输入商品特点');
        return;
    }

    ElMessage.success('AI 正在分析您的商品特点...');
    // Simulate API call delay
    setTimeout(() => {
        // Add a new suggested point based on input
        const newPoint = `基于${productForm.value.sellingPointInput}的智能优化功能`;
        suggestedPoints.value.unshift(newPoint);
        ElMessage.success('已生成新的卖点建议');
    }, 1000);
};

const selectPoint = (point) => {
    if (!productForm.value.selectedPoints.includes(point)) {
        productForm.value.selectedPoints.push(point);
        ElMessage.success('已添加卖点');
    }
};

const handleFileChange = (file) => {
    // Check file type
    const isImage = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png';
    // Check file size (less than 10MB)
    const isLt10M = file.raw.size / 1024 / 1024 < 10;

    if (!isImage) {
        ElMessage.error('只能上传 JPG/PNG 格式的图片!');
        return false;
    }

    if (!isLt10M) {
        ElMessage.error('图片大小不能超过 10MB!');
        return false;
    }

    // Add to file list
    fileList.value.push(file);
    return true;
};

const handleExceed = () => {
    ElMessage.warning('最多只能上传 5 张图片');
};

const startAnalysis = () => {
    if (!productForm.value.name) {
        ElMessage.warning('请输入商品名称');
        return;
    }

    if (!productForm.value.targetMarket) {
        ElMessage.warning('请选择目标市场');
        return;
    }

    ElMessage.success('正在分析商品信息...');
    // In a real app, this would trigger the AI analysis
    setTimeout(() => {
        ElMessage.success('分析完成，已推荐最匹配的目标人群');
        // Highlight the first audience group
        selectAudience(audienceGroups.value[0]);
    }, 1500);
};

const selectAudience = (audience) => {
    selectedAudience.value = audience;
};

const goToNextStep = () => {
    // Navigate to the next step (template matching)
    ElMessage.success(`已选择 "${selectedAudience.value.title}" 作为目标人群，即将进入模版匹配环节`);
    // In a real app, this would navigate to the next page or update the current step
};
</script>

<style scoped lang="scss">
// Import fonts in your main App.vue or index.html
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=SF+Pro+Display:wght@400;500;600&display=swap');

// Animation keyframes
@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 0.3;
    }

    50% {
        transform: scale(1.2);
        opacity: 0.2;
    }

    100% {
        transform: scale(1.4);
        opacity: 0;
    }
}

// Base styles
.app-container {
    background-color: #f9fafb;
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
}

.content-wrapper {
    max-width: 1440px;
    margin: 0 auto;
    padding: 3rem 2rem;
}

// Header styles
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 3rem;
    border-bottom: 1px solid #f3f4f6;
    padding-bottom: 1rem;
}

.logo {
    font-family: 'Pacifico', cursive;
    font-size: 1.875rem;
    color: #1f2937;
}

.user-section {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.current-step {
    color: #2563eb;
    font-weight: 500;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #4b5563;
}

.dropdown-icon {
    font-size: 0.75rem;
    margin-left: 0.25rem;
}

// Progress steps
.progress-steps {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9rem;
    margin-bottom: 4rem;
    width: 66.666667%;
    margin-left: auto;
    margin-right: auto;
}

.progress-line-container {
    position: absolute;
    top: 16px;
    left: 0;
    width: 100%;
    z-index: 0;
}

.progress-line {
    height: 2px;
    background: linear-gradient(90deg, #2563eb 33.33%, #e5e7eb 33.33%);
}

.step-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    position: relative;
    z-index: 1;
}

.step-number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
    position: relative;
    transition: transform 0.3s ease;
    background-color: #e5e7eb;
    color: #9ca3af;

    &.active {
        background-color: #2563eb;
        color: #ffffff;
    }

    &:hover {
        transform: scale(1.1);
    }
}

.pulse-animation {
    position: absolute;
    inset: 0;
    background-color: #2563eb;
    border-radius: 50%;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.step-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    background-color: #9ca3af;
    color: #ffffff;
    border-radius: 50%;
    font-family: 'SF Pro Display', sans-serif;

    &.active {
        background-color: #10b981;
    }
}

.step-label {
    font-family: 'SF Pro Display', sans-serif;
    font-weight: 500;
    color: #9ca3af;
    transition: transform 0.3s;

    &.active {
        color: #2563eb;
    }

    .step-container:hover & {
        transform: scale(1.05);
    }
}

.step-tooltip-trigger {
    position: absolute;
    inset: 0;
    cursor: pointer;
}

.step-tooltip-content {
    p {
        font-size: 0.75rem;
        color: #4b5563;
        white-space: nowrap;
    }
}

// Main content layout
.main-content {
    display: flex;
    gap: 2rem;
}

// Form section
.product-form-container {
    width: 41.666667%;
    background-color: #ffffff;
    border-radius: 0.75rem;
    padding: 2rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.section-title {
    font-family: 'SF Pro Display', sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
}

// Override Element Plus form styles
:deep(.el-form-item__label) {
    font-weight: 500;
}

.w-100 {
    width: 100%;
}

.selling-points-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.ai-generate-button {
    color: #2563eb;
    border: none;
    background: transparent;

    &:hover {
        color: darken(#2563eb, 10%);
    }
}

.suggested-points {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.point-item {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding: 0.75rem;
    background-color: #f9fafb;
    border-radius: 0.5rem;
    cursor: pointer;

    &:hover {
        background-color: #f3f4f6;
    }
}

// Customize the upload component
:deep(.el-upload-dragger) {
    width: 100%;
    height: auto;
    padding: 2rem 0;
}

.upload-icon {
    font-size: 2.25rem !important;
    color: #d1d5db;
    margin-bottom: 1rem;
}

.upload-text {
    color: #6b7280;
    margin-bottom: 0.5rem;
}

.upload-hint {
    color: #9ca3af;
    font-size: 0.875rem;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
}

.analyze-button {
    padding: 0.75rem 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
}

// Recommendations section
.recommendations-container {
    width: 58.333333%;
    background-color: #ffffff;
    border-radius: 0.75rem;
    padding: 2rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.audience-groups {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.audience-card {
    cursor: pointer;
    margin-bottom: 0 !important;

    &.is-selected {
        :deep(.el-card__body) {
            border: 1px solid #2563eb;
            border-radius: 0.5rem;
        }
    }
}

.audience-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.audience-title {
    font-family: 'SF Pro Display', sans-serif;
    font-size: 1.25rem;
    font-weight: 500;
    margin: 0;
}

.match-rate {
    color: #2563eb;
    font-weight: 500;
}

.audience-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.audience-detail {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #4b5563;
}

.recommendation-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
}

.next-button {
    padding: 0.75rem 2rem;
}

// Utility to disable number input spinners
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

// Responsive adjustments
@media screen and (max-width: 1200px) {
    .main-content {
        flex-direction: column;
    }

    .product-form-container,
    .recommendations-container {
        width: 100%;
    }

    .progress-steps {
        width: 100%;
        gap: 3rem;
    }
}

@media screen and (max-width: 768px) {
    .content-wrapper {
        padding: 1.5rem 1rem;
    }

    .progress-steps {
        gap: 1.5rem;
    }
}
</style>
