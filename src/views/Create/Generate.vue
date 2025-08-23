<script setup>
// import { storeToRefs } from 'pinia';
import {
  User, DataAnalysis, Star, ShoppingCart, Upload, Search, Operation, ArrowLeft, ArrowRight,
  InfoFilled, ChatDotRound, Picture, Platform, Plus, Rank, Edit, Delete, VideoPlay, StarFilled, VideoPause
} from '@element-plus/icons-vue'
import { onMounted, ref, reactive, computed, nextTick } from 'vue'
import { EVENT_CODE, ElMessage, ElMessageBox } from 'element-plus'
import { genProdTags, genTargetConsr, genScripts, genRecScripts, exportVideo, genTts } from '@/api/generate.js'

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
const templateResData = ref([])
const streamContent1 = ref('')
const streamCompleted1 = ref(false)
const streamOutputRef1 = ref(null);

const scriptDemo = ref([])
// 分镜相关状态
const scriptList = ref([]);
const selectedChapter = ref(-1);
const selectedScene = ref(-1);
const videoRef = ref(null);
const audioRef = ref(null);
const defaultThumbnail = ref('https://ai-public.mastergo.com/ai/img_res/default-thumbnail.jpg');
const currentTime = ref(0);
const videoDuration = ref(0);
const activeTab = ref('scene');
const isAutoPlaying = ref(false);

// 音频资源列表
const audioUrls = [
  "https://er-sycdn.kuwo.cn/424a38b85af293a5e95b77806fa470a5/68a8959a/resource/30106/trackmedia/M800003aAYrm3GE0Ac.mp3",
  "https://lv-sycdn.kuwo.cn/acedaa6e82729d1f9fe63a9bb17a23c0/68a895b6/resource/30106/trackmedia/M800001tr7t43Ry7GG.mp3",
  "https://er-sycdn.kuwo.cn/793134577607842d606aeef3dae22da0/68a895d0/resource/30106/trackmedia/M800001ixp014Kmo7p.mp3",
  "https://lv-sycdn.kuwo.cn/4bce284fc098b33d2931c810bbf77fd6/68a895ea/resource/30106/trackmedia/M800004O1DHG4MjYOi.mp3",
  "https://lw-sycdn.kuwo.cn/6c213d0711cc74f7efd6c1747ddc2452/68a895fd/resource/30106/trackmedia/M800000BvHDl2Xz6GF.mp3"
];

// 视频替换相关状态
const videoReplaceDialogVisible = ref(false);
const syncLock = ref(false); // 用于防止同步时的循环触发
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
  prod_imgs: [],
  target_consumer: "",
  script_template: "",
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
    const lastChar = streamContent.value.slice(-1);
    const newChar = data.data.slice(-1);

    if (lastChar !== newChar || data.data.length > 1) {
      streamContent.value += data.data;
      scrollToBottom();
    }
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
    nextTick(() => {
      // 可选：打印日志确认
      console.log('初始化选中:', selectedAudience.value);
    });
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
  console.log('selectedAudience', selectedAudience.value)
};

const goToNextStep = () => {
  // Navigate to the next step (template matching)
  ElMessage.success(`已选择 "${selectedAudience.value.title}" 作为目标人群，即将进入模版匹配环节`);
  // In a real app, this would navigate to the next page or update the current step
  form.target_consumer = selectedAudience.value.title
  console.log(form)
  workStep.value = 'template'
  active.value = 1
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
  // // Check file type
  // const isVideo = file.raw.type === 'video/mp4' || file.raw.type === 'video/quicktime';

  // // Check file size (less than 100MB)
  // const isLt100M = file.raw.size / 1024 / 1024 < 100;

  // if (!isVideo) {
  //   ElMessage.error('只能上传 MP4/MOV 格式的视频!');
  //   return false;
  // }

  // if (!isLt100M) {
  //   ElMessage.error('视频大小不能超过 100MB!');
  //   return false;
  // }

  console.log(file, fileList.value)

  return true;
};

// Handle exceed maximum file count
const handleExceed = () => {
  ElMessage.warning('最多只能上传 3 段视频');
};

// Handle file removal
const handleRemove = (file) => {
  fileList.value = fileList.value.filter(item => item.uid !== file.uid);
  console.log(fileList, file)
};

// Start analysis
const startAnalysis = () => {
  // if (fileList.value.length === 0) {
  //   ElMessage.warning('请先上传视频素材');
  //   return;
  // }

  ElMessage.success('正在分析视频素材...');

  // In a real app, this would trigger an API call to analyze the videos

  console.log(form)
  ElMessage.success('正在分析商品信息...');

  // 重置流式输出结果
  streamContent1.value = ''
  streamCompleted1.value = false
  templateResData.value = []

  // 提交请求并处理流式响应
  cancelRequest.value = genRecScripts(
    { ...form },
    handleStreamMessage1,
    handleStreamComplete1,
    handleStreamError1
  );

  // 标记为已提交，显示右侧区域
  isTemplateSubmitted.value = true
};

