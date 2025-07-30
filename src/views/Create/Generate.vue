<script setup>
// import { storeToRefs } from 'pinia';
import {
  User, DataAnalysis, Check, Star, ShoppingCart, Upload,
  Search,
  Operation,
  ArrowLeft,
  ArrowRight,
  InfoFilled,
  ChatDotRound,
  Picture,
  Platform
} from '@element-plus/icons-vue'
import { onMounted, ref, reactive } from 'vue'
import { EVENT_CODE, ElMessage, ElMessageBox } from 'element-plus'
// import { useWorkStore } from '@/stores/workStore';

// const workStore = useWorkStore()
// const { workState, workStep } = storeToRefs(workStore);
const workState = ref('')
const workStep = ref('')
const loading = ref(false)
const checkboxGroup1 = ref(['Value1'])
const active = ref(0)

// Selected options
const selectedPlatform = ref('tiktok');
const selectedLanguage = ref('english');
const fileList = ref([]);

const form = reactive({
  productName: '',
  region: '',
  tags: [],
})

// 是否已提交表单
const isPersonaSubmitted = ref(false);
const isTemplateSubmitted = ref(false);

onMounted(() => {
  workState.value = 'input'
  active.value = 0
  workStep.value = 'persona'
  loading.value = false
  console.log(workStep, workState, loading)
})

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

const onSubmit = () => {
  console.log(form.tags)
  ElMessage.success('正在分析商品信息...');
  isPersonaSubmitted.value = true
  workState.value = 'analyze'
  // In a real app, this would trigger the AI analysis
  setTimeout(() => {
    ElMessage.success('分析完成，已推荐最匹配的目标人群');
    // Highlight the first audience group
    selectAudience(audienceGroups.value[0]);
    workState.value = 'finish'
    loading.value = false
  }, 1500);
}

const selectAudience = (audience) => {
  selectedAudience.value = audience;
};

const goToNextStep = () => {
  // Navigate to the next step (template matching)
  ElMessage.success(`已选择 "${selectedAudience.value.title}" 作为目标人群，即将进入模版匹配环节`);
  // In a real app, this would navigate to the next page or update the current step
  workStep.value = 'template'
  active.value = 1

};

const generateVideo = () => {
  // if (fileList.value.length === 0) {
  //   ElMessage.warning('请先上传视频素材并完成分析');
  //   return;
  // }

  ElMessage.success('正在生成视频，即将跳转到视频生成页面');
  // In a real app, this would navigate to the next page or update the current step
  workStep.value = 'storyboard'
  active.value = 2

};

const goFinish = () => {
  // Navigate to the next step (template matching)
  ElMessage.success('已完成');
  // In a real app, this would navigate to the next page or update the current step
  // workStep.value = 'persona'
  active.value = 3

};

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
    'spanish': '葡萄牙语',
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
            <el-input v-model="form.productName" />
          </el-form-item>
          <el-form-item label="售卖区域" :label-position="right">
            <el-input v-model="form.region" />
          </el-form-item>
          <el-form-item label="商品核心卖点" :label-position="right">
            <el-input-tag v-model="form.tags" :max="6" :trigger="EVENT_CODE.space"
              placeholder="请输入标签，按空格键添加，核心卖点总数不超过6个">
              <template #suffix><el-button class="ai-generate-button" :icon="Operation"
                  @click="generateSellingPoints" /></template>
            </el-input-tag>
            <div class="selling-points-container">
              <div class="suggested-points">
                <div v-for="(point, index) in suggestedPoints" :key="index" class="point-item"
                  @click="selectPoint(point)">
                  <el-icon color="#2563eb">
                    <Check />
                  </el-icon>
                  <span>{{ point }}</span>
                </div>
              </div>
              <el-checkbox-group v-model="checkboxGroup1" size="small">
                <el-checkbox label="Option1" value="Value1" />
                <el-checkbox label="Option2" value="Value2" />
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
                :on-change="handleFileChange" :on-exceed="handleExceed" :on-remove="handleRemove" :file-list="fileList"
                multiple accept="video/mp4,video/quicktime">
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
      <div class="storyboard" v-show="workStep == 'storyboard'">
        <div class="storyboard-form">
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
              <el-card class="scene-item" :class="{ 'is-selected': selectedSceneIndex === index }" shadow="hover"
                @click="selectScene(index)">
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
                    <el-input v-model="scene.description" type="textarea" :rows="4" resize="none" placeholder="编辑场景描述"
                      class="scene-description" />
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
        <div class="storyboard-res">
          <div class="preview-header">
            <div class="preview-tabs">
              <el-button :type="activeTab === 'scene' ? 'primary' : ''" @click="activeTab = 'scene'">场景</el-button>
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
            <el-button type="primary" class="next-button" @click="goFinish">
              完成
            </el-button>
          </div>
        </div>
      </div>

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
        width: 47%;
        margin: 0;
        margin-right: 2rem;
      }

    }

    .persona-res {
      flex: 1;

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
        :deep(.el-card__body) {
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
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
    }
  }

  .storyboard {
    .storyboard-form {
      width: 50%;
      border-right: 1px solid #e5e7eb;
      padding: 1rem;
      overflow: hidden;
      display: flex;
      flex-direction: column;

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
    }

    .storyboard-res {
      width: 50%;
      padding: 1.5rem;

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
    }
  }

}

// Font Awesome icons
.fab,
.fas {
  font-family: 'Font Awesome 6 Free', sans-serif;
}
</style>