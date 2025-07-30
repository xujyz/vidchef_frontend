<template>
    <div class="app-container">
        <!-- Header -->
        <el-header class="header">
            <div class="header-left">
                <span class="logo">ClipCook</span>
                <div class="steps-container">
                    <div class="step-item">
                        <div class="step-number completed">1</div>
                        <div class="step-line completed"></div>
                        <div class="step-number completed">2</div>
                        <div class="step-line active"></div>
                        <div class="step-number active">3</div>
                    </div>
                    <div class="step-label">视频生成</div>
                </div>
            </div>
            <div class="header-right">
                <el-button type="primary" class="export-button">
                    <el-icon>
                        <Download />
                    </el-icon>
                    导出 HD
                </el-button>
                <el-avatar :size="40" :icon="UserFilled" />
            </div>
        </el-header>

        <!-- Main Content -->
        <el-main class="main-content">
            <!-- Scene List Section -->
            <div class="scene-section">
                <div class="scene-header">
                    <h2 class="section-title">场景列表</h2>
                    <el-button class="add-scene-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        添加场景
                    </el-button>
                </div>

                <div class="scene-list">
                    <div v-for="(scene, index) in scenes" :key="index" class="scene-item-wrapper">
                        <el-card class="scene-item" :class="{ 'is-selected': selectedSceneIndex === index }"
                            shadow="hover" @click="selectScene(index)">
                            <div class="scene-content">
                                <div class="scene-thumbnail">
                                    <el-image :src="scene.thumbnail" fit="cover" class="thumbnail-image" />
                                    <el-button class="replace-button" size="small">替换</el-button>
                                </div>
                                <div class="scene-details">
                                    <div class="scene-header">
                                        <div class="scene-title">场景 {{ index + 1 }}</div>
                                        <div class="scene-duration">{{ scene.duration }}</div>
                                    </div>
                                    <el-input v-model="scene.description" type="textarea" :rows="4" resize="none"
                                        placeholder="编辑场景描述" class="scene-description" />
                                </div>
                            </div>
                        </el-card>

                        <div class="scene-actions">
                            <el-button circle class="action-button">
                                <el-icon>
                                    <Rank />
                                </el-icon>
                            </el-button>
                            <el-button circle class="action-button">
                                <el-icon>
                                    <Edit />
                                </el-icon>
                            </el-button>
                            <el-button circle class="action-button" @click="removeScene(index)">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Preview Section -->
            <div class="preview-section">
                <div class="preview-header">
                    <div class="preview-tabs">
                        <el-button :type="activeTab === 'scene' ? 'primary' : ''"
                            @click="activeTab = 'scene'">场景</el-button>
                        <el-button :type="activeTab === 'settings' ? 'primary' : ''"
                            @click="activeTab = 'settings'">设置</el-button>
                    </div>
                    <div class="preview-quality">预览：480P</div>
                </div>

                <!-- Video Preview -->
                <div class="video-preview-container">
                    <el-image :src="currentScene?.thumbnail || ''" fit="cover" class="video-preview" />
                    <div class="play-button-overlay">
                        <el-button class="play-button" circle>
                            <el-icon>
                                <VideoPlay />
                            </el-icon>
                        </el-button>
                    </div>
                </div>

                <!-- Video Controls -->
                <div class="video-controls">
                    <div class="playback-controls">
                        <el-button circle class="control-button">
                            <el-icon>
                                <Back />
                            </el-icon>
                        </el-button>
                        <el-button circle class="control-button">
                            <el-icon>
                                <VideoPlay />
                            </el-icon>
                        </el-button>
                        <el-button circle class="control-button">
                            <el-icon>
                                <Right />
                            </el-icon>
                        </el-button>
                        <span class="time-display">01:30 / 01:42</span>
                    </div>
                    <div class="feedback-controls">
                        <el-button circle class="control-button">
                            <el-icon>
                                <Star />
                            </el-icon>
                        </el-button>
                        <el-button circle class="control-button">
                            <el-icon>
                                <StarFilled />
                            </el-icon>
                        </el-button>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="progress-container">
                    <div class="progress-bar" :style="{ '--progress': '70%' }">
                        <div class="scene-markers">
                            <div class="scene-marker" style="width: 33.33%"></div>
                            <div class="scene-marker" style="width: 33.33%"></div>
                            <div class="scene-marker" style="width: 33.33%"></div>
                        </div>
                        <div class="progress-handle" style="left: 70%">
                            <div class="handle-dot"></div>
                        </div>
                    </div>
                </div>
            </div>
        </el-main>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
    Download,
    UserFilled,
    Plus,
    Rank,
    Edit,
    Delete,
    VideoPlay,
    Star,
    StarFilled,
    Back,
    Right
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// Scene data
const scenes = ref([
    {
        thumbnail: 'https://ai-public.mastergo.com/ai/img_res/0f9722a333b0f748c9c0381417c1253a.jpg',
        duration: '00:11',
        description: '在这个充满不确定性的世界里，很容易感到焦虑和恐惧。让我们一起探索如何通过关注可控的事物来改善心理健康。'
    },
    {
        thumbnail: 'https://ai-public.mastergo.com/ai/img_res/29574c973d6142d89640cb7b513bff30.jpg',
        duration: '00:14',
        description: '照顾好自己很重要。通过管理压力水平、保证充足睡眠、保持活力和健康饮食来照顾自己。这些都是改善整体健康和保持心理健康的重要行动。'
    },
    {
        thumbnail: 'https://ai-public.mastergo.com/ai/img_res/c0fe8165eca5eadeb48b59e2b1d8b095.jpg',
        duration: '00:14',
        description: '与他人保持联系。联系亲朋好友是减轻焦虑和改善心理健康的好方法。通过电话、短信和社交媒体，在保持适当社交距离的同时保持联系。'
    },
    {
        thumbnail: 'https://ai-public.mastergo.com/ai/img_res/37146370ed97fb5fea1ffa298e411d37.jpg',
        duration: '00:12',
        description: '正念练习和放松技巧可以帮助我们缓解压力。每天花一些时间进行深呼吸、冥想或其他放松活动，可以显著改善我们的心理健康状态。'
    },
    {
        thumbnail: 'https://ai-public.mastergo.com/ai/img_res/f8db56908a756841ba8df5a1da9fe2ed.jpg',
        duration: '00:15',
        description: '培养兴趣爱好对维护心理健康非常重要。无论是绘画、园艺、运动还是烹饪，找到让自己快乐的活动，并坚持下去，这会让生活更加充实。'
    }
]);

