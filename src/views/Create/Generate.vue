<script setup>
// import { storeToRefs } from 'pinia';
import { User, PieChart, VideoPlay, DataAnalysis, Check, Star, ShoppingCart } from '@element-plus/icons-vue'
import { onMounted, ref, reactive } from 'vue'
import { EVENT_CODE } from 'element-plus'
// import { useWorkStore } from '@/stores/workStore';

// const workStore = useWorkStore()
// const { workState, workStep } = storeToRefs(workStore);
let workState = ref('')
let workStep = ref('')

const form = reactive({
  productName: '',
  region: '',
  tags: [],
})

onMounted(() => {
  workState = 'input'
  workStep = 'persona'
  console.log(workStep)
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
  workState = 'analyze'
  // In a real app, this would trigger the AI analysis
  setTimeout(() => {
    ElMessage.success('分析完成，已推荐最匹配的目标人群');
    // Highlight the first audience group
    selectAudience(audienceGroups.value[0]);
    workState = 'finish'
  }, 1500);
}

const selectAudience = (audience) => {
  selectedAudience.value = audience;
};

const goToNextStep = () => {
  // Navigate to the next step (template matching)
  ElMessage.success(`已选择 "${selectedAudience.value.title}" 作为目标人群，即将进入模版匹配环节`);
  // In a real app, this would navigate to the next page or update the current step
  workStep = 'template'

};

const generateVideo = () => {
  // Navigate to the next step (template matching)
  ElMessage.success('准备生成视频');
  // In a real app, this would navigate to the next page or update the current step
  workStep = 'storyboard'

};

const goFinish = () => {
  // Navigate to the next step (template matching)
  ElMessage.success('已完成');
  // In a real app, this would navigate to the next page or update the current step
  workStep = 'persona'

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
</script>

<template>
  <el-main>
    <div class="generate-step">
      <el-steps :active="active" align-center finish-status="success">
        <el-tooltip content="AI 精准分析目标人群特征" placement="bottom" effect="light">
          <el-step title="人群定位" :icon="User" />
        </el-tooltip>
        <el-tooltip content="智能推荐最佳营销模版" placement="bottom" effect="light">
          <el-step title="模板匹配" :icon="PieChart" />
        </el-tooltip>
        <el-tooltip content="一键生成专业营销视频" placement="bottom" effect="light">
          <el-step title="视频生成" :icon="VideoPlay" />
        </el-tooltip>
      </el-steps>
    </div>
    <div class="work-content">
      <div class="persona">
        <div class="persona-form">
          <el-form :model="form" label-width="auto">
            <el-form-item label="商品名称" :label-position="right">
              <el-input v-model="form.productName" />
            </el-form-item>
            <el-form-item label="售卖区域" :label-position="right">
              <el-input v-model="form.region" />
            </el-form-item>
            <el-form-item label="商品核心卖点" :label-position="right">
              <el-input-tag v-model="form.tags" :max="6" :trigger="EVENT_CODE.space"
                placeholder="请输入标签，按空格键添加，核心卖点总数不超过6个">
                <div class="selling-points-container">
                  <div class="selling-point-input">
                    <el-input v-model="productForm.sellingPointInput" placeholder="输入商品特点，AI 将为您推荐核心卖点">
                      <template #suffix>
                        <el-button class="ai-generate-button" :icon="Operation" @click="generateSellingPoints" />
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
              </el-input-tag>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit"><el-icon>
                  <DataAnalysis />
                </el-icon>开始分析</el-button>
              <el-button>Cancel</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="persona-res">
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
      <div class="template">
        <div class="template-form">模板匹配</div>
        <div class="template-res">
          <div class="recommendations-container">
            <h2 class="section-title">推荐模板</h2>

            <!-- Next step button -->
            <div class="recommendation-actions">
              <el-button type="primary" class="next-button" @click="generateVideo">
                生成视频
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="storyboard">
        <div class="persona-form">分镜列表</div>
        <div class="persona-res">
          <div class="recommendations-container">
            <h2 class="section-title">视频预览</h2>
            <div class="recommendation-actions">
              <el-button type="primary" class="next-button" @click="goFinish">
                完成
              </el-button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </el-main>
</template>

<style>
.generate-step {
  text-align: center;

  .el-steps {
    width: auto;
  }
}

.work-content {
  .persona-form {
    display: flex;
    justify-content: center;
    align-items: center;

    .el-form {
      min-width: 600px;
    }
  }

  .persona-res {

    /* Recommendations section */
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
  }
}
</style>