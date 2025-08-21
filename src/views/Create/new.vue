<template>
    <div class="video-player-page">
        <div class="video-container">
            <!-- 视频元素 -->
            <video ref="videoRef" :src="videoSource" :poster="coverPic" class="main-video"
                @timeupdate="handleTimeUpdate" @loadedmetadata="handleLoadedMetadata" @play="handlePlay"
                @pause="handlePause" @click="togglePlayPause"></video>

            <!-- 音频元素 -->
            <audio ref="audioRef" :src="audioSource" class="hidden-audio">
            </audio>

            <!-- 字幕显示层 -->
            <div class="subtitle-overlay" v-if="currentSubtitle && isSubtitleActive">
                <p class="subtitle-text" v-html="formattedSubtitle"></p>
            </div>

            <!-- 控制栏 -->
            <div class="video-controls" :class="{ 'visible': showControls }">
                <div class="progress-bar">
                    <el-slider v-model="currentTime" :max="totalDuration" @change="seekTo" class="custom-slider" />
                </div>
                <div class="control-buttons">
                    <el-button circle :icon="isPlaying ? VideoPause : VideoPlay" class="play-button"
                        @click="togglePlayPause" />
                    <el-button circle :icon="isMuted ? Mute : Microphone" class="volume-button" @click="toggleMute" />
                    <span class="time-display">
                        {{ formatTime(currentTime) }} / {{ formatTime(totalDuration) }}
                    </span>
                </div>
            </div>
        </div>

        <div class="video-info">
            <h2 class="video-title">{{ videoTitle }}</h2>
            <p class="video-desc">音画同步播放器示例 - 带逐字高亮字幕</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElSlider, ElButton, ElMessage } from 'element-plus';
import { VideoPlay, VideoPause, Microphone, Mute } from '@element-plus/icons-vue';

// 媒体资源配置（使用稳定的公开资源）
const renderInfo = {
    data: {
        name: "健康睡眠指南",
        renderConfig: {
            children: [
                {
                    kind: "primary",
                    children: [{
                        children: [{
                            src: "https://videos.pexels.com/video-files/33377771/14210305_1080_1918_30fps.mp4",
                            coverPic: "https://ai-public.mastergo.com/ai/img_res/37146370ed97fb5fea1ffa298e411d37.jpg"
                        }]
                    }]
                },
                {
                    kind: "text",
                    children: [{
                        text: "保持规律作息有助于睡眠",
                        start: 0,  // 字幕开始时间（秒）
                        end: 9,   // 字幕结束时间（秒）
                        wordBoundars: [
                            { audioOffset: 0, duration: 2, text: "保持" },  // 相对于字幕start的偏移
                            { audioOffset: 2, duration: 2, text: "规律" },
                            { audioOffset: 4, duration: 2, text: "作息" },
                            { audioOffset: 6, duration: 2, text: "有助于" },
                            { audioOffset: 8, duration: 1, text: "睡眠" }
                        ]
                    }]
                },
                {
                    kind: "audio",
                    children: [{
                        src: "https://lv-sycdn.kuwo.cn/6b8cb0744b4a6c336dd519c718d8823f/68a72a51/resource/30106/trackmedia/M800004O1DHG4MjYOi.mp3"
                    }]
                }
            ]
        },
        coverPic: "https://ai-public.mastergo.com/ai/img_res/37146370ed97fb5fea1ffa298e411d37.jpg"
    }
};

// 解析资源
const tracks = {
    video: renderInfo.data.renderConfig.children.find(t => t.kind === 'primary'),
    subtitle: renderInfo.data.renderConfig.children.find(t => t.kind === 'text'),
    audio: renderInfo.data.renderConfig.children.find(t => t.kind === 'audio')
};

// 状态变量
const videoSource = ref(tracks.video.children[0].children[0].src);
const audioSource = ref(tracks.audio.children[0].src);
const coverPic = ref(renderInfo.data.coverPic);
const videoTitle = ref(renderInfo.data.name);

// 播放器核心状态
const videoRef = ref(null);
const audioRef = ref(null);
const currentTime = ref(0);       // 当前播放时间（秒）
const totalDuration = ref(0);      // 总时长（秒）
const isPlaying = ref(false);      // 是否播放中
const isMuted = ref(false);        // 是否静音
const showControls = ref(true);    // 控制栏是否显示
const currentSubtitle = ref(tracks.subtitle.children[0]);  // 当前字幕
const formattedSubtitle = ref(''); // 带高亮的字幕HTML
const isSubtitleActive = ref(false); // 字幕是否在有效时间范围内
const controlTimer = ref(null);    // 控制栏自动隐藏定时器

// 1. 处理视频元数据加载（获取总时长）
const handleLoadedMetadata = () => {
    if (videoRef.value) {
        totalDuration.value = videoRef.value.duration; // 直接从视频元素获取时长
        console.log("视频总时长:", totalDuration.value);
    }
};

// 2. 时间格式化（确保分秒正确）
const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 3. 视频播放进度更新（核心同步逻辑）
const handleTimeUpdate = () => {
    if (videoRef.value) {
        currentTime.value = videoRef.value.currentTime; // 实时同步当前时间
        syncAudioToVideo(); // 同步音频
        updateSubtitleDisplay(); // 更新字幕高亮
    }
};