const selectedSceneIndex = ref(0);
const activeTab = ref('scene');

// Computed properties
const currentScene = computed(() => scenes.value[selectedSceneIndex.value] || null);

// Methods
const selectScene = (index) => {
    selectedSceneIndex.value = index;
};

const removeScene = (index) => {
    ElMessageBox.confirm('确定要删除这个场景吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        scenes.value.splice(index, 1);
        ElMessage.success('场景已删除');

        // If the deleted scene was selected, select another one
        if (index === selectedSceneIndex.value) {
            selectedSceneIndex.value = Math.min(index, scenes.value.length - 1);
            if (selectedSceneIndex.value < 0) selectedSceneIndex.value = 0;
        } else if (index < selectedSceneIndex.value) {
            // Adjust the selectedSceneIndex if a scene before it was removed
            selectedSceneIndex.value--;
        }
    }).catch(() => {
        // User canceled
    });
};

// Additional methods would be implemented here for a real application
// Such as: addScene, reorderScenes, playVideo, exportVideo, etc.
</script>

<style scoped lang="scss">
// Import fonts in your main App.vue or index.html
@import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Poppins:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;700&display=swap');

// Base styles
.app-container {
    width: 1440px;
    margin: 0 auto;
    font-family: 'Noto Sans SC', sans-serif;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

// Header styles
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    padding: 0 1.5rem;
    border-bottom: 1px solid #e5e7eb;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.logo {
    font-family: 'Pacifico', serif;
    font-size: 1.5rem;
    color: #246BFD;
}

.steps-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.step-item {
    display: flex;
    align-items: center;
}

.step-number {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f3f4f6;
    color: #9ca3af;

    &.active {
        background-color: #246BFD;
        color: #ffffff;
    }

    &.completed {
        background-color: #f3f4f6;
        color: #9ca3af;
    }
}