const handleStreamMessage1 = (data) => {
  console.log('前端收到的数据:', data); // 关键日志：确认数据是否到达这里

  if (!data || typeof data !== 'object') {
    console.warn('无效数据格式:', data);
    return;
  }

  // 处理流式内容
  if (data.type === 'content' && typeof data.data === 'string') {
    // const text = data.data;
    // let currentPos = 0;

    // const typeWriter = () => {
    //   if (currentPos < text.length) {
    //     streamContent1.value += text.charAt(currentPos);
    //     currentPos++;
    //     setTimeout(typeWriter, 1000);
    //   } else {
    //     scrollToBottom1();
    //   }
    // };

    // typeWriter();

    // 避免重复添加相同内容（通过最后一个字符判断）
    const lastChar = streamContent1.value.slice(-1);
    const newChar = data.data.slice(-1);

    if (lastChar !== newChar || data.data.length > 1) {
      streamContent1.value += data.data;
      scrollToBottom1();
    }
  }

  // 处理最终结果
  if (data.type === 'result') {

    // resultData.value = data.data;
    templateResData.value = data.data
    console.log(templateResData.value)
  }
};


// 处理流结束
const handleStreamComplete1 = () => {
  streamCompleted1.value = true;
  ElMessage.success('分析完成');
  scrollToBottom1();
};

// 处理流错误
const handleStreamError1 = (error) => {
  console.error('流式请求错误:', error);
  ElMessage.error(`分析失败: ${error.message}`);
  isSubmitting.value = false;
};

// 滚动到底部
const scrollToBottom1 = () => {
  nextTick(() => {
    if (streamOutputRef1.value) {
      streamOutputRef1.value.scrollTop = streamOutputRef1.value.scrollHeight;
    }
  });
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

    let audioIndex = 0
    const scenes = [
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
            tts_url: audioUrls[audioIndex++ % audioUrls.length],

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
            tts_url: audioUrls[audioIndex++ % audioUrls.length],

          },
          {
            scene_id: "chapter_Real_Life_Scenario_scene_2",
            scene_screen_desc: "Split screen showing before: Sarah's kitchen with lingering smoke and grease stains everywhere vs after: clean, smoke-free kitchen",
            scene_screen_short_desc: "before after kitchen comparison",
            scene_subtitle: "Here's how Sarah transformed her cooking experience completely.",
            use_product_self_footage: false,
            video_url: "https://videos.pexels.com/video-files/32950328/14043633_1440_2560_60fps.mp4",
            tts_url: audioUrls[audioIndex++ % audioUrls.length],

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
            tts_url: audioUrls[audioIndex++ % audioUrls.length],
          },
          {
            scene_id: "chapter_Real_Life_Scenario_scene_2",
            scene_screen_desc: "Split screen showing before: Sarah's kitchen with lingering smoke and grease stains everywhere vs after: clean, smoke-free kitchen",
            scene_screen_short_desc: "before after kitchen comparison",
            scene_subtitle: "Here's how Sarah transformed her cooking experience completely.",
            use_product_self_footage: false,
            video_url: "https://videos.pexels.com/video-files/33420618/14224991_1080_1920_50fps.mp4",
            tts_url: audioUrls[audioIndex++ % audioUrls.length],
          }
        ]
      }
    ]

    scriptList.value = scenes.map(chapter => ({
      ...chapter,
      scene: chapter.scene.map(scene => ({
        ...scene,
        isEditing: false,
        isAudioGenerating: false,
        audioDuration: 0,
        duration: '00:00',
        thumbnail: null
      }))
    }));

    form.script_list = scriptList.value
    console.log(form)
    console.log("scriptlist", scriptList.value)
    // 更新状态
    workStep.value = 'storyboard';
    active.value = 2;

    // 为每个场景生成缩略图和获取时长
    scenes.forEach((chapter, chapterIndex) => {
      chapter.scene.forEach((scene, sceneIndex) => {
        // 生成缩略图
        generateThumbnail(scene.video_url).then(thumbnail => {
          scriptList.value[chapterIndex].scene[sceneIndex].thumbnail = thumbnail;
        });

        // 获取视频时长
        getVideoDuration(scene.video_url).then(duration => {
          scriptList.value[chapterIndex].scene[sceneIndex].duration = formatTime(duration);
        });

        // 获取音频时长
        getAudioDuration(scene.tts_url).then(duration => {
          scriptList.value[chapterIndex].scene[sceneIndex].audioDuration = duration;
        });
      });
    });

    // 自动播放第一个场景
    if (scriptList.value.length > 0 && scriptList.value[0].scene.length > 0) {
      nextTick(() => {
        if (scriptList.value.length > 0 && scriptList.value[0].scene.length > 0) {
          selectedChapter.value = 0;
          selectedScene.value = 0;
          isAutoPlaying.value = true; // 开启自动连播
          playCurrentVideo(); // 启动首帧播放
        }
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

// 生成视频缩略图（不加载DOM中的video元素）
const generateThumbnail = (videoUrl) => {
  return new Promise((resolve) => {
    // 创建一个不在DOM中的视频元素
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.src = videoUrl;
    video.preload = 'metadata';

    // 视频元数据加载完成后
    video.onloadedmetadata = () => {
      // 跳到第一帧
      video.currentTime = 0.1; // 稍微过一点0秒，确保有画面

      video.onseeked = () => {
        // 创建canvas绘制第一帧
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 240;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 转换为图片URL
        const thumbnail = canvas.toDataURL('image/jpeg');
        resolve(thumbnail);

        // 清理资源
        video.remove();
      };

      video.onerror = () => {
        resolve(defaultThumbnail.value);
        video.remove();
      };
    };

    video.onerror = () => {
      resolve(defaultThumbnail.value);
      video.remove();
    };
  });
};

// 获取视频时长
const getVideoDuration = (videoUrl) => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.src = videoUrl;
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      const duration = video.duration || 0;
      resolve(duration);
      video.remove();
    };

    video.onerror = () => {
      resolve(0);
      video.remove();
    };
  });
};

