<script setup>
// import { storeToRefs } from 'pinia';
import { User, PieChart, VideoPlay, DataAnalysis, Check, Star, ShoppingCart, Operation } from '@element-plus/icons-vue'
import { onMounted, ref, reactive } from 'vue'
import { EVENT_CODE, ElMessage } from 'element-plus'
// import { useWorkStore } from '@/stores/workStore';

// const workStore = useWorkStore()
// const { workState, workStep } = storeToRefs(workStore);
const workState = ref('')
const workStep = ref('')
const loading = ref(false)
const checkboxGroup1 = ref(['Value1'])
const active = ref(0)

const form = reactive({
  productName: '',
  region: '',
  tags: [],
})

// 是否已提交表单
const isPersonaSubmitted = ref(false);

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
  // Navigate to the next step (template matching)
  ElMessage.success('准备生成视频');
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

        <div class="persona-form">
          <el-form :model="form" :class="{ 'shrink-persona-form': isPersonaSubmitted }" label-width="auto">
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
        </div>
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
      <div class="storyboard" v-show="workStep == 'storyboard'">
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

    .persona-form {
      width: fit-content;
      margin-top: 2rem;

      .el-form {
        width: 800px;
        margin: 0 auto;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        transition: all 0.5s ease-in-out;

        &.shrink-persona-form {
          width: 500px;
          margin: 0;
          margin-right: 2rem;
        }

      }
    }

    .persona-res {
      flex: 1;

      /* Recommendations section */
      .recommendations-container {
        width: 100%;
        background-color: #ffffff;
        border-radius: 0.75rem;
        padding: 0, 2rem;
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

}
</style>