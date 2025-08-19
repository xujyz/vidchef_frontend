<template>
    <div class="main-content">
        <div class="work-content" v-show="workStep === 'storyboard'">
            <div class="storyboard-form">
                <div class="scene-header">
                    <h2 class="section-title">分镜列表</h2>
                </div>

                <div class="scene-list">
                    <!-- 时间线章节 -->
                    <div v-for="(chapter, chapterIndex) in scriptList" :key="chapterIndex" class="chapter-timeline">
                        <div class="chapter-name">{{ chapter.chapter }}</div>
                        <!-- 分镜项 -->
                        <div v-for="(scene, sceneIndex) in chapter.scene" :key="scene.scene_id"
                            class="scene-item-wrapper" @click="selectScene(chapterIndex, sceneIndex)">
                            <el-card class="scene-item"
                                :class="{ 'is-selected': selectedChapter === chapterIndex && selectedScene === sceneIndex }"
                                shadow="hover">
                                <div class="scene-content">
                                    <div class="scene-thumbnail">
                                        <el-image :src="scene.video_url || 'https://via.placeholder.com/100'"
                                            fit="cover" class="thumbnail-image" />
                                        <el-button class="replace-button" size="small">替换</el-button>
                                    </div>
                                    <div class="scene-details">
                                        <div class="scene-header">
                                            <div class="scene-title">{{ scene.scene_id }}</div>
                                            <div class="scene-duration">{{ scene.scene_duration }}</div>
                                        </div>
                                        <el-input v-model="scene.scene_screen_desc" type="textarea" :rows="2"
                                            resize="none" placeholder="编辑场景字幕" class="scene-description" />
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
            </div>
            <div class="storyboard-res">
                <div class="preview-header">
                    <div class="preview-tabs">
                        <el-button :type="activeTab === 'scene' ? 'primary' : ''"
                            @click="activeTab = 'scene'">分镜</el-button>
                        <el-button :type="activeTab === 'settings' ? 'primary' : ''"
                            @click="activeTab = 'settings'">设置</el-button>
                    </div>
                    <div class="preview-quality">预览：480P</div>
                </div>

                <!-- 视频预览 -->
                <div class="video-preview-container">
                    <video v-if="currentScene" ref="videoRef" :src="currentScene.video_url" controls
                        class="video-preview" @loadeddata="handleVideoLoaded" @timeupdate="handleTimeUpdate">
                        您的浏览器不支持视频播放
                    </video>
                    <div v-else class="video-placeholder">
                        <el-icon class="placeholder-icon">
                            <VideoPlay />
                        </el-icon>
                        <p>请选择分镜</p>
                    </div>

                    <!-- 视频字幕覆盖层 -->
                    <div class="video-subtitle-overlay" v-if="currentScene">
                        <p>{{ currentScene.scene_subtitle }}</p>
                    </div>
                </div>

                <!-- 视频控制和进度条等 -->
                <div class="video-controls">
                    <div class="playback-controls">
                        <el-button circle class="control-button" @click="videoRef?.play()">
                            <el-icon>
                                <VideoPlay />
                            </el-icon>
                        </el-button>
                        <el-button circle class="control-button" @click="videoRef?.pause()">
                            <el-icon>
                                <Pause />
                            </el-icon>
                        </el-button>
                        <span class="time-display" v-if="videoDuration">
                            {{ formatTime(currentTime) }} / {{ formatTime(videoDuration) }}
                        </span>
                    </div>
                </div>
                <div class="progress-container" v-if="videoDuration">
                    <el-slider v-model="currentTime" :max="videoDuration" @change="handleTimeChange"
                        class="video-progress" />
                </div>
                <div class="action-buttons">
                    <el-button @click="goToPreviousStep1">
                        <el-icon>
                            <ArrowLeft />
                        </el-icon>
                        <span>上一步</span>
                    </el-button>
                    <el-button type="primary" class="next-button" @click="goFinish">
                        完成
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ArrowLeft, Plus, VideoPlay } from "@element-plus/icons-vue";
import { onMounted, ref, reactive, computed, nextTick, onUnmounted } from "vue";
import { ElMessage, ElMessageBox, ElSlider, ElCard, ElImage, ElButton, ElInput, ElIcon } from "element-plus";
import { genScripts } from "@/api/generate.js";

// 状态管理
const workStep = ref("storyboard");
const loading = ref(false);
const activeTab = ref('scene');

// 表单数据
const form = reactive({
    prod_name: 'a',
    region: 'e',
    prod_tags: ['a'],
    prod_imgs: ['a'],
    target_consumer: "a",
    script_template: "a",
    script_list: []
});

