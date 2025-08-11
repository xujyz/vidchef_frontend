<script setup>
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

// 表单数据
const form = ref({
  prod_name: '',
  prod_img: '',
  prod_tags: [],
  region: ''
})

// 模拟标签选项
const tagOptions = ['高端', '商务', '年轻', '科技']

// 提交状态
const isPersonaSubmitted = ref(false)

// 流式结果文本
const streamText = ref('')
const streamContainer = ref(null)

// 最终返回的数组数据
const resultCards = ref([])

/**
 * 提交表单
 */
async function handleSubmit() {
  if (!form.value.prod_name) {
    ElMessage.warning('请输入产品名称')
    return
  }

  isPersonaSubmitted.value = true
  streamText.value = ''
  resultCards.value = []

  // 模拟调用后端流式接口
  await simulateStreamApi()
}

/**
 * 模拟流式输出 API
 * 实际使用时替换为 fetch + ReadableStream
 */
async function simulateStreamApi() {
  const fakeChunks = ['这是第一段流式输出...', '然后是第二段输出...', '最后的内容到这里结束。']

  for (let chunk of fakeChunks) {
    await new Promise(r => setTimeout(r, 800))
    streamText.value += chunk
    await nextTick(() => {
      if (streamContainer.value) {
        streamContainer.value.scrollTop = streamContainer.value.scrollHeight
      }
    })
  }

  // 模拟最终数组结果
  resultCards.value = ['卡片1内容', '卡片2内容', '卡片3内容']
}
</script>

<template>
  <el-main>
    <div>我的空间</div>
    <div class="page-container">
      <!-- 中间表单，未提交时居中 -->
      <div v-if="!isPersonaSubmitted" class="form-container">
        <el-form :model="form" label-width="80px" @submit.prevent="handleSubmit">
          <el-form-item label="产品名称">
            <el-input v-model="form.prod_name" placeholder="请输入产品名称"></el-input>
          </el-form-item>
          <el-form-item label="产品图片">
            <el-input v-model="form.prod_img" placeholder="图片URL"></el-input>
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="form.prod_tags" multiple placeholder="选择标签">
              <el-option v-for="tag in tagOptions" :key="tag" :label="tag" :value="tag" />
            </el-select>
          </el-form-item>
          <el-form-item label="地区">
            <el-input v-model="form.region" placeholder="请输入地区"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 提交后，右侧显示流式内容 -->
      <div v-else class="content-container">
        <div class="left-panel">
          <el-form :model="form" label-width="80px" @submit.prevent="handleSubmit">
            <el-form-item label="产品名称">
              <el-input v-model="form.prod_name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSubmit">重新提交</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="right-panel">
          <!-- 流式输出区域，可滚动 -->
          <div class="stream-output" ref="streamContainer">
            <p v-html="streamText"></p>
          </div>

          <!-- 流式完成后显示卡片 -->
          <div v-if="resultCards.length" class="cards-container">
            <el-card v-for="(item, index) in resultCards" :key="index" class="result-card" shadow="hover">
              <div>{{ item }}</div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </el-main>
</template>

<style>
.page-container {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
}

.form-container {
  margin: auto;
  width: 400px;
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.content-container {
  display: flex;
  width: 100%;
  padding: 20px;
  gap: 20px;
}

.left-panel {
  width: 300px;
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.stream-output {
  flex: 1;
  background: white;
  padding: 15px;
  border-radius: 8px;
  overflow-y: auto;
  margin-bottom: 10px;
  white-space: pre-wrap;
}

.cards-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.result-card {
  width: 200px;
}
</style>