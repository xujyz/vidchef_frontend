<script setup>
// import { storeToRefs } from 'pinia';
import {
    User, DataAnalysis, Star, ShoppingCart, Upload, Search, Operation, ArrowLeft, ArrowRight,
    InfoFilled, ChatDotRound, Picture, Platform, Plus, Rank, Edit, Delete, VideoPlay, StarFilled, VideoPause
} from '@element-plus/icons-vue'
import { onMounted, ref, reactive, computed, nextTick } from 'vue'
import { EVENT_CODE, ElMessage, ElMessageBox } from 'element-plus'
import { genProdTags, genTargetConsr, genScripts } from '@/api/generate.js'

const workState = ref('')
const workStep = ref('')
const loading = ref(false)
const active = ref(0)

// 是否已提交表单
const isPersonaSubmitted = ref(false);
const isTemplateSubmitted = ref(false);

const generateTags = ref([])  // 存储后端返回的 checkbox tags 选项
const selectedTags = ref([])   // 存储选中的tags 值
const streamContent = ref('')
const streamCompleted = ref(false)
const streamOutputRef = ref(null);
const audienceResData = ref([])
const cancelRequest = ref(null)
const audienceGroups = ref([])
const selectedAudience = ref()

// Selected options
const selectedPlatform = ref('tiktok');
const selectedLanguage = ref('english');
const fileList = ref([]);
const templateList = ref([])

const scriptDemo = ref([])
// 分镜相关状态
const scriptList = ref([]);
const selectedChapter = ref(-1);
const selectedScene = ref(-1);
const videoRef = ref(null);
const videoThumbnailRefs = ref({});
const defaultThumbnail = ref('https://ai-public.mastergo.com/ai/img_res/default-thumbnail.jpg');
const currentTime = ref(0);
const videoDuration = ref(0);
const activeTab = ref('scene');
const isAutoPlaying = ref(false);

// 视频替换相关状态
const videoReplaceDialogVisible = ref(false);
const replacementVideos = ref([
    {
        url: 'https://videos.pexels.com/video-files/33498322/14248462_1440_2560_30fps.mp4',
        resolution: '1440×2560',
        duration: '00:15',
        thumbnail: 'https://picsum.photos/id/1/400/225',
        isPlaying: false
    },
    {
        url: 'https://videos.pexels.com/video-files/9908116/9908116-uhd_1440_2732_25fps.mp4',
        resolution: '1440×2732',
        duration: '00:20',
        thumbnail: 'https://picsum.photos/id/2/400/225',
        isPlaying: false
    },
    {
        url: 'https://videos.pexels.com/video-files/33346796/14199060_1440_2560_30fps.mp4',
        resolution: '1440×2560',
        duration: '00:18',
        thumbnail: 'https://picsum.photos/id/3/400/225',
        isPlaying: false
    },
    {
        url: 'https://videos.pexels.com/video-files/33384158/14213128_1080_1920_25fps.mp4',
        resolution: '1080×1920',
        duration: '00:22',
        thumbnail: 'https://picsum.photos/id/4/400/225',
        isPlaying: false
    }
]);
const selectedReplacementVideo = ref(null);
const currentReplaceChapterIndex = ref(-1);
const currentReplaceSceneIndex = ref(-1);

// 当前选中的场景
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

const form = reactive({
    prod_name: '',
    region: '',
    prod_tags: [],
    prod_imgs: ['a'],
    target_consumer: "a",
    script_template: "a",
    script_list: []
})

onMounted(() => {
    workState.value = 'input'
    active.value = 0
    workStep.value = 'persona'
    loading.value = false
    console.log(workStep, workState, loading)
})

const generateSellingPoints = () => {
    if (!form.prod_name) {
        ElMessage.warning('请先输入商品名称');
        return;
    }

    // ElMessage.success('AI 正在分析您的商品特点...');

    genProdTags(form).then(res => {
        generateTags.value = res.data.data.tags
        console.log(generateTags.value)
    })
};

const onSubmit = () => {
    form.prod_tags = [...form.prod_tags, ...selectedTags.value]
    console.log(form.prod_tags)
    ElMessage.success('正在分析商品信息...');

    // workState.value = 'analyze'
    // 重置流式输出结果
    streamContent.value = ''
    streamCompleted.value = false
    audienceResData.value = []

    // 提交请求并处理流式响应
    cancelRequest.value = genTargetConsr(
        { ...form },
        handleStreamMessage,
        handleStreamComplete,
        handleStreamError
    );

    // 标记为已提交，显示右侧区域
    isPersonaSubmitted.value = true
}