// 分镜数据管理
const scriptList = ref([]);
const selectedChapter = ref(-1);
const selectedScene = ref(-1);
const currentScene = computed(() => {
    if (
        selectedChapter.value !== -1 &&
        selectedScene.value !== -1 &&
        scriptList.value[selectedChapter.value] &&
        scriptList.value[selectedChapter.value].scene[selectedScene.value]
    ) {
        return scriptList.value[selectedChapter.value].scene[selectedScene.value];
    }
    return null;
});

// 视频相关
const videoRef = ref(null);
const currentTime = ref(0);
const videoDuration = ref(0);

// 格式化时间
const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
        .toString()
        .padStart(2, "0");
    const seconds = Math.floor(time % 60)
        .toString()
        .padStart(2, "0");
    return `${minutes}:${seconds}`;
};

// 视频事件处理
const handleVideoLoaded = () => {
    if (videoRef.value) {
        videoDuration.value = videoRef.value.duration;
    }
};

const handleTimeUpdate = () => {
    if (videoRef.value) {
        currentTime.value = videoRef.value.currentTime;
    }
};

const handleTimeChange = (time) => {
    if (videoRef.value) {
        videoRef.value.currentTime = time;
    }
};

// 分镜选择
const selectScene = (chapterIndex, sceneIndex) => {
    selectedChapter.value = chapterIndex;
    selectedScene.value = sceneIndex;
    nextTick(() => {
        if (videoRef.value) {
            videoRef.value.load();
            videoRef.value.play().catch((err) => {
                console.error("自动播放失败:", err);
            });
        }
    });
};

// 获取分镜数据
const fetchScriptData = async () => {
    loading.value = true;
    try {
        const response = await genScripts(form); // 传入表单数据
        scriptList.value = [
            {
                chapter: "chapter1",
                scene: [
                    {
                        scene_id: "chapter_1_scene_1",
                        scene_screen_desc: "Close-up of greasy hands trying to press range hood buttons while cooking, leaving fingerprints and oil stains on the control panel",
                        scene_screen_short_desc: "greasy hands dirty buttons",
                        scene_subtitle: "Tired of touching greasy range hood buttons with dirty hands while cooking?",
                        use_product_self_footage: false,
                        video_url: "https://videos.pexels.com/video-files/33349850/14200302_1080_1920_30fps.mp4",
                        tts_url: "bbb",
                        thumbnail: 'https://ai-public.mastergo.com/ai/img_res/0f9722a333b0f748c9c0381417c1253a.jpg',
                        scene_duration: '00:11'
                    }
                ]
            },
            {
                "chapter": "Real_Life_Scenario(chapter2)",
                "scene": [
                    {
                        scene_id: "chapter_Real_Life_Scenario_scene_1",
                        scene_screen_desc: "Busy mother cooking stir-fry, smoke everywhere, trying to adjust range hood with oily hands, children coughing in background",
                        scene_screen_short_desc: "busy mother cooking smoke",
                        scene_subtitle: "Meet Sarah, a busy mom who struggles with her old range hood every dinner time.",
                        use_product_self_footage: false,
                        video_url: 'https://videos.pexels.com/video-files/33377771/14210305_1080_1918_30fps.mp4',
                        tts_url: "ddd",
                        thumbnail: 'https://ai-public.mastergo.com/ai/img_res/29574c973d6142d89640cb7b513bff30.jpg',
                        scene_duration: '00:14'
                    },
                    {
                        scene_id: "chapter_Real_Life_Scenario_scene_2",
                        scene_screen_desc: "Split screen showing before: Sarah's kitchen with lingering smoke and grease stains everywhere vs after: clean, smoke-free kitchen",
                        scene_screen_short_desc: "before after kitchen comparison",
                        scene_subtitle: "Here's how Sarah transformed her cooking experience completely.",
                        use_product_self_footage: false,
                        video_url: "https://videos.pexels.com/video-files/32950328/14043633_1440_2560_60fps.mp4",
                        tts_url: "fff",
                        thumbnail: 'https://ai-public.mastergo.com/ai/img_res/c0fe8165eca5eadeb48b59e2b1d8b095.jpg',
                        scene_duration: '00:14'
                    }
                ]
            },
            {
                "chapter": "Real_Life_Scenario(chapter3)",
                "scene": [
                    {
                        scene_id: "chapter_Real_Life_Scenario_scene_1",
                        scene_screen_desc: "Busy mother cooking stir-fry, smoke everywhere, trying to adjust range hood with oily hands, children coughing in background",
                        scene_screen_short_desc: "busy mother cooking smoke",
                        scene_subtitle: "Meet Sarah, a busy mom who struggles with her old range hood every dinner time.",
                        use_product_self_footage: false,
                        video_url: "https://videos.pexels.com/video-files/32904798/14023639_1080_1920_30fps.mp4",
                        tts_url: "ddd",
                        thumbnail: 'https://ai-public.mastergo.com/ai/img_res/37146370ed97fb5fea1ffa298e411d37.jpg',
                        scene_duration: '00:12'
                    },
                    {
                        scene_id: "chapter_Real_Life_Scenario_scene_2",
                        scene_screen_desc: "Split screen showing before: Sarah's kitchen with lingering smoke and grease stains everywhere vs after: clean, smoke-free kitchen",
                        scene_screen_short_desc: "before after kitchen comparison",
                        scene_subtitle: "Here's how Sarah transformed her cooking experience completely.",
                        use_product_self_footage: false,
                        video_url: "https://videos.pexels.com/video-files/33420618/14224991_1080_1920_50fps.mp4",
                        tts_url: "fff",
                        thumbnail: 'https://ai-public.mastergo.com/ai/img_res/c0fe8165eca5eadeb48b59e2b1d8b095.jpg',
                        scene_duration: '00:15'
                    }
                ]
            }
        ]
        // form.script_list = response.data; // 保存到表单

        // 默认选中第一个分镜
        if (scriptList.value.length > 0 && scriptList.value[0].scene.length > 0) {
            selectedChapter.value = 0;
            selectedScene.value = 0;
        }
    } catch (error) {
        ElMessage.error("调用接口时发生错误");
        console.error("调用接口时发生错误:", error);
    } finally {
        loading.value = false;
    }
};