// 获取音频时长
const getAudioDuration = (audioUrl) => {
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };
    audio.onerror = () => {
      resolve(0);
    };
  });
};

// 选择并播放场景
const selectAndPlayScene = (chapterIndex, sceneIndex) => {
  const scene = scriptList.value[chapterIndex].scene[sceneIndex];
  // 正在生成音频或编辑中，不允许切换
  if (scene.isAudioGenerating || scene.isEditing) {
    return;
  }

  selectedChapter.value = chapterIndex;
  selectedScene.value = sceneIndex;
  isAutoPlaying.value = false;
  playCurrentVideo();
};

// 播放当前视频
const playCurrentVideo = async () => {
  // 先暂停当前媒体
  if (videoRef.value) videoRef.value.pause();
  if (audioRef.value) audioRef.value.pause();

  nextTick(async () => {
    if (videoRef.value && audioRef.value && currentScene.value && !currentScene.value.isAudioGenerating && !currentScene.value.isEditing) {
      try {
        // 加载视频
        videoRef.value.src = currentScene.value.video_url;
        await videoRef.value.load();

        // 加载音频
        audioRef.value.src = currentScene.value.tts_url;
        await audioRef.value.load();

        // 播放视频和音频
        await Promise.all([
          videoRef.value.play(),
          audioRef.value.play()
        ]);

        // 确保两者时间同步
        syncMediaTime();

        // 处理视频时长小于音频时长的情况
        // handleVideoAudioDurationMatch();
      } catch (err) {
        console.error("自动播放失败:", err);
        ElMessage.warning('浏览器阻止了自动播放，请手动点击播放');
      }
    }
  });
};

// 同步播放媒体（视频+音频）
const playSyncMedia = async () => {
  if (videoRef.value && audioRef.value && currentScene.value && !currentScene.value.isAudioGenerating && !currentScene.value.isEditing) {
    try {
      if (videoRef.value.paused || audioRef.value.paused) {
        // 确保两者状态一致
        if (videoRef.value.paused !== audioRef.value.paused) {
          syncMediaState();
        }

        await Promise.all([
          videoRef.value.play(),
          audioRef.value.play()
        ]);

        // 同步时间
        syncMediaTime();
        // handleVideoAudioDurationMatch();
      }
    } catch (err) {
      console.error("播放失败:", err);
      ElMessage.warning('播放失败，请重试');
    }
  }
};

// 同步暂停媒体（视频+音频）
const pauseSyncMedia = () => {
  if (videoRef.value && audioRef.value) {
    if (!videoRef.value.paused) videoRef.value.pause();
    if (!audioRef.value.paused) audioRef.value.pause();
  }
};

// 同步媒体时间
const syncMediaTime = () => {
  if (!videoRef.value || !audioRef.value) return;

  // 以视频时间为准同步音频
  const targetTime = videoRef.value.currentTime;
  if (Math.abs(audioRef.value.currentTime - targetTime) > 0.1) {
    syncLock.value = true;
    audioRef.value.currentTime = targetTime;
    currentTime.value = targetTime;
    setTimeout(() => syncLock.value = false, 100);
  }
};

// 同步媒体状态
const syncMediaState = () => {
  if (!videoRef.value || !audioRef.value) return;

  // 如果一个在播放，一个在暂停，统一状态为暂停
  if (videoRef.value.paused !== audioRef.value.paused) {
    videoRef.value.pause();
    audioRef.value.pause();
  }
};