const handleStreamMessage = (data) => {
    console.log('前端收到的数据:', data); // 关键日志：确认数据是否到达这里

    if (!data || typeof data !== 'object') {
        console.warn('无效数据格式:', data);
        return;
    }

    // 处理流式内容
    if (data.type === 'content' && typeof data.data === 'string') {
        const text = data.data;
        let currentPos = 0;

        const typeWriter = () => {
            if (currentPos < text.length) {
                streamContent.value += text.charAt(currentPos);
                currentPos++;
                setTimeout(typeWriter, 1000);
            } else {
                scrollToBottom();
            }
        };

        typeWriter();
    }

    // 处理最终结果
    if (data.type === 'result' && Array.isArray(data.data)) {
        // resultData.value = data.data;
        audienceResData.value = data.data
        console.log(audienceResData.value)

        audienceGroups.value = [
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
        ]
        console.log(audienceGroups.value)

        selectedAudience.value = audienceGroups.value[0]
        console.log(selectedAudience.value)
    }
};


// 处理流结束
const handleStreamComplete = () => {
    streamCompleted.value = true;
    ElMessage.success('分析完成');
    scrollToBottom();
};

// 处理流错误
const handleStreamError = (error) => {
    console.error('流式请求错误:', error);
    ElMessage.error(`分析失败: ${error.message}`);
    isSubmitting.value = false;
};

// 滚动到底部
const scrollToBottom = () => {
    nextTick(() => {
        if (streamOutputRef.value) {
            streamOutputRef.value.scrollTop = streamOutputRef.value.scrollHeight;
        }
    });
};

const selectAudience = (audience) => {
    selectedAudience.value = audience;
    console.log('selectedAudience', selectAudience.value)
};

const goToNextStep = () => {
    // Navigate to the next step (template matching)
    ElMessage.success(`已选择 "${selectedAudience.value.title}" 作为目标人群，即将进入模版匹配环节`);
    // In a real app, this would navigate to the next page or update the current step
    workStep.value = 'template'
    active.value = 1

    templateList.value = [
        {
            id: 1,
            timing: "0-3s",
            title: "痛点开场",
            description: "展示用户在日常生活中遇到的问题和困扰，引发共鸣",
            tag: {
                type: "warning",
                icon: Search,
                text: "线上搜索"
            }
        },
        {
            id: 2,
            timing: "4-8s",
            title: "产品特写",
            description: "通过细节特写展示产品的核心优势和独特卖点",
            tag: {
                type: "primary",
                icon: Upload,
                text: "用户上传"
            }
        },
        {
            id: 3,
            timing: "9-15s",
            title: "功能演示",
            description: "深入展示产品的主要功能和使用场景，突出实用性",
            tag: {
                type: "success",
                icon: Operation,
                text: "AI 生成"
            }
        }
    ]
};

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
        'chinese': '中文',
        'english': '英语',
        'portuguese': '葡萄牙语',
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
    // if (fileList.value.length === 0) {
    //   ElMessage.warning('请先上传视频素材');
    //   return;
    // }

    ElMessage.success('正在分析视频素材...');
    isTemplateSubmitted.value = true
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
        workStep.value = 'persona'
        // In a real app, this would navigate to the previous page
    }).catch(() => {
        // User canceled
    });
};

const generateVideo = async () => {
    // if (fileList.value.length === 0) {
    //   ElMessage.warning('请先上传视频素材并完成分析');
    //   return;
    // }

    ElMessage.success('正在生成视频，即将跳转到视频生成页面');
    // In a real app, this would navigate to the next page or update the current step

    try {
        // 开始加载状态
        loading.value = true;

        // 调用后端接口，传入表单数据
        const response = await genScripts(form);

        // 存储接口返回的数据
        scriptDemo.value = response.data.data;
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

                    },
                    {
                        scene_id: "chapter_Real_Life_Scenario_scene_2",
                        scene_screen_desc: "Split screen showing before: Sarah's kitchen with lingering smoke and grease stains everywhere vs after: clean, smoke-free kitchen",
                        scene_screen_short_desc: "before after kitchen comparison",
                        scene_subtitle: "Here's how Sarah transformed her cooking experience completely.",
                        use_product_self_footage: false,
                        video_url: "https://videos.pexels.com/video-files/32950328/14043633_1440_2560_60fps.mp4",
                        tts_url: "fff",

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
                    },
                    {
                        scene_id: "chapter_Real_Life_Scenario_scene_2",
                        scene_screen_desc: "Split screen showing before: Sarah's kitchen with lingering smoke and grease stains everywhere vs after: clean, smoke-free kitchen",
                        scene_screen_short_desc: "before after kitchen comparison",
                        scene_subtitle: "Here's how Sarah transformed her cooking experience completely.",
                        use_product_self_footage: false,
                        video_url: "https://videos.pexels.com/video-files/33420618/14224991_1080_1920_50fps.mp4",
                        tts_url: "fff",
                    }
                ]
            }
        ]

        form.script_list = scriptList.value
        console.log(form)
        console.log("scriptlist", scriptList.value)
        // 更新状态
        workStep.value = 'storyboard';
        active.value = 2;

        // 初始化所有场景的编辑状态
        scriptList.value.forEach(chapter => {
            chapter.scene.forEach(scene => {
                scene.isEditing = false;
                scene.isAudioGenerating = false;
            });
        });

        // 自动播放第一个场景
        if (scriptList.value.length > 0 && scriptList.value[0].scene.length > 0) {
            nextTick(() => {
                selectedChapter.value = 0;
                selectedScene.value = 0;
                isAutoPlaying.value = true;
                playCurrentVideo();
            });
        }



        // 可以在这里添加成功提示
        ElMessage.success('脚本生成成功');
    } catch (error) {
        // 捕获网络或其他异常
        console.error('调用接口时发生错误:', error);
    } finally {
        // 无论成功失败，都结束加载状态
        loading.value = false;
    }
};

