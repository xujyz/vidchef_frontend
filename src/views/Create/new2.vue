<template>
    <div class="video-player-page">
        <!-- 视频播放容器 -->
        <div class="video-container">
            <!-- 视频元素 -->
            <video ref="videoRef" :src="videoSource" :poster="coverPic" class="main-video" @timeupdate="syncPlayback"
                @loadedmetadata="initPlayer" @play="syncAudioPlay" @pause="syncAudioPause"></video>

            <!-- 音频元素 (隐藏) -->
            <audio ref="audioRef" :src="audioSource" class="hidden-audio"></audio>

            <!-- 字幕显示层 -->
            <div class="subtitle-overlay" v-if="currentSubtitle">
                <p class="subtitle-text" v-html="formattedSubtitle"></p>
            </div>

            <!-- 播放控制层 -->
            <div class="video-controls" :class="{ 'visible': showControls }">
                <div class="progress-bar">
                    <el-slider v-model="currentTime" :max="totalDuration" @change="seekToTime" class="custom-slider" />
                </div>
                <div class="control-buttons">
                    <el-button circle :icon="isPlaying ? VideoPause : VideoPlay" class="play-button"
                        @click="togglePlay" />
                    <el-button circle :icon="isMuted ? Mute : Microphone" class="volume-button" @click="toggleMute" />
                    <span class="time-display">
                        {{ formatTime(currentTime) }} / {{ formatTime(totalDuration) }}
                    </span>
                </div>
            </div>
        </div>

        <!-- 视频信息 -->
        <div class="video-info">
            <h2 class="video-title">{{ videoTitle }}</h2>
            <p class="video-desc">基于简化版render_info的音画同步播放示例</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElSlider, ElButton } from 'element-plus';
import { VideoPlay, VideoPause, Microphone, Mute } from '@element-plus/icons-vue';