// 处理媒体暂停事件
const handleMediaPause = () => {
  if (!syncLock.value && videoRef.value && audioRef.value) {
    // 如果一个暂停，另一个也暂停
    if (videoRef.value.paused && !audioRef.value.paused) {
      syncLock.value = true;
      audioRef.value.pause();
      setTimeout(() => syncLock.value = false, 100);
    } else if (!videoRef.value.paused && audioRef.value.paused) {
      syncLock.value = true;
      videoRef.value.pause();
      setTimeout(() => syncLock.value = false, 100);
    }
  }
};

// 处理媒体播放事件
const handleMediaPlay = () => {
  if (!syncLock.value && videoRef.value && audioRef.value) {
    // 如果一个播放，另一个也播放并同步时间
    if (!videoRef.value.paused && audioRef.value.paused) {
      syncLock.value = true;
      audioRef.value.currentTime = videoRef.value.currentTime;
      audioRef.value.play().catch(() => {
        videoRef.value.pause();
        syncLock.value = false;
      });
      setTimeout(() => syncLock.value = false, 100);
    } else if (videoRef.value.paused && !audioRef.value.paused) {
      syncLock.value = true;
      videoRef.value.currentTime = audioRef.value.currentTime;
      videoRef.value.play().catch(() => {
        audioRef.value.pause();
        syncLock.value = false;
      });
      setTimeout(() => syncLock.value = false, 100);
    }
  }
};

// 处理视频与音频时长匹配
// const handleVideoAudioDurationMatch = () => {
//     if (!videoRef.value || !audioRef.value || !currentScene.value) return;

//     const videoDur = videoRef.value.duration;
//     const audioDur = audioRef.value.duration;

//     // 视频时长小于音频时长：视频结束后保持最后一帧
//     if (videoDur < audioDur) {
//         videoRef.value.addEventListener('ended', () => {
//             videoRef.value.pause();
//             // 保持最后一帧
//             videoRef.value.currentTime = videoDur;
//         }, { once: true });
//     }
//     // 音频时长小于视频时长：音频结束后暂停视频
//     else if (audioDur < videoDur) {
//         audioRef.value.addEventListener('ended', () => {
//             videoRef.value.pause();
//             videoRef.value.currentTime = audioDur;
//         }, { once: true });
//     }
// };

// 处理视频播放结束
const handleVideoEnded = () => {
  if (!isAutoPlaying.value || !currentScene.value || currentScene.value.isAudioGenerating || currentScene.value.isEditing) return;

  // // 音频未结束时不切换场景
  // if (audioRef.value && !audioRef.value.ended) return;
  // 停止当前音频（避免音频继续播放）
  if (audioRef.value) audioRef.value.pause();

  // 查找下一个场景
  let nextChapter = selectedChapter.value;
  let nextScene = selectedScene.value + 1;

  // 检查当前章节是否有下一个场景
  if (nextScene < scriptList.value[nextChapter].scene.length) {
    selectedScene.value = nextScene;
    // 等待DOM更新后再播放，确保视频元素已绑定新URL
    nextTick(() => playCurrentVideo());
  } else {
    nextChapter++;
    if (nextChapter < scriptList.value.length && scriptList.value[nextChapter].scene.length > 0) {
      selectedChapter.value = nextChapter;
      selectedScene.value = 0;
      nextTick(() => playCurrentVideo());
    } else {
      // 回到第一个场景
      selectedChapter.value = 0;
      selectedScene.value = 0;
      isAutoPlaying.value = false;
      resetMedia();
    }
  }
};

// 处理音频播放结束
const handleAudioEnded = () => {
  // if (videoRef.value && !videoRef.value.ended) {
  //     videoRef.value.pause();
  //     videoRef.value.currentTime = audioRef.value.duration;
  // }
  // if (audioRef.value) {
  //     audioRef.value.pause();
  // }

  // if (isAutoPlaying.value) {
  //     handleVideoEnded();
  // }
  // 音频结束时仅暂停，不触发场景切换（避免音频先结束导致跳帧）
  if (audioRef.value) {
    audioRef.value.pause();
    audioRef.value.currentTime = 0;
  }
};

// 重置媒体状态
const resetMedia = () => {
  if (videoRef.value) {
    videoRef.value.currentTime = 0;
    videoRef.value.pause();
  }
  if (audioRef.value) {
    audioRef.value.currentTime = 0;
    audioRef.value.pause();
  }
  currentTime.value = 0;
};

// 切换场景编辑状态
const toggleEditScene = (chapterIndex, sceneIndex) => {
  const scene = scriptList.value[chapterIndex].scene[sceneIndex];

  // 正在生成音频，不允许编辑
  if (scene.isAudioGenerating) {
    ElMessage.warning('正在生成音频，暂时无法编辑');
    return;
  }

  // 取消编辑
  if (scene.isEditing) {
    scene.isEditing = false;
    return;
  }

  // 暂停当前媒体
  resetMedia();

  // 关闭其他场景的编辑状态
  scriptList.value.forEach(chap => {
    chap.scene.forEach(sc => {
      sc.isEditing = false;
    });
  });

  // 开启当前场景编辑
  scene.isEditing = true;
};