// 生成视频缩略图并获取时长
const generateThumbnail = (chapterIndex, sceneIndex) => {
    const scene = scriptList.value[chapterIndex].scene[sceneIndex];
    const video = videoThumbnailRefs.value[chapterIndex + '-' + sceneIndex];

    if (!video) return;

    // 获取视频时长
    video.onloadedmetadata = () => {
        const duration = video.duration;
        scene.duration = formatTime(duration);
    };

    // 捕获第一帧作为缩略图
    video.currentTime = 1; // 跳到1秒处捕获帧
    video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        scene.thumbnail = canvas.toDataURL('image/jpeg');
    };
};

// 选择并播放场景
const selectAndPlayScene = (chapterIndex, sceneIndex) => {
    // 如果正在生成音频，不允许切换场景
    if (scriptList.value[chapterIndex].scene[sceneIndex].isAudioGenerating) {
        return;
    }

    selectedChapter.value = chapterIndex;
    selectedScene.value = sceneIndex;
    isAutoPlaying.value = false;
    playCurrentVideo();
};

// 播放当前视频
const playCurrentVideo = () => {
    nextTick(() => {
        if (videoRef.value && currentScene.value && !currentScene.value.isAudioGenerating) {
            videoRef.value.load();
            videoRef.value.play().catch((err) => {
                console.error("自动播放失败:", err);
                ElMessage.warning('浏览器阻止了自动播放，请手动点击播放');
            });
        }
    });
};

// 处理视频播放结束
const handleVideoEnded = () => {
    if (!isAutoPlaying.value || !currentScene.value || currentScene.value.isAudioGenerating) return;

    // 查找下一个场景
    let nextChapter = selectedChapter.value;
    let nextScene = selectedScene.value + 1;

    // 检查当前章节是否有下一个场景
    if (nextScene < scriptList.value[nextChapter].scene.length) {
        selectedScene.value = nextScene;
        playCurrentVideo();
    } else {
        // 检查是否有下一个章节
        nextChapter++;
        if (nextChapter < scriptList.value.length && scriptList.value[nextChapter].scene.length > 0) {
            selectedChapter.value = nextChapter;
            selectedScene.value = 0;
            playCurrentVideo();
        } else {
            // 所有视频播放完毕，回到第一个场景
            selectedChapter.value = 0;
            selectedScene.value = 0;
            isAutoPlaying.value = false;
            // 重置视频
            nextTick(() => {
                if (videoRef.value) {
                    videoRef.value.currentTime = 0;
                    videoRef.value.pause();
                }
            });
        }
    }
};

// 切换场景编辑状态
const toggleEditScene = (chapterIndex, sceneIndex) => {
    const scene = scriptList.value[chapterIndex].scene[sceneIndex];

    // 如果正在生成音频，不允许编辑
    if (scene.isAudioGenerating) {
        return;
    }

    // 如果正在编辑，点击则取消编辑
    if (scene.isEditing) {
        scene.isEditing = false;
        return;
    }

    // 关闭其他场景的编辑状态
    scriptList.value.forEach(chap => {
        chap.scene.forEach(sc => {
            sc.isEditing = false;
        });
    });

    // 开启当前场景的编辑状态
    scene.isEditing = true;
};

// 确认编辑场景描述
const confirmEditScene = (chapterIndex, sceneIndex) => {
    const scene = scriptList.value[chapterIndex].scene[sceneIndex];

    // 标记为正在生成音频
    scene.isAudioGenerating = true;

    ElMessageBox.confirm(
        '确定要保存修改吗？系统将重新生成音频。',
        '确认修改',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
        }
    ).then(() => {
        // 调用后端API重新生成音频
        regenerateAudio(chapterIndex, sceneIndex);
        scene.isEditing = false;
    }).catch(() => {
        // 取消修改，恢复编辑状态和音频生成状态
        scene.isEditing = false;
        scene.isAudioGenerating = false;
    });
};

// 重新生成音频
const regenerateAudio = async (chapterIndex, sceneIndex) => {
    const scene = scriptList.value[chapterIndex].scene[sceneIndex];

    try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 实际项目中这里会调用后端接口获取新的音频URL
        const newTtsUrl = `new_${scene.tts_url}`;
        scene.tts_url = newTtsUrl;

        ElMessage.success('音频已更新');
    } catch (error) {
        console.error('生成音频失败:', error);
        ElMessage.error('生成音频失败，请重试');
    } finally {
        // 无论成功失败，都结束加载状态
        scene.isAudioGenerating = false;
    }
};