// 4. 字幕高亮逻辑（修正时间计算）
const updateSubtitleDisplay = () => {
    if (!currentSubtitle.value) return;

    const { start: subtitleStart, end: subtitleEnd, wordBoundars } = currentSubtitle.value;
    // 判断当前时间是否在字幕有效范围内（2s ~ 12s）
    isSubtitleActive.value = currentTime.value >= subtitleStart && currentTime.value <= subtitleEnd;

    if (!isSubtitleActive.value) {
        formattedSubtitle.value = '';
        return;
    }

    // 计算当前时间相对于字幕开始的偏移量（核心修正）
    const relativeTime = currentTime.value - subtitleStart;
    let html = '';

    wordBoundars.forEach(word => {
        const wordStart = word.audioOffset;         // 单词在字幕内的开始时间（如0.2s）
        const wordEnd = word.audioOffset + word.duration; // 单词结束时间（如0.2+0.8=1.0s）
        const isActive = relativeTime >= wordStart && relativeTime <= wordEnd;

        html += `<span class="subtitle-word ${isActive ? 'active' : ''}">${word.text}</span>`;
    });

    formattedSubtitle.value = html;
};

// 5. 音频与视频同步
const syncAudioToVideo = () => {
    if (videoRef.value && audioRef.value) {
        const videoTime = videoRef.value.currentTime;
        const audioTime = audioRef.value.currentTime;
        // 时间差超过0.5秒则强制同步
        if (Math.abs(videoTime - audioTime) > 0.5) {
            audioRef.value.currentTime = videoTime;
        }
    }
};

// 6. 播放/暂停切换（修正状态同步）
const togglePlayPause = () => {
    if (!videoRef.value || !audioRef.value) return;

    if (isPlaying.value) {
        // 暂停逻辑
        videoRef.value.pause();
        audioRef.value.pause();
        isPlaying.value = false;
        showControls.value = true; // 暂停时强制显示控制栏
        clearTimeout(controlTimer.value); // 清除自动隐藏定时器
    } else {
        // 播放逻辑
        Promise.all([
            videoRef.value.play(),
            audioRef.value.play()
        ]).then(() => {
            isPlaying.value = true;
            hideControlsAfterDelay(); // 播放时自动隐藏控制栏
        }).catch(err => {
            ElMessage.error(`播放失败：${err.message}`);
        });
    }
};

// 7. 播放状态处理
const handlePlay = () => {
    isPlaying.value = true;
    hideControlsAfterDelay();
};

// 8. 暂停状态处理
const handlePause = () => {
    isPlaying.value = false;
    showControls.value = true;
    // 直接使用全局的 clearTimeout
    clearTimeout(controlTimer.value);
};

// 9. 进度条拖动跳转
const seekTo = (time) => {
    if (videoRef.value && audioRef.value) {
        const validTime = Math.max(0, Math.min(time, totalDuration.value));
        videoRef.value.currentTime = validTime;
        audioRef.value.currentTime = validTime;
        currentTime.value = validTime; // 同步进度条显示
        updateSubtitleDisplay(); // 更新字幕
    }
};

// 10. 静音切换
const toggleMute = () => {
    if (videoRef.value && audioRef.value) {
        videoRef.value.muted = !isMuted.value;
        audioRef.value.muted = !isMuted.value;
        isMuted.value = !isMuted.value;
    }
};

// 11. 控制栏自动隐藏
const hideControlsAfterDelay = () => {
    if (isPlaying.value) {
        // 直接使用全局的 clearTimeout
        clearTimeout(controlTimer.value);
        controlTimer.value = setTimeout(() => {
            showControls.value = false;
        }, 3000);
    }
};

// 初始化事件监听
onMounted(() => {
    // 监听鼠标移动显示控制栏
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
        videoContainer.addEventListener('mousemove', () => {
            if (isPlaying.value) {
                showControls.value = true;
                hideControlsAfterDelay();
            }
        });
    }
});
</script>

<style lang="scss">
.video-player-page {
    max-width: 500px;
    margin: 2rem auto;
    padding: 1rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.video-container {
    position: relative;
    width: 100%;
    aspect-ratio: 9/16;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;

    .main-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .hidden-audio {
        display: none;
    }

    // 字幕样式
    .subtitle-overlay {
        position: absolute;
        bottom: 20%;
        left: 0;
        right: 0;
        padding: 0 10%;
        text-align: center;
        pointer-events: none;

        .subtitle-text {
            color: #fff;
            font-size: 1.2rem;
            margin: 0;
            line-height: 1.5;
            text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
        }

        .subtitle-word {
            display: inline-block;
            margin: 0 2px;
            transition: all 0.2s ease;
        }

        .subtitle-word.active {
            color: #ffdd00 !important;
            transform: scale(1.1);
            text-shadow: 0 0 8px rgba(255, 221, 0, 0.8);
            animation: pulse 0.5s ease-in-out;
        }
    }

    // 控制栏样式
    .video-controls {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 1rem;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
        transition: opacity 0.3s ease;
        opacity: 0;

        &.visible {
            opacity: 1; // 显示控制栏
        }

        .progress-bar {
            margin-bottom: 0.8rem;

            .custom-slider {
                width: 100%;

                ::v-deep(.el-slider__runway) {
                    height: 4px;
                    background: rgba(255, 255, 255, 0.3);
                }

                ::v-deep(.el-slider__bar) {
                    background: #409eff;
                }

                ::v-deep(.el-slider__button) {
                    width: 12px;
                    height: 12px;
                    margin-top: -4px;
                }
            }
        }

        .control-buttons {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .play-button,
            .volume-button {
                width: 36px;
                height: 36px;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: #fff;

                &:hover {
                    background: rgba(255, 255, 255, 0.3);
                    color: #fff;
                }
            }

            .time-display {
                color: #fff;
                font-size: 0.85rem;
            }
        }
    }
}

.video-info {
    padding: 1rem 0 0.5rem;

    .video-title {
        margin: 0 0 0.5rem;
        color: #333;
        font-size: 1.3rem;
        font-weight: 600;
    }

    .video-desc {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
    }
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.15);
    }

    100% {
        transform: scale(1.1);
    }
}
</style>