// 确认编辑场景描述
const confirmEditScene = (chapterIndex, sceneIndex) => {
  const scene = scriptList.value[chapterIndex].scene[sceneIndex];

  // 标记为正在生成音频
  scene.isAudioGenerating = true;
  // 暂停媒体
  resetMedia();

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
    // 取消修改
    scene.isEditing = false;
    scene.isAudioGenerating = false;
  });
};

// 重新生成音频
const regenerateAudio = async (chapterIndex, sceneIndex) => {
  const scene = scriptList.value[chapterIndex].scene[sceneIndex];

  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    genTts({
      "scene_subtitle": "Hello world"
    }).then(res => {
      // scene.tts_url = res.data.data.tts_url
      console.log(res.data.data.tts_url)
    })

    // 1. 替换音频资源
    const newAudioUrl = audioUrls[Math.floor(Math.random() * audioUrls.length)];
    scene.tts_url = newAudioUrl;

    // 2. 获取新音频时长
    const newAudioDur = await getAudioDuration(newAudioUrl);
    scene.audioDuration = newAudioDur;

    ElMessage.success('音频已更新，视频时长已同步');

    // 3. 如果是当前选中场景，重新播放
    if (selectedChapter.value === chapterIndex && selectedScene.value === sceneIndex) {
      playCurrentVideo();
    }
  } catch (error) {
    console.error('生成音频失败:', error);
    ElMessage.error('生成音频失败，请重试');
  } finally {
    scene.isAudioGenerating = false;
  }
};

// 确认删除场景
const confirmDeleteScene = (chapterIndex, sceneIndex) => {
  const scene = scriptList.value[chapterIndex].scene[sceneIndex];

  // 正在生成音频或编辑中，不允许删除
  if (scene.isAudioGenerating || scene.isEditing) {
    ElMessage.warning('当前场景正在处理中，暂时不能删除');
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
  });
};

// 删除场景
const deleteScene = (chapterIndex, sceneIndex) => {
  const chapter = scriptList.value[chapterIndex];
  const isCurrentScene = selectedChapter.value === chapterIndex && selectedScene.value === sceneIndex;

  // 移除场景
  chapter.scene.splice(sceneIndex, 1);

  // 如果章节下没有场景了，删除整个章节
  if (chapter.scene.length === 0) {
    scriptList.value.splice(chapterIndex, 1);

    // 处理选中状态
    if (isCurrentScene || selectedChapter.value === chapterIndex) {
      if (scriptList.value.length > 0) {
        // 选择第一个章节的第一个场景
        selectedChapter.value = 0;
        selectedScene.value = 0;
        playCurrentVideo();
      } else {
        // 没有章节了
        selectedChapter.value = -1;
        selectedScene.value = -1;
        resetMedia();
      }
    } else if (selectedChapter.value > chapterIndex) {
      // 如果选中的章节在被删除章节之后，索引减1
      selectedChapter.value--;
    }
  } else {
    // 章节还有其他场景
    if (isCurrentScene) {
      // 如果删除的是当前选中的场景
      if (sceneIndex < chapter.scene.length) {
        // 选择同章节的下一个场景
        selectedScene.value = sceneIndex;
        playCurrentVideo();
      } else {
        // 选择同章节的最后一个场景
        selectedScene.value = chapter.scene.length - 1;
        playCurrentVideo();
      }
    } else if (selectedChapter.value === chapterIndex && selectedScene.value > sceneIndex) {
      // 如果选中的场景在被删除场景之后，索引减1
      selectedScene.value--;
    }
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
  if (!syncLock.value && videoRef.value) {
    currentTime.value = videoRef.value.currentTime;
    // 同步音频进度（如果差异较大）
    if (audioRef.value && Math.abs(audioRef.value.currentTime - videoRef.value.currentTime) > 0.2) {
      syncLock.value = true;
      audioRef.value.currentTime = videoRef.value.currentTime;
      setTimeout(() => syncLock.value = false, 100);
    }
  }
};

const handleTimeChange = (time) => {
  if (videoRef.value && audioRef.value && currentScene.value && !currentScene.value.isAudioGenerating && !currentScene.value.isEditing) {
    syncLock.value = true;
    videoRef.value.currentTime = time;
    audioRef.value.currentTime = time;
    currentTime.value = time;
    setTimeout(() => syncLock.value = false, 100);
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
    resetMedia();
  }).catch(() => {
    // 取消操作
  });
};