.step-line {
    width: 4rem;
    height: 2px;
    background-color: #e5e7eb;

    &.active {
        background-color: #246BFD;
    }

    &.completed {
        background-color: #e5e7eb;
    }
}

.step-label {
    font-size: 0.875rem;
    color: #6b7280;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.export-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

// Main content styles
.main-content {
    display: flex;
    height: calc(100vh - 64px);
    padding: 0;
}

// Scene list section
.scene-section {
    width: 50%;
    border-right: 1px solid #e5e7eb;
    padding: 1rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.scene-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.section-title {
    font-size: 1.125rem;
    font-weight: 500;
}

.add-scene-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
}

.scene-list {
    overflow-y: auto;
    height: calc(100vh - 130px);
    padding-right: 0.5rem;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;
    }
}

.scene-item-wrapper {
    position: relative;
    margin-bottom: 2.5rem;

    &:hover {
        .scene-actions {
            display: flex;
        }
    }
}

.scene-item {
    transition: all 0.3s ease;
    cursor: pointer;
    overflow: visible;

    &.is-selected {
        background-color: #EEF4FF;
        border: 1px solid #246BFD;
    }

    &:hover {
        background-color: #f3f4f6;
    }

    :deep(.el-card__body) {
        padding: 1.5rem;
    }
}

.scene-content {
    display: flex;
    gap: 1rem;
}

.scene-thumbnail {
    position: relative;
    width: 6rem;
    height: 6rem;
    border-radius: 0.375rem;
    overflow: hidden;
    flex-shrink: 0;
}

.thumbnail-image {
    width: 100%;
    height: 100%;
}

.replace-button {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
}

.scene-details {
    flex: 1;
    min-height: 7.5rem;
    display: flex;
    flex-direction: column;
}

.scene-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.scene-title {
    font-size: 1.125rem;
    font-weight: 500;
}

.scene-duration {
    font-size: 0.875rem;
    color: #6b7280;
}

.scene-description {
    flex: 1;

    :deep(.el-textarea__inner) {
        height: 100%;
        font-size: 1.125rem;
        resize: none;
    }
}

.scene-actions {
    position: absolute;
    right: 1rem;
    bottom: -0.5rem;
    display: none;
    gap: 0.5rem;
    z-index: 10;
}

.action-button {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    border: 1px solid #e5e7eb;

    &:hover {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
}

// Preview section
.preview-section {
    width: 50%;
    padding: 1.5rem;
}

.preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.preview-tabs {
    display: flex;
    gap: 1rem;
}

.preview-quality {
    font-size: 0.875rem;
    color: #6b7280;
}

.video-preview-container {
    position: relative;
    width: 400px;
    height: 600px;
    margin: 0 auto 1rem;
    border-radius: 0.5rem;
    overflow: hidden;
}

.video-preview {
    width: 100%;
    height: 100%;
}

.play-button-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.play-button {
    width: 4rem;
    height: 4rem;
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);

    .el-icon {
        font-size: 1.5rem;
        color: #ffffff;
    }
}

.video-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.playback-controls,
.feedback-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.time-display {
    font-size: 0.875rem;
    color: #6b7280;
}

.control-button {
    color: #4b5563;
}

.progress-container {
    position: relative;
    width: 100%;
    height: 4px;
    background-color: #e5e7eb;
    border-radius: 9999px;
    overflow: hidden;
}

.progress-bar {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #246BFD var(--progress), #e5e7eb var(--progress));
    position: relative;
}

.scene-markers {
    position: absolute;
    inset: 0;
    display: flex;
}

.scene-marker {
    height: 100%;
    border-right: 2px solid #246BFD;

    &:last-child {
        border-right: none;
    }
}

.progress-handle {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}

.handle-dot {
    width: 12px;
    height: 12px;
    background-color: #ffffff;
    border: 2px solid #246BFD;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateX(-50%);
}

// Element Plus customizations
:deep(.el-button.is-circle) {
    padding: 8px;
}

:deep(.el-button--primary) {
    background-color: #246BFD;
    border-color: #246BFD;

    &:hover,
    &:focus {
        background-color: darken(#246BFD, 5%);
        border-color: darken(#246BFD, 5%);
    }
}
</style>