// 简化版render_info数据
const renderInfo = {
    code: 0,
    msg: "请求成功",
    data: {
        draftId: "20250819000000001",
        name: "简易睡眠健康指南",
        renderConfig: {
            "type": "canvas",
            "width": 480,
            "height": 854,
            "backgroundColor": "#000000",
            "children": [
                {
                    "id": "track_1",
                    "kind": "primary",
                    "type": "track",
                    "children": [
                        {
                            "id": "scene_1",
                            "type": "scene",
                            "start": 0,
                            "end": 8,
                            "children": [
                                {
                                    "id": "video_1",
                                    "type": "video",
                                    "src": "https://cdn.example.com/videos/sleep-1.mp4",
                                    "start": 0,
                                    "end": 8,
                                    "scale": 1.2,
                                    "coverPic": "https://cdn.example.com/covers/sleep-1.jpg"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "track_2",
                    "kind": "text",
                    "type": "track",
                    "children": [
                        {
                            "id": "subtitle_1",
                            "type": "subtitle",
                            "text": "保持规律作息有助于睡眠",
                            "start": 0,
                            "end": 8,
                            "x": 0.5,
                            "y": 0.78,
                            "fill": "#FFFFFF",
                            "fontSize": 0.04,
                            "wordBoundars": [
                                {
                                    "audioOffset": 0.2,
                                    "duration": 0.8,
                                    "text": "保持",
                                    "textOffset": 0
                                },
                                {
                                    "audioOffset": 1.0,
                                    "duration": 0.8,
                                    "text": "规律",
                                    "textOffset": 2
                                },
                                {
                                    "audioOffset": 1.8,
                                    "duration": 1.0,
                                    "text": "作息",
                                    "textOffset": 4
                                },
                                {
                                    "audioOffset": 2.8,
                                    "duration": 1.2,
                                    "text": "有助于",
                                    "textOffset": 6
                                },
                                {
                                    "audioOffset": 4.0,
                                    "duration": 1.5,
                                    "text": "睡眠",
                                    "textOffset": 9
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "track_3",
                    "kind": "audio",
                    "type": "track",
                    "children": [
                        {
                            "id": "audio_1",
                            "type": "speech",
                            "src": "https://cdn.example.com/audios/sleep-1.mp3",
                            "start": 0,
                            "end": 8,
                            "volume": 1.0
                        }
                    ]
                }
            ]
        },
        ratio: "9:16",
        coverPic: "https://cdn.example.com/covers/main.jpg",
        textModel: "basic"
    }
};

// 解析核心数据
const config = renderInfo.data.renderConfig;
const tracks = {
    video: config.children.find(t => t.kind === 'primary'),
    subtitle: config.children.find(t => t.kind === 'text'),
    audio: config.children.find(t => t.kind === 'audio')
};

// 媒体资源
const videoSource = ref(tracks.video.children[0].children[0].src);
const audioSource = ref(tracks.audio.children[0].src);
const coverPic = ref(renderInfo.data.coverPic);
const videoTitle = ref(renderInfo.data.name);

// 字幕配置
const subtitleConfig = ref(tracks.subtitle.children[0]);
const subtitleX = ref(subtitleConfig.value.x);
const subtitleY = ref(subtitleConfig.value.y);

// 播放器状态
const videoRef = ref(null);
const audioRef = ref(null);
const currentTime = ref(0);
const totalDuration = ref(0);
const isPlaying = ref(false);
const isMuted = ref(false);
const showControls = ref(true);
const currentSubtitle = ref(subtitleConfig.value);
const formattedSubtitle = ref('');

// 初始化播放器
const initPlayer = () => {
    if (videoRef.value) {
        totalDuration.value = videoRef.value.duration || 8; // 默认为配置中的8秒
    }
};

// 时间格式化
const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};

// 处理视频时间更新
const handleTimeUpdate = () => {
    if (videoRef.value) {
        currentTime.value = videoRef.value.currentTime;
        updateSubtitleDisplay();
    }
};

// 更新字幕显示（带逐字高亮）
const updateSubtitleDisplay = () => {
    if (!currentSubtitle.value) return;

    // 计算当前字幕相对时间（相对于字幕开始时间）
    const relativeTime = currentTime.value - currentSubtitle.value.start;
    let html = '';

    // 遍历单词，添加高亮和描边样式
    currentSubtitle.value.wordBoundars.forEach(word => {
        const isActive = relativeTime >= word.audioOffset &&
            relativeTime <= word.audioOffset + word.duration;

        html += `<span class="subtitle-word ${isActive ? 'active' : ''}">${word.text}</span>`;
    });

    formattedSubtitle.value = html;
};

// 同步音频到视频进度
const syncAudioToVideo = () => {
    if (videoRef.value && audioRef.value) {
        const timeDiff = Math.abs(videoRef.value.currentTime - audioRef.value.currentTime);
        if (timeDiff > 0.3) { // 差异超过0.3秒时强制同步
            audioRef.value.currentTime = videoRef.value.currentTime;
        }
    }
};

// 播放/暂停切换
const togglePlayPause = () => {
    if (!videoRef.value || !audioRef.value) return;

    if (isPlaying.value) {
        videoRef.value.pause();
        audioRef.value.pause();
    } else {
        videoRef.value.play().catch(err => {
            console.log('视频自动播放失败:', err);
            ElMessage.warning('请点击播放按钮开始播放');
        });
        audioRef.value.play().catch(err => {
            console.log('音频自动播放失败:', err);
        });
    }
    isPlaying.value = !isPlaying.value;
};

// 同步音频播放状态
const syncAudioPlay = () => {
    if (audioRef.value && audioRef.value.paused) {
        audioRef.value.play();
    }
    isPlaying.value = true;
    hideControlsAfterDelay();
};

// 同步音频暂停状态
const syncAudioPause = () => {
    if (audioRef.value && !audioRef.value.paused) {
        audioRef.value.pause();
    }
    isPlaying.value = false;
    showControls.value = true;
};

// 进度条跳转
const seekTo = (time) => {
    if (videoRef.value && audioRef.value) {
        videoRef.value.currentTime = time;
        audioRef.value.currentTime = time;
        currentTime.value = time;
    }
};

// 切换静音
const toggleMute = () => {
    if (videoRef.value && audioRef.value) {
        videoRef.value.muted = !isMuted.value;
        audioRef.value.muted = !isMuted.value;
        isMuted.value = !isMuted.value;
    }
};

// 控制栏自动隐藏
const hideControlsAfterDelay = () => {
    if (isPlaying.value) {
        setTimeout(() => {
            showControls.value = false;
        }, 3000);
    }
};

// 监听鼠标移动显示控制栏
onMounted(() => {
    const videoWrapper = document.querySelector('.video-wrapper');
    videoWrapper.addEventListener('mousemove', () => {
        if (isPlaying.value) {
            showControls.value = true;
            hideControlsAfterDelay();
        }
    });
});
</script>

<style scoped lang="scss">
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

    // 字幕样式（艺术字效果）
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

            // 艺术字效果
            text-shadow: 0 0 5px rgba(0, 0, 0, 0.8),
                0 2px 2px rgba(0, 0, 0, 0.5);
            background: linear-gradient(135deg, #ffffff, #f0f0f0);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.6));
        }

        .subtitle-word {
            display: inline-block;
            margin: 0 2px;
            transition: all 0.2s ease;

            &.active {
                // 高亮动画效果
                color: #ffdd00;
                transform: scale(1.1);
                text-shadow: 0 0 8px rgba(255, 221, 0, 0.8);
                animation: pulse 0.5s ease-in-out;
            }
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
            opacity: 1;
        }

        .progress-bar {
            margin-bottom: 0.8rem;

            .custom-slider {
                width: 100%;

                ::v-deep(.el-slider__runway) {
                    height: 4px;
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
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
            }
        }
    }
}

// 视频信息样式
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

// 字幕动画
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