const goFinish = () => {
  ElMessage.success('已完成');
  // workStep.value = 'persona';
  const testExport = { "elements": [{ "chapter": "test", "scene": [{ "scene_id": "1", "scene_subtitle": "test" }] }] }
  const exportFiles = ref()

  exportVideo(testExport).then(res => {
    exportFiles.value = res.data.data
    console.log(exportFiles.value)
  })
  active.value = 3;
  resetMedia();
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
  // if (!selectedReplacementVideo.value) {
  //     ElMessage.warning('请选择要替换的视频');
  //     return;
  // }

  // if (currentReplaceChapterIndex.value === -1 || currentReplaceSceneIndex.value === -1) {
  //     return;
  // }

  // // 更新视频URL
  // const scene = scriptList.value[currentReplaceChapterIndex.value].scene[currentReplaceSceneIndex.value];
  // scene.video_url = selectedReplacementVideo.value.url;
  // scene.thumbnail = null; // 清除旧缩略图

  // // 重新生成缩略图
  // nextTick(() => {
  //     const video = videoThumbnailRefs.value[currentReplaceChapterIndex.value + '-' + currentReplaceSceneIndex.value];
  //     if (video) {
  //         video.load();
  //         generateThumbnail(currentReplaceChapterIndex.value, currentReplaceSceneIndex.value);
  //     }
  // });

  // // 如果替换的是当前正在播放的视频，重新加载播放
  // if (selectedChapter.value === currentReplaceChapterIndex.value &&
  //     selectedScene.value === currentReplaceSceneIndex.value) {
  //     playCurrentVideo();
  // }

  // videoReplaceDialogVisible.value = false;
  // ElMessage.success('视频已替换');
  if (!selectedReplacementVideo.value) {
    ElMessage.warning('请选择要替换的视频');
    return;
  }
  const scene = scriptList.value[currentReplaceChapterIndex.value].scene[currentReplaceSceneIndex.value];
  scene.video_url = selectedReplacementVideo.value.url;
  scene.thumbnail = null;

  // 原代码传了索引，改为传视频URL（符合generateThumbnail函数定义）
  generateThumbnail(selectedReplacementVideo.value.url).then(thumbnail => {
    scene.thumbnail = thumbnail;
  });

  // 重新获取新视频时长
  getVideoDuration(selectedReplacementVideo.value.url).then(duration => {
    scene.duration = formatTime(duration);
  });

  if (selectedChapter.value === currentReplaceChapterIndex.value && selectedScene.value === currentReplaceSceneIndex.value) {
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
                  :class="{ 'is-selected': selectedAudience && audience.id === selectedAudience.id }" shadow="hover"
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
              <el-upload class="upload-container" drag action="#" :limit="3" :on-change="handleFileChange"
                :on-exceed="handleExceed" :on-remove="handleRemove" v-model:file-list="fileList" multiple
                accept="video/mp4,video/quicktime">
                <el-icon class="upload-icon">
                  <Upload />
                </el-icon>
                <div class="el-upload__text">
                  <div class="upload-text">点击或拖拽上传视频</div>
                  <div class="upload-hint">支持 MP4/MOV 格式，≤3段，单段≤100MB</div>
                </div>
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
              <h2 class="section-title">推荐模板</h2>
              <div class="stream-output-container">
                <div class="stream-output" ref="streamOutputRef1">
                  <p v-if="streamContent1 === '' && !streamCompleted1">正在分析中，请稍候...</p>
                  <p v-else>{{ streamContent1 }}</p>
                </div>
              </div>
              <div class="recommended-template">
                <!-- Template Header -->
                <div class="template-header">
                  <div class="template-icon">
                    <i class="fab fa-tiktok template-platform-icon"></i>
                  </div>
                  <div class="template-info">
                    <div class="template-name">{{ templateResData.title }}</div>
                    <div class="template-description">{{ templateResData.description }}</div>
                  </div>
                </div>

                <!-- Template Sections -->
                <div class="template-sections">
                  <!-- Section 1 -->

                  <el-card v-for="(section, index) in templateResData.structure" :key="index"
                    class="template-section-item" shadow="hover">
                    <div class="section-card">
                      <div class="section-timing">
                        <!-- <div class="timing-label">{{ section.timing }}</div> -->
                        <div class="section-title">{{ section.chapter }}</div>
                      </div>
                      <div class="section-content">
                        <div class="section-description">{{ section.description }}</div>
                        <!-- <el-tag v-if="section.tag" class="section-tag" :type="section.tag.type">
                          <el-icon>
                            <component :is="section.tag.icon" />
                          </el-icon>
                          <span>{{ section.tag.text }}</span>
                        </el-tag> -->
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
              <div v-for="(scene, sceneIndex) in chapter.scene" :key="scene.scene_id" class="scene-item-wrapper"
                @click="selectAndPlayScene(chapterIndex, sceneIndex)"
                :class="{ 'is-disabled': scene.isAudioGenerating }">
                <el-card class="scene-item" :class="{
                  'is-selected': selectedChapter === chapterIndex && selectedScene === sceneIndex,
                  'is-loading': scene.isAudioGenerating, 'is-editing': scene.isEditing
                }" shadow="hover">
                  <!-- 加载状态遮罩 -->
                  <div class="loading-mask" v-if="scene.isAudioGenerating">
                    <el-spinner size="40" />
                    <div class="loading-text">正在生成音频...</div>
                  </div>

                  <div class="scene-content">
                    <div class="scene-thumbnail">
                      <el-image :src="scene.thumbnail || defaultThumbnail" fit="cover" class="thumbnail-image" lazy />
                      <el-button class="replace-button" size="small"
                        @click.stop="openVideoReplaceDialog(chapterIndex, sceneIndex)"
                        :disabled="scene.isAudioGenerating || scene.isEditing">
                        替换
                      </el-button>
                    </div>
                    <div class="scene-details">
                      <div class="scene-header">
                        <div class="scene-title">{{ scene.scene_subtitle }}</div>
                        <div class="scene-duration">
                          视频: {{ scene.duration || '00:00' }} / 音频: {{
                            formatTime(scene.audioDuration
                              || 0) }}
                        </div>
                      </div>
                      <div class="scene-description-container">
                        <el-input v-model="scene.scene_screen_desc" type="textarea" :rows="2" resize="none"
                          placeholder="编辑场景字幕" class="scene-description"
                          :disabled="!scene.isEditing || scene.isAudioGenerating" />
                        <el-button v-if="scene.isEditing && !scene.isAudioGenerating" class="confirm-edit-button"
                          size="small" type="primary" @click.stop="confirmEditScene(chapterIndex, sceneIndex)">
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
                  <el-button circle class="action-button" @click.stop="toggleEditScene(chapterIndex, sceneIndex)"
                    :disabled="scene.isAudioGenerating">
                    <el-icon>
                      <Edit />
                    </el-icon>
                  </el-button>
                  <el-button circle class="action-button" @click.stop="confirmDeleteScene(chapterIndex, sceneIndex)"
                    :disabled="scene.isAudioGenerating || scene.isEditing">
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
              @pause="handleMediaPause" @play="handleMediaPlay"
              :disabled="currentScene?.isAudioGenerating || currentScene?.isEditing"
              :class="{ 'video-disabled': currentScene?.isAudioGenerating || currentScene?.isEditing }">
              您的浏览器不支持视频播放
            </video>
            <!-- 隐藏的音频元素（用于同步播放配音） -->
            <audio ref="audioRef" :src="currentScene?.tts_url" style="display: none;" @ended="handleAudioEnded"
              @pause="handleMediaPause" @play="handleMediaPlay"
              :disabled="currentScene?.isAudioGenerating || currentScene?.isEditing"></audio>
            <div class="video-subtitle-overlay" v-if="currentScene">
              <p>{{ currentScene.scene_screen_desc }}</p>
            </div>
            <!-- 视频时长不足提示 -->
            <!-- <div class="video-short-tip"
                            v-if="currentScene && (videoDuration || 0) < (currentScene.audioDuration || 0)">
                            视频已延长至音频时长
                        </div> -->
          </div>

          <!-- Video Controls -->
          <div class="video-controls">
            <div class="playback-controls">
              <el-button circle class="control-button" @click="playSyncMedia()"
                :disabled="currentScene?.isAudioGenerating || currentScene?.isEditing">
                <el-icon>
                  <VideoPlay />
                </el-icon>
              </el-button>
              <el-button circle class="control-button" @click="pauseSyncMedia()"
                :disabled="currentScene?.isAudioGenerating || currentScene?.isEditing">
                <el-icon>
                  <VideoPause />
                </el-icon>
              </el-button>
              <!-- <span class="time-display" v-if="videoDuration || currentScene?.audioDuration">
                                {{ formatTime(currentTime) }} / {{ formatTime(Math.max(videoDuration || 0,
                                    currentScene?.audioDuration || 0)) }}
                            </span> -->
              <span class="time-display" v-if="videoDuration || currentScene?.audioDuration">
                {{ formatTime(currentTime) }} / {{ formatTime(videoDuration || 0) }}
              </span>
            </div>
            <div class="feedback-controls">
              <el-button circle class="control-button"
                :disabled="currentScene?.isAudioGenerating || currentScene?.isEditing">
                <el-icon>
                  <Star />
                </el-icon>
              </el-button>
              <el-button circle class="control-button"
                :disabled="currentScene?.isAudioGenerating || currentScene?.isEditing">
                <el-icon>
                  <StarFilled />
                </el-icon>
              </el-button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="progress-container" v-if="currentScene">
            <!-- <el-slider v-model="currentTime"
                            :max="Math.max(videoDuration || 0, currentScene.audioDuration || 0)"
                            @change="handleTimeChange" class="video-progress"
                            :disabled="currentScene?.isAudioGenerating || currentScene?.isEditing" /> -->
            <el-slider v-model="currentTime" :max="videoDuration || 0" @change="handleTimeChange" class="video-progress"
              :disabled="currentScene?.isAudioGenerating || currentScene?.isEditing" />
          </div>
          <div class="action-buttons">
            <el-button @click="goToPreviousStep1">
              <el-icon>
                <ArrowLeft />
              </el-icon>
              <span>上一步</span>
            </el-button>
            <el-button type="primary" class="next-button" @click="goFinish">
              导出视频
            </el-button>
          </div>
        </div>
      </div>

      <!-- 视频替换弹窗 -->
      <el-dialog v-model="videoReplaceDialogVisible" title="替换视频素材" width="900px">
        <div class="video-select-container">
          <div class="video-item" v-for="(video, index) in replacementVideos" :key="index"
            @click="selectReplacementVideo(video)" :class="{ 'selected': selectedReplacementVideo === video }">
            <div class="video-wrapper">
              <video :src="video.url" class="preview-video" controls :poster="video.thumbnail" />
              <div class="play-overlay" v-if="!video.isPlaying">
                <el-button icon="VideoPlay" circle size="large" @click.stop="toggleVideoPlay(video, $event)" />
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

<style lang="scss">
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
          border: 1px solid #2563eb;
          border-radius: 0.5rem;
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
        // margin-right: 2rem;
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

      // Template section
      .template-section {
        flex: 1;
        // margin: 0 2rem;
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
          flex: auto;
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
        margin-bottom: 1.5rem;
      }

      .section-title {
        font-size: 1rem;
        font-weight: 500;
        color: #333;
      }

      .scene-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .chapter-timeline {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-left: 15px;
        border-left: 3px solid #e5e7eb;
        margin-left: 10px;
      }

      .chapter-name {
        font-size: 1.125rem;
        font-weight: 600;
        color: #2563eb;
        margin-left: 0.5rem;
        padding-top: 5px;
      }

      .scene-item-wrapper {
        position: relative;
        margin-bottom: 1rem;
        cursor: pointer;

        &.is-disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        &:hover .scene-actions {
          display: flex;
        }
      }

      .scene-item {
        transition: all 0.3s ease;
        overflow: visible;
        position: relative;

        &.is-selected {
          background-color: #EEF4FF;
          border: 1px solid #246BFD;
        }

        &.is-loading {
          cursor: not-allowed;
          background-color: #f9fafb;
          border: 1px solid #d1d5db;
        }

        &.is-editing {
          cursor: not-allowed;
          background-color: #f9fafb;
          border: 1px solid #fb923c;
        }

        &:not(.is-loading):not(.is-editing):hover {
          background-color: #f3f4f6;
          border-color: #d1d5db;
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
        background-color: rgba(255, 255, 255, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
        border-radius: 4px;
      }

      .loading-text {
        margin-top: 1rem;
        color: #6b7280;
        font-size: 0.9rem;
      }

      .scene-content {
        display: flex;
        gap: 1.25rem;
        align-items: flex-start;
      }

      .scene-thumbnail {
        position: relative;
        width: 8rem;
        height: 8rem;
        border-radius: 0.5rem;
        overflow: hidden;
        flex-shrink: 0;
        background-color: #f5f5f5;
      }

      .thumbnail-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .replace-button {
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        background-color: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(4px);
        z-index: 5;
        border-radius: 4px;

        &:disabled {
          background-color: rgba(255, 255, 255, 0.6);
          cursor: not-allowed;
        }
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
        margin-bottom: 0.75rem;
      }

      .scene-title {
        font-size: 1rem;
        font-weight: 500;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 65%;
      }

      .scene-duration {
        font-size: 0.8rem;
        color: #6b7280;
      }

      .scene-description-container {
        flex: 1;
        display: flex;
        gap: 0.75rem;
        align-items: flex-start;
      }

      .scene-description {
        flex: 1;

        :deep(.el-textarea__inner) {
          height: 100%;
          font-size: 0.95rem;
          resize: none;
          border-color: #d1d5db;

          &:disabled {
            background-color: #f9fafb;
            color: #6b7280;
            cursor: not-allowed;
          }
        }
      }

      .confirm-edit-button {
        margin-top: 0.5rem;
        align-self: flex-start;
        padding: 0.25rem 0.75rem;
        font-size: 0.8rem;
      }

      .scene-actions {
        position: absolute;
        right: 1rem;
        bottom: -0.75rem;
        display: none;
        gap: 0.75rem;
        z-index: 10;
      }

      .action-button {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border-color: #d1d5db;
        }

        &:disabled {
          background-color: #f9fafb;
          color: #9ca3af;
          cursor: not-allowed;
        }

        :deep(.el-icon) {
          font-size: 0.9rem;
        }
      }
    }

    .storyboard-res {
      flex: 1;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      margin: 2rem;
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