// 确认删除场景
const confirmDeleteScene = (chapterIndex, sceneIndex) => {
    const scene = scriptList.value[chapterIndex].scene[sceneIndex];

    // 如果正在生成音频，不允许删除
    if (scene.isAudioGenerating) {
        ElMessage.warning('正在生成音频，暂时不能删除');
        return;
    }

    ElMessageBox.confirm(
        '确定要删除这个场景吗？此操作不可撤销。',
        '确认删除',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {
        deleteScene(chapterIndex, sceneIndex);
    }).catch(() => {
        // 取消删除
    });
};

// 删除场景
const deleteScene = (chapterIndex, sceneIndex) => {
    // 移除场景
    scriptList.value[chapterIndex].scene.splice(sceneIndex, 1);

    // 如果删除的是当前选中的场景
    if (selectedChapter.value === chapterIndex && selectedScene.value === sceneIndex) {
        // 如果当前章节还有其他场景
        if (scriptList.value[chapterIndex].scene.length > 0) {
            // 选中当前章节的第一个场景
            selectedScene.value = 0;
            playCurrentVideo();
        } else {
            // 当前章节已空，尝试选中前一个章节
            if (chapterIndex > 0) {
                selectedChapter.value = chapterIndex - 1;
                selectedScene.value = scriptList.value[chapterIndex - 1].scene.length - 1;
                playCurrentVideo();
            } else if (scriptList.value.length > 1) {
                // 选中下一个章节
                selectedChapter.value = 1;
                selectedScene.value = 0;
                playCurrentVideo();
            } else {
                // 没有场景了
                selectedChapter.value = -1;
                selectedScene.value = -1;
            }
        }
    } else if (selectedChapter.value === chapterIndex && selectedScene.value > sceneIndex) {
        // 如果删除的是当前选中场景之前的场景，调整索引
        selectedScene.value--;
    }

    ElMessage.success('场景已删除');
};

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
    if (videoRef.value && !currentScene.value?.isAudioGenerating) {
        videoRef.value.currentTime = time;
    }
};

const goToPreviousStep1 = () => {
    ElMessageBox.confirm('确定要返回上一步吗？已上传的文件将不会保存。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        ElMessage.success('正在返回模板匹配页面');
        workStep.value = 'template';
    }).catch(() => {
        // 取消操作
    });
};

const goFinish = () => {
    ElMessage.success('已完成');
    workStep.value = 'persona';
    active.value = 3;
};

// 打开视频替换弹窗
const openVideoReplaceDialog = (chapterIndex, sceneIndex) => {
    // 重置所有视频播放状态
    replacementVideos.value.forEach(video => {
        video.isPlaying = false;
    });

    currentReplaceChapterIndex.value = chapterIndex;
    currentReplaceSceneIndex.value = sceneIndex;
    selectedReplacementVideo.value = null;
    videoReplaceDialogVisible.value = true;
};

// 切换视频播放状态
const toggleVideoPlay = (video, event) => {
    // 停止事件冒泡，避免触发选择视频
    event.stopPropagation();

    // 暂停其他所有视频
    replacementVideos.value.forEach(v => {
        if (v !== video) {
            v.isPlaying = false;
        }
    });

    // 切换当前视频播放状态
    video.isPlaying = !video.isPlaying;

    // 找到对应的视频元素并控制播放/暂停
    nextTick(() => {
        const videoElements = document.querySelectorAll('.preview-video');
        videoElements.forEach(el => {
            if (el.src === video.url) {
                if (video.isPlaying) {
                    el.play().catch(err => {
                        console.error('播放失败:', err);
                        video.isPlaying = false;
                    });
                } else {
                    el.pause();
                }
            } else {
                el.pause();
            }
        });
    });
};

// 选择替换视频
const selectReplacementVideo = (video) => {
    // 暂停所有视频播放
    replacementVideos.value.forEach(v => {
        v.isPlaying = false;
        const videoElements = document.querySelectorAll('.preview-video');
        videoElements.forEach(el => {
            if (el.src === v.url) {
                el.pause();
            }
        });
    });

    // 如果点击的是已选中的视频，则取消选中
    if (selectedReplacementVideo.value === video) {
        selectedReplacementVideo.value = null;
    } else {
        selectedReplacementVideo.value = video;
    }
};

