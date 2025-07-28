<template>
    <div class="app-container">
        <!-- Navigation Bar -->
        <el-header class="header">
            <div class="logo-container">
                <span class="logo">logo</span>
            </div>
            <div class="steps-container">
                <div class="step-item">
                    <div class="step-content">
                        <div class="step-number completed">1</div>
                        <div class="step-label completed">人群定位</div>
                    </div>
                    <div class="step-line completed"></div>
                </div>
                <div class="step-item">
                    <div class="step-content">
                        <div class="step-number active">2</div>
                        <div class="step-label active">模板匹配</div>
                    </div>
                    <div class="step-line"></div>
                </div>
                <div class="step-item">
                    <div class="step-content">
                        <div class="step-number">3</div>
                        <div class="step-label">视频生成</div>
                    </div>
                </div>
            </div>
            <div class="user-profile">
                <el-avatar :size="32" :src="userAvatar"></el-avatar>
            </div>
        </el-header>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Left Sidebar -->
            <div class="sidebar">
                <el-card class="settings-card">
                    <!-- Platform Selection -->
                    <div class="settings-section">
                        <h3 class="section-title">选择平台</h3>
                        <div class="platform-buttons">
                            <el-button class="platform-button" :class="{ active: selectedPlatform === 'tiktok' }"
                                @click="selectPlatform('tiktok')">
                                <el-icon>
                                    <Platform />
                                </el-icon>
                                <span>TikTok</span>
                            </el-button>
                            <el-button class="platform-button" :class="{ active: selectedPlatform === 'wechat' }"
                                @click="selectPlatform('wechat')">
                                <el-icon>
                                    <ChatDotRound />
                                </el-icon>
                                <span>视频号</span>
                            </el-button>
                            <el-button class="platform-button" :class="{ active: selectedPlatform === 'instagram' }"
                                @click="selectPlatform('instagram')">
                                <el-icon>
                                    <Picture />
                                </el-icon>
                                <span>Instagram</span>
                            </el-button>
                        </div>
                    </div>

                    <!-- Language Selection -->
                    <div class="settings-section">
                        <h3 class="section-title">选择语言</h3>
                        <div class="language-buttons">
                            <el-button class="language-button" :class="{ active: selectedLanguage === 'english' }"
                                @click="selectLanguage('english')">
                                <el-icon>
                                    <InfoFilled />
                                </el-icon>
                                <span>英语</span>
                            </el-button>
                            <el-button class="language-button" :class="{ active: selectedLanguage === 'spanish' }"
                                @click="selectLanguage('spanish')">
                                <el-icon>
                                    <InfoFilled />
                                </el-icon>
                                <span>西班牙语</span>
                            </el-button>
                            <el-button class="language-button" :class="{ active: selectedLanguage === 'chinese' }"
                                @click="selectLanguage('chinese')">
                                <el-icon>
                                    <InfoFilled />
                                </el-icon>
                                <span>中文</span>
                            </el-button>
                        </div>
                    </div>

                    <!-- Material Upload -->
                    <div class="settings-section no-border">
                        <h3 class="section-title">上传素材</h3>
                        <el-upload class="upload-container" drag action="#" :auto-upload="false" :limit="3"
                            :on-change="handleFileChange" :on-exceed="handleExceed" :on-remove="handleRemove"
                            :file-list="fileList" multiple accept="video/mp4,video/quicktime">
                            <el-icon class="upload-icon">
                                <Upload />
                            </el-icon>
                            <div class="el-upload__text">
                                <div class="upload-text">点击或拖拽上传视频</div>
                                <div class="upload-hint">支持 MP4/MOV 格式，≤3段，单段≤100MB</div>
                            </div>
                            <template #file="{ file }">
                                <div class="upload-file-item">
                                    <el-icon class="file-icon">
                                        <VideoPlay />
                                    </el-icon>
                                    <span class="file-name">{{ file.name }}</span>
                                    <el-progress :percentage="file.percentage || 0"
                                        :status="file.status === 'success' ? 'success' : ''" />
                                </div>
                            </template>
                        </el-upload>
                        <el-button class="analyze-button" type="primary" @click="startAnalysis">
                            <el-icon>
                                <VideoPlay />
                            </el-icon>
                            <span>开始分析</span>
                        </el-button>
                    </div>
                </el-card>
            </div>

            <!-- Main Template Section -->
            <div class="template-section">
                <el-card class="template-card">
                    <h3 class="section-title">推荐模板</h3>
                    <div class="recommended-template">
                        <!-- Template Header -->
                        <div class="template-header">
                            <div class="template-icon">
                                <i class="fab fa-tiktok template-platform-icon"></i>
                            </div>
                            <div class="template-info">
                                <div class="template-name">TikTok 爆款模板</div>
                                <div class="template-description">适用于产品展示和功能介绍</div>
                            </div>
                        </div>

                        <!-- Template Sections -->
                        <div class="template-sections">
                            <!-- Section 1 -->
                            <div class="template-section-item">
                                <div class="section-timing">
                                    <div class="timing-label">0-3s</div>
                                    <div class="section-title">痛点开场</div>
                                </div>
                                <div class="section-content">
                                    <div class="section-description">展示用户在日常生活中遇到的问题和困扰，引发共鸣</div>
                                    <el-tag class="section-tag" type="warning">
                                        <el-icon>
                                            <Search />
                                        </el-icon>
                                        <span>线上搜索</span>
                                    </el-tag>
                                </div>
                            </div>

                            <!-- Section 2 -->
                            <div class="template-section-item">
                                <div class="section-timing">
                                    <div class="timing-label">4-8s</div>
                                    <div class="section-title">产品特写</div>
                                </div>
                                <div class="section-content">
                                    <div class="section-description">通过细节特写展示产品的核心优势和独特卖点</div>
                                    <el-tag class="section-tag" type="primary">
                                        <el-icon>
                                            <Upload />
                                        </el-icon>
                                        <span>用户上传</span>
                                    </el-tag>
                                </div>
                            </div>

                            <!-- Section 3 -->
                            <div class="template-section-item">
                                <div class="section-timing">
                                    <div class="timing-label">9-15s</div>
                                    <div class="section-title">功能演示</div>
                                </div>
                                <div class="section-content">
                                    <div class="section-description">深入展示产品的主要功能和使用场景，突出实用性</div>
                                    <el-tag class="section-tag" type="success">
                                        <el-icon>
                                            <Operation />
                                        </el-icon>
                                        <span>AI 生成</span>
                                    </el-tag>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="action-buttons">
                        <el-button @click="goToPreviousStep">
                            <el-icon>
                                <ArrowLeft />
                            </el-icon>
                            <span>上一步</span>
                        </el-button>
                        <el-button type="primary" @click="generateVideo">
                            <span>生成视频</span>
                            <el-icon>
                                <ArrowRight />
                            </el-icon>
                        </el-button>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import {
    Upload,
    VideoPlay,
    Search,
    Operation,
    ArrowLeft,
    ArrowRight,
    InfoFilled,
    ChatDotRound,
    Picture,
    Platform
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// User data
const userAvatar = ref('');

// Selected options
const selectedPlatform = ref('tiktok');
const selectedLanguage = ref('english');
const fileList = ref([]);

// Select platform
const selectPlatform = (platform) => {
    selectedPlatform.value = platform;
    ElMessage.success(`已选择 ${getPlatformName(platform)} 平台`);
};

// Get platform display name
const getPlatformName = (platform) => {
    const names = {
        'tiktok': 'TikTok',
        'wechat': '视频号',
        'instagram': 'Instagram'
    };
    return names[platform] || platform;
};

// Select language
const selectLanguage = (language) => {
    selectedLanguage.value = language;
    ElMessage.success(`已选择 ${getLanguageName(language)}`);
};

// Get language display name
const getLanguageName = (language) => {
    const names = {
        'english': '英语',
        'spanish': '西班牙语',
        'chinese': '中文'
    };
    return names[language] || language;
};

// Handle file upload
const handleFileChange = (file) => {
    // Check file type
    const isVideo = file.raw.type === 'video/mp4' || file.raw.type === 'video/quicktime';

    // Check file size (less than 100MB)
    const isLt100M = file.raw.size / 1024 / 1024 < 100;

    if (!isVideo) {
        ElMessage.error('只能上传 MP4/MOV 格式的视频!');
        return false;
    }

    if (!isLt100M) {
        ElMessage.error('视频大小不能超过 100MB!');
        return false;
    }

    // Set file status and percentage for demo
    setTimeout(() => {
        file.percentage = 100;
        file.status = 'success';
    }, 1000);

    return true;
};

// Handle exceed maximum file count
const handleExceed = () => {
    ElMessage.warning('最多只能上传 3 段视频');
};

// Handle file removal
const handleRemove = (file) => {
    fileList.value = fileList.value.filter(item => item.uid !== file.uid);
};

// Start analysis
const startAnalysis = () => {
    if (fileList.value.length === 0) {
        ElMessage.warning('请先上传视频素材');
        return;
    }

    ElMessage.success('正在分析视频素材...');
    // In a real app, this would trigger an API call to analyze the videos
};

// Navigate to previous step
const goToPreviousStep = () => {
    ElMessageBox.confirm('确定要返回上一步吗？已上传的文件将不会保存。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        ElMessage.success('正在返回人群定位页面');
        // In a real app, this would navigate to the previous page
    }).catch(() => {
        // User canceled
    });
};