// 生命周期
onMounted(() => {
    fetchScriptData();
});

onUnmounted(() => {
    if (videoRef.value) {
        videoRef.value.pause();
    }
});

// 导航方法
const goToPreviousStep1 = () => {
    ElMessageBox.confirm("确定要返回上一步吗？已上传的文件将不会保存。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        ElMessage.success("正在返回模板匹配页面");
        workStep.value = "template";
    }).catch(() => {
        // 用户取消
    });
};

const goFinish = () => {
    ElMessage.success("已完成");
    // 完成逻辑
};
</script>

<style scoped lang="scss">
.main-content {
    padding: 0 20px 20px 20px;
}

::v-deep(.el-main) {
    padding-top: 0px !important;
}

.generate-step {
    text-align: center;
    display: grid;
    justify-items: center;

    .steps {
        width: 80%;
        height: 28px;

        ::v-deep(.el-step) {
            height: 100%;

            .el-step__line {
                background-color: rgba(0, 0, 0, 0.15);
                margin-right: 30px !important;
                margin-left: 105px !important;
                top: 50%;
                height: 1px;
            }

            .el-step__icon {
                width: 28px;
                height: 28px;
                font-size: 16px;
                border: 1px solid;

                .el-step__icon-inner {
                    font-weight: unset !important;
                }
            }

            .el-step__head.is-process {
                color: #2563eb;
                border-color: #2563eb;
            }

            .el-step__head.is-success {
                color: #2563eb;
                border-color: #2563eb;
            }

            .is-process .el-step__icon.is-text {
                background: #2563eb;
                color: #fff;
            }

            .el-step__title.is-process {
                color: #2563eb;
            }

            .el-step__title.is-success {
                color: #565656;
            }

            .el-step__title {
                position: absolute;
                top: calc((100% - 28px)/2);
                left: calc(50% + 25px);
                line-height: 28px;
            }
        }
    }
}

.work-content {
    display: flex;
    flex-direction: row;
    gap: 20px;
    margin-top: 20px;

    .storyboard-form {
        width: 35%;
        padding: 2rem;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        height: calc(100vh - 120px);
        overflow-y: auto;

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
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .chapter-timeline {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            padding-left: 10px;
            border-left: 2px solid #e5e7eb;
            margin-left: 10px;
        }

        .chapter-name {
            font-size: 1rem;
            font-weight: 600;
            color: #2563eb;
            margin-left: 0.5rem;
            padding-top: 5px;
        }

        .scene-item-wrapper {
            position: relative;
            cursor: pointer;
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
                font-size: 1rem;
                resize: none;
            }
        }
    }

    .storyboard-res {
        flex: 1;
        padding: 2rem;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;

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
            background-color: #000;
        }

        .video-preview {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .video-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #666;
        }

        .placeholder-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: #999;
        }

        .video-subtitle-overlay {
            position: absolute;
            bottom: 50px;
            left: 0;
            right: 0;
            padding: 0 20px;
            text-align: center;
            color: white;
            font-size: 1rem;
            text-shadow: 0 0 3px rgba(0, 0, 0, 0.7);
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
            width: 100%;
            margin-bottom: 1rem;
        }

        .video-progress {
            width: 100%;
        }

        .action-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: auto;
            padding-top: 1rem;
        }
    }
}
</style>