// 确认替换视频
const confirmReplaceVideo = () => {
    if (!selectedReplacementVideo.value) {
        ElMessage.warning('请选择要替换的视频');
        return;
    }

    if (currentReplaceChapterIndex.value === -1 || currentReplaceSceneIndex.value === -1) {
        return;
    }

    // 更新视频URL
    const scene = scriptList.value[currentReplaceChapterIndex.value].scene[currentReplaceSceneIndex.value];
    scene.video_url = selectedReplacementVideo.value.url;
    scene.thumbnail = null; // 清除旧缩略图

    // 重新生成缩略图
    nextTick(() => {
        const video = videoThumbnailRefs.value[currentReplaceChapterIndex.value + '-' + currentReplaceSceneIndex.value];
        if (video) {
            video.load();
            generateThumbnail(currentReplaceChapterIndex.value, currentReplaceSceneIndex.value);
        }
    });

    // 如果替换的是当前正在播放的视频，重新加载播放
    if (selectedChapter.value === currentReplaceChapterIndex.value &&
        selectedScene.value === currentReplaceSceneIndex.value) {
        playCurrentVideo();
    }

    videoReplaceDialogVisible.value = false;
    ElMessage.success('视频已替换');
};
</script>

<template>
    <div class="main-content">
        <div class="generate-step">
            <el-steps :active="active" class="steps" align-center finish-status="success">
                <el-tooltip content="AI 精准分析目标人群特征" placement="bottom" effect="light">
                    <el-step title="人群定位" />
                </el-tooltip>
                <el-tooltip content="智能推荐最佳营销模版" placement="bottom" effect="light">
                    <el-step title="模板匹配" />
                </el-tooltip>
                <el-tooltip content="一键生成专业营销视频" placement="bottom" effect="light">
                    <el-step title="视频生成" />
                </el-tooltip>
            </el-steps>
        </div>
        <div class="work-content">
            <div class="persona" v-show="workStep == 'persona'">

                <el-form :model="form" :class="{ 'shrink-persona-form': isPersonaSubmitted }" label-width="auto">
                    <h2 class="section-title">商品信息</h2>
                    <el-form-item label="商品名称" :label-position="right">
                        <el-input v-model="form.prod_name" />
                    </el-form-item>
                    <el-form-item label="售卖区域" :label-position="right">
                        <el-input v-model="form.region" />
                    </el-form-item>
                    <el-form-item label="商品核心卖点" :label-position="right">
                        <el-input-tag v-model="form.prod_tags" :max="6" :trigger="EVENT_CODE.space"
                            placeholder="请输入标签，按空格键添加，核心卖点总数不超过6个">
                            <template #suffix><el-button class="ai-generate-button" :icon="Operation"
                                    @click="generateSellingPoints" /></template>
                        </el-input-tag>
                        <div class="selling-points-container">
                            <el-checkbox-group v-if="generateTags.length" v-model="selectedTags" style="display: grid;">
                                <el-checkbox v-for="(option, index) in generateTags" :key="index" :label="option">
                                    {{ option }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit"><el-icon>
                                <DataAnalysis />
                            </el-icon>开始分析</el-button>
                    </el-form-item>
                </el-form>
                <div class="persona-res" v-if="isPersonaSubmitted">
                    <Transition name="res-fade">
                        <div class="recommendations-container">
                            <h2 class="section-title">AI Boss 推荐</h2>
                            <div class="stream-output-container">
                                <div class="stream-output" ref="streamOutputRef">
                                    <p v-if="streamContent === '' && !streamCompleted">正在分析中，请稍候...</p>
                                    <p v-else>{{ streamContent }}</p>
                                </div>
                            </div>
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
                    </Transition>
                </div>
            </div>
            <div class="template" v-show="workStep == 'template'">
                <div class="template-form" :class="{ 'shrink-template-form': isTemplateSubmitted }">
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
                                    @click="selectLanguage('portuguese')">
                                    <el-icon>
                                        <InfoFilled />
                                    </el-icon>
                                    <span>葡萄牙语</span>
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
                <div class="template-res" v-if="isTemplateSubmitted">
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
                                        <div class="template-name">{{ getPlatformName(selectedPlatform) }} 爆款模板</div>
                                        <div class="template-description">适用于产品展示和功能介绍</div>
                                    </div>
                                </div>

                                <!-- Template Sections -->
                                <div class="template-sections">
                                    <!-- Section 1 -->

                                    <el-card v-for="(section, index) in templateList" :key="index"
                                        class="template-section-item" shadow="hover">
                                        <div class="section-card">
                                            <div class="section-timing">
                                                <div class="timing-label">{{ section.timing }}</div>
                                                <div class="section-title">{{ section.title }}</div>
                                            </div>
                                            <div class="section-content">
                                                <div class="section-description">{{ section.description }}</div>
                                                <el-tag v-if="section.tag" class="section-tag" :type="section.tag.type">
                                                    <el-icon>
                                                        <component :is="section.tag.icon" />
                                                    </el-icon>
                                                    <span>{{ section.tag.text }}</span>
                                                </el-tag>
                                            </div>
                                        </div>
                                    </el-card>
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
            <div class="storyboard" v-show="workStep == 'storyboard'">
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
                                class="scene-item-wrapper" @click="selectAndPlayScene(chapterIndex, sceneIndex)"
                                :class="{ 'is-disabled': scene.isAudioGenerating }">
                                <el-card class="scene-item" :class="{
                                    'is-selected': selectedChapter === chapterIndex && selectedScene === sceneIndex,
                                    'is-loading': scene.isAudioGenerating
                                }" shadow="hover">
                                    <!-- 加载状态遮罩 -->
                                    <div class="loading-mask" v-if="scene.isAudioGenerating">
                                        <el-spinner size="40" />
                                        <div class="loading-text">正在生成音频...</div>
                                    </div>

                                    <div class="scene-content">
                                        <div class="scene-thumbnail">
                                            <el-image :src="scene.thumbnail || defaultThumbnail" fit="cover"
                                                class="thumbnail-image" v-if="scene.thumbnail" />
                                            <video ref="videoThumbnailRefs[chapterIndex + '-' + sceneIndex]"
                                                :src="scene.video_url" class="thumbnail-video"
                                                @loadeddata="generateThumbnail(chapterIndex, sceneIndex)"
                                                style="display: none;" />
                                            <el-button class="replace-button" size="small"
                                                @click.stop="openVideoReplaceDialog(chapterIndex, sceneIndex)"
                                                :disabled="scene.isAudioGenerating">
                                                替换
                                            </el-button>
                                        </div>
                                        <div class="scene-details">
                                            <div class="scene-header">
                                                <div class="scene-title">{{ scene.scene_subtitle }}</div>
                                                <div class="scene-duration">{{ scene.duration || '00:00' }}</div>
                                            </div>
                                            <div class="scene-description-container">
                                                <el-input v-model="scene.scene_screen_desc" type="textarea" :rows="2"
                                                    resize="none" placeholder="编辑场景字幕" class="scene-description"
                                                    :disabled="!scene.isEditing || scene.isAudioGenerating" />
                                                <el-button v-if="scene.isEditing && !scene.isAudioGenerating"
                                                    class="confirm-edit-button" size="small" type="primary"
                                                    @click.stop="confirmEditScene(chapterIndex, sceneIndex)">
                                                    完成
                                                </el-button>
                                            </div>
                                        </div>
                                    </div>
                                </el-card>
                                <div class="scene-actions">
                                    <el-button circle class="action-button" :disabled="scene.isAudioGenerating">
                                        <el-icon>
                                            <Rank />
                                        </el-icon>
                                    </el-button>
                                    <el-button circle class="action-button"
                                        @click.stop="toggleEditScene(chapterIndex, sceneIndex)"
                                        :disabled="scene.isAudioGenerating">
                                        <el-icon>
                                            <Edit />
                                        </el-icon>
                                    </el-button>
                                    <el-button circle class="action-button"
                                        @click.stop="confirmDeleteScene(chapterIndex, sceneIndex)"
                                        :disabled="scene.isAudioGenerating">
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
                            <el-button :type="activeTab === 'scene' ? 'primary' : ''" @click="activeTab = 'scene'"
                                :disabled="currentScene?.isAudioGenerating">分镜</el-button>
                            <el-button :type="activeTab === 'settings' ? 'primary' : ''" @click="activeTab = 'settings'"
                                :disabled="currentScene?.isAudioGenerating">设置</el-button>
                        </div>
                        <div class="preview-quality">预览：480P</div>
                    </div>

                    <!-- Video Preview -->
                    <div class="video-preview-container">
                        <video ref="videoRef" :src="currentScene?.video_url" controls class="video-preview"
                            @loadeddata="handleVideoLoaded" @timeupdate="handleTimeUpdate" @ended="handleVideoEnded"
                            :disabled="currentScene?.isAudioGenerating"
                            :class="{ 'video-disabled': currentScene?.isAudioGenerating }">
                            您的浏览器不支持视频播放
                        </video>
                        <div class="video-subtitle-overlay" v-if="currentScene">
                            <p>{{ currentScene.scene_screen_desc }}</p>
                        </div>
                    </div>

                    <!-- Video Controls -->
                    <div class="video-controls">
                        <div class="playback-controls">
                            <el-button circle class="control-button" @click="videoRef?.play()"
                                :disabled="currentScene?.isAudioGenerating">
                                <el-icon>
                                    <VideoPlay />
                                </el-icon>
                            </el-button>
                            <el-button circle class="control-button" @click="videoRef?.pause()"
                                :disabled="currentScene?.isAudioGenerating">
                                <el-icon>
                                    <VideoPause />
                                </el-icon>
                            </el-button>
                            <span class="time-display" v-if="videoDuration">
                                {{ formatTime(currentTime) }} / {{ formatTime(videoDuration) }}
                            </span>
                        </div>
                        <div class="feedback-controls">
                            <el-button circle class="control-button" :disabled="currentScene?.isAudioGenerating">
                                <el-icon>
                                    <Star />
                                </el-icon>
                            </el-button>
                            <el-button circle class="control-button" :disabled="currentScene?.isAudioGenerating">
                                <el-icon>
                                    <StarFilled />
                                </el-icon>
                            </el-button>
                        </div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="progress-container" v-if="videoDuration">
                        <el-slider v-model="currentTime" :max="videoDuration" @change="handleTimeChange"
                            class="video-progress" :disabled="currentScene?.isAudioGenerating" />
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

            <!-- 视频替换弹窗 -->
            <el-dialog v-model="videoReplaceDialogVisible" title="替换视频素材" width="900px">
                <div class="video-select-container">
                    <div class="video-item" v-for="(video, index) in replacementVideos" :key="index"
                        @click="selectReplacementVideo(video)"
                        :class="{ 'selected': selectedReplacementVideo === video }">
                        <div class="video-wrapper">
                            <video :src="video.url" class="preview-video" controls :poster="video.thumbnail" />
                            <div class="play-overlay" v-if="!video.isPlaying">
                                <el-button icon="VideoPlay" circle size="large"
                                    @click.stop="toggleVideoPlay(video, $event)" />
                            </div>
                        </div>
                        <div class="video-info">
                            <div class="video-resolution">{{ video.resolution }}</div>
                            <div class="video-duration">{{ video.duration }}</div>
                        </div>
                        <div class="select-button-container">
                            <el-button type="primary" size="small" @click.stop="selectReplacementVideo(video)"
                                :icon="selectedReplacementVideo === video ? 'Check' : 'Plus'">
                                {{ selectedReplacementVideo === video ? '已选中' : '选中' }}
                            </el-button>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <el-button @click="videoReplaceDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="confirmReplaceVideo" :disabled="!selectedReplacementVideo">
                        确认替换
                    </el-button>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<style scoped lang="scss">