// Generate video
const generateVideo = () => {
    if (fileList.value.length === 0) {
        ElMessage.warning('请先上传视频素材并完成分析');
        return;
    }

    ElMessage.success('正在生成视频，即将跳转到视频生成页面');
    // In a real app, this would navigate to the next page
};
</script>

<style scoped lang="scss">
// Import fonts in your main App.vue or index.html
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

// Variables
$primary-color: #1677FF;
$secondary-color: #4CAF50;
$danger-color: #f56c6c;
$warning-color: #e6a23c;
$success-color: #67c23a;
$info-color: #909399;
$gray-50: #f9fafb;
$gray-100: #f3f4f6;
$gray-200: #e5e7eb;
$gray-300: #d1d5db;
$gray-400: #9ca3af;
$gray-500: #6b7280;
$gray-600: #4b5563;
$gray-700: #374151;
$gray-800: #1f2937;
$gray-900: #111827;
$white: #ffffff;
$red-50: #fef2f2;
$red-500: #ef4444;
$blue-50: #eff6ff;
$blue-600: #2563eb;
$orange-50: #fff7ed;
$orange-600: #ea580c;
$purple-50: #faf5ff;
$purple-600: #9333ea;

// Base styles
.app-container {
    width: 1440px;
    margin: 0 auto;
    min-height: 1024px;
    background-color: $gray-50;
}

// Header styles
.header {
    height: 64px;
    background-color: $white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    border-bottom: 1px solid $gray-200;
}

.logo-container {
    display: flex;
    align-items: center;
}

.logo {
    font-family: 'Pacifico', cursive;
    font-size: 1.5rem;
    color: $primary-color;
}

.steps-container {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.step-item {
    display: flex;
    align-items: center;
}

.step-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.step-number {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: $gray-100;
    color: $gray-400;
    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
        background-color: $primary-color;
        color: $white;
    }

    &.completed {
        background-color: rgba($primary-color, 0.1);
        color: $primary-color;
    }
}

.step-label {
    font-size: 0.875rem;
    color: $gray-400;
    white-space: nowrap;

    &.active,
    &.completed {
        color: $primary-color;
    }
}

.step-line {
    width: 5rem;
    height: 2px;
    background-color: $gray-200;
    margin: 0 0.5rem;

    &.completed {
        background-color: $primary-color;
    }
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 1rem;
}

// Main content
.main-content {
    display: flex;
    gap: 1.5rem;
    padding: 2rem;
}

// Sidebar
.sidebar {
    width: 420px;
    flex-shrink: 0;
}

.settings-card {
    height: 100%;

    :deep(.el-card__body) {
        padding: 0;
    }
}

.settings-section {
    padding: 1.5rem;
    border-bottom: 1px solid $gray-200;

    &.no-border {
        border-bottom: none;
    }
}

.section-title {
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 1rem;
}

.platform-buttons,
.language-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
}

.platform-button,
.language-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 2px solid $gray-200;
    color: $gray-600;
    transition: all 0.3s ease;
    border-radius: 4px;

    &:hover {
        border-color: $gray-300;
    }

    &.active {
        border-color: $primary-color;
        background-color: rgba($primary-color, 0.05);
        color: $primary-color;
    }

    :deep(.el-icon) {
        margin-right: 0.25rem;
    }
}

.upload-container {
    border: 2px dashed $gray-200;
    border-radius: 0.75rem;
    padding: 2rem;
    text-align: center;
    margin-bottom: 1.5rem;

    &:hover {
        border-color: $primary-color;
    }

    :deep(.el-upload-dragger) {
        width: 100%;
        height: auto;
        border: none;
        padding: 0;
    }

    :deep(.el-upload__text) {
        margin-top: 1rem;
    }
}

.upload-icon {
    font-size: 2rem;
    color: $primary-color;
    background-color: rgba($primary-color, 0.05);
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
}

.upload-text {
    color: $gray-600;
    margin-bottom: 0.5rem;
}

.upload-hint {
    color: $gray-400;
    font-size: 0.875rem;
}

.upload-file-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;

    .file-icon {
        color: $primary-color;
    }

    .file-name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.analyze-button {
    width: 100%;
    padding: 0.75rem 0;
    font-weight: 500;

    :deep(.el-icon) {
        margin-right: 0.5rem;
    }
}

// Template section
.template-section {
    flex: 1;
}

.template-card {
    :deep(.el-card__body) {
        padding: 1.5rem;
    }
}

.recommended-template {
    border: 2px solid rgba($red-500, 0.3);
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
}

.template-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.template-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 0.5rem;
    background-color: $red-50;
    display: flex;
    align-items: center;
    justify-content: center;
}

.template-platform-icon {
    font-size: 1.5rem;
    color: $red-500;
}

.template-info {
    flex: 1;
}

.template-name {
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
}

.template-description {
    color: $gray-500;
}

.template-sections {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.template-section-item {
    display: flex;
    gap: 1rem;
}

.section-timing {
    width: 10rem;
    flex-shrink: 0;
}

.timing-label {
    font-size: 0.875rem;
    color: $gray-500;
}

.section-content {
    flex: 1;
    background-color: $gray-50;
    border-radius: 0.5rem;
    padding: 1rem;
}

.section-description {
    color: $gray-600;
    margin-bottom: 0.5rem;
}

.section-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;

    :deep(.el-icon) {
        margin-right: 0.25rem;
    }
}

.action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;

    :deep(.el-button) {
        padding: 0.625rem 1.5rem;
        display: flex;
        align-items: center;

        .el-icon {
            margin: 0 0.25rem;
        }
    }
}

// Font Awesome icons
.fab,
.fas {
    font-family: 'Font Awesome 6 Free', sans-serif;
}
</style>