.main-content {
    padding: 0px, 20px, 20px, 20px;
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
    flex-direction: column;

    .persona {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 2rem;
        transition: all 0.5s ease;
        width: 100%;

        .el-form {
            width: 70%;
            margin: 2rem;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            transition: all 0.5s ease-in-out;

            &.shrink-persona-form {
                width: 43%;
                margin: 0;
                margin-right: 2rem;
            }

        }

        .persona-res {
            flex: 1;

            .stream-output-container {
                flex: 1;
                margin: 10px 0;
                overflow: hidden;
            }

            .stream-output {
                height: 100%;
                overflow-y: auto;
                padding: 15px;
                background-color: #f9f9f9;
                border-radius: 4px;
                line-height: 1.8;
                font-size: 14px;
                white-space: pre-wrap;
            }

            /* Recommendations section */
            .recommendations-container {
                width: 90%;
                background-color: #ffffff;
                margin: 0 2rem;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
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
        }

        /* 淡入效果 */
        .res-fade-enter-active,
        .res-fade-leave-active {
            transition: opacity 0.5s ease;
        }

        .res-fade-enter-from,
        .res-fade-leave-to {
            opacity: 0;
        }

    }

    .template {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 2rem;
        transition: all 0.5s ease;
        width: 100%;

        .template-form {
            width: 70%;
            margin: 2rem;
            padding: 2rem;
            border-radius: 8px;
            transition: all 0.5s ease-in-out;

            &.shrink-template-form {
                width: 47%;
                margin: 0;
                margin-right: 2rem;
            }

            .settings-card {
                height: 100%;


                :deep(.el-card__body) {
                    padding: 0;
                    border-radius: 8px;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
                }


            }

            .settings-section {
                padding: 1.5rem;
                border-bottom: 1px solid #e5e7eb;

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
                border: 2px solid #e5e7eb;
                color: #4b5563;
                transition: all 0.3s ease;
                border-radius: 4px;

                &:hover {
                    border-color: #d1d5db;
                }

                &.active {
                    border-color: #1677FF;
                    background-color: rgba(#1677FF, 0.05);
                    color: #1677FF;
                }

                :deep(.el-icon) {
                    margin-right: 0.25rem;
                }
            }

            .upload-container {
                border: 2px dashed #e5e7eb;
                border-radius: 0.75rem;
                padding: 2rem;
                text-align: center;
                margin-bottom: 1.5rem;

                &:hover {
                    border-color: #1677FF;
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
                color: #1677FF;
                background-color: rgba(#1677FF, 0.05);
                width: 3rem;
                height: 3rem;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1rem;
            }

            .upload-text {
                color: #4b5563;
                margin-bottom: 0.5rem;
            }

            .upload-hint {
                color: #9ca3af;
                font-size: 0.875rem;
            }

            .upload-file-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.5rem;

                .file-icon {
                    color: #1677FF;
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
        }

        .template-res {
            flex: 1;

            // Template section
            .template-section {
                flex: 1;
                margin: 0 2rem;
                padding: 2rem;
            }

            .template-card {
                cursor: pointer;
                margin-bottom: 0 !important;

                &.is-selected {
                    :deep(.el-card__body) {
                        border: 1px solid #2563eb;
                        border-radius: 0.5rem;
                    }
                }
            }

            .recommended-template {
                border: 2px solid rgba(#ef4444, 0.3);
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
                background-color: #fef2f2;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .template-platform-icon {
                font-size: 1.5rem;
                color: #ef4444;
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
                color: #6b7280;
            }

            .template-sections {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .template-section-item {
                display: flex;
                gap: 1rem;

                :deep(.el-card__body) {
                    width: 100%;
                }
            }

            .section-card {
                display: flex;
                width: 100%;
            }

            .section-timing {
                width: 10rem;
                flex-shrink: 0;
            }

            .timing-label {
                font-size: 0.875rem;
                color: #6b7280;
            }

            .section-content {
                flex: 1;
                background-color: #f9fafb;
                border-radius: 0.5rem;
                padding: 1rem;
            }

            .section-description {
                color: #4b5563;
                margin-bottom: 0.5rem;
            }

            .section-tag {
                display: inline-flex;
                align-items: center;
                gap: 0.25rem;
                font-size: 0.75rem;

                :deep(.el-tag__content) {
                    margin-right: 0.25rem;
                    display: contents;
                    align-items: center;
                }

                :deep(.el-icon) {
                    margin-right: 0.25rem;
                    align-items: center;
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
        }
    }


    .storyboard {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 2rem;
        transition: all 0.5s ease;
        width: 100%;

        .storyboard-form {
            width: 47%;
            margin: 2rem;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

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
                border-left: 3px solid #e5e7eb;
                margin-left: 10px;
            }

            .chapter-name {
                font-size: 1.5rem;
                font-weight: 600;
                color: #2563eb;
                margin-left: 0.5rem;
                padding-top: 5px;
            }

            .scene-item-wrapper {
                position: relative;
                margin-bottom: 2.5rem;

                &:hover {
                    .scene-actions {
                        display: flex;
                    }
                }

                &.is-disabled {
                    cursor: not-allowed;
                    opacity: 0.8;
                }
            }

            .scene-item {
                transition: all 0.3s ease;
                cursor: pointer;
                overflow: visible;
                position: relative;

                &.is-selected {
                    background-color: #EEF4FF;
                    border: 1px solid #246BFD;
                }

                &.is-loading {
                    position: relative;
                }

                &:hover {
                    background-color: #f3f4f6;
                }

                :deep(.el-card__body) {
                    padding: 1.5rem;
                }
            }

            .loading-mask {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(255, 255, 255, 0.8);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 10;
            }

            .loading-text {
                margin-top: 1rem;
                color: #6b7280;
            }

            .scene-content {
                display: flex;
                gap: 1rem;
            }

            .scene-thumbnail {
                position: relative;
                width: 8rem;
                height: 8rem;
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
                z-index: 5;
            }

            .scene-details {
                flex: 1;
                min-height: 8rem;
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
                font-size: 1.25rem;
                font-weight: 500;
            }

            .scene-duration {
                font-size: 0.875rem;
                color: #6b7280;
            }

            .scene-description-container {
                flex: 1;
                display: flex;
                gap: 0.5rem;
                align-items: flex-start;
            }

            .scene-description {
                flex: 1;

                :deep(.el-textarea__inner) {
                    height: 100%;
                    font-size: 1.125rem;
                    resize: none;
                }
            }

            .confirm-edit-button {
                margin-top: 0.5rem;
                align-self: flex-start;
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
        }

        .storyboard-res {
            flex: 1;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            margin-top: 2rem;
            padding: 2rem;

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
                width: 500px;
                margin: 0 auto 1rem;
                border-radius: 0.5rem;
                overflow: hidden;
            }

            .video-preview {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .video-disabled {
                filter: grayscale(50%);
            }

            .video-subtitle-overlay {
                position: absolute;
                bottom: 50px;
                left: 0;
                right: 0;
                padding: 0 20px;
                text-align: center;
                color: white;
                font-size: 1.125rem;
                text-shadow: 0 0 3px rgba(0, 0, 0, 0.7);
                -webkit-text-stroke: 0.5px #000000;
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
        }
    }

}

// 视频替换弹窗样式
.video-select-container {
    max-height: 500px;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding: 0.5rem;
}

.video-item {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;

    &:hover {
        border-color: #1677FF;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    &.selected {
        border-color: #1677FF;
        background-color: rgba(22, 119, 255, 0.05);
    }
}

.video-wrapper {
    position: relative;
    width: 100%;
    height: 200px;
    margin-bottom: 1rem;
    border-radius: 0.375rem;
    overflow: hidden;
    background-color: #f5f5f5;
}

.preview-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.375rem;
}

.play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    transition: opacity 0.3s ease;

    :deep(.el-button) {
        background-color: white;
        color: #1677FF;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.video-item:hover .play-overlay {
    opacity: 1;
}

.video-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1rem;
}

.select-button-container {
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
}

.select-button-container :deep(.el-button) {
    min-width: 100px;
}

// Font Awesome icons
.fab,
.fas {
    font-family: 'Font Awesome 6 Free', sans-serif;
}
</style>