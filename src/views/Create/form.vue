<template>
    <el-steps :active="active" class="steps" align-center finish-status="success">
        <el-tooltip content="AI 精准分析目标人群特征" placement="bottom" effect="light">
            <el-step title="注册帐号"></el-step>
        </el-tooltip>

        <el-step title="资料完善" @click.native="handleStep(1)"></el-step>
        <el-step title="资料审核" @click.native="handleStep(2)"></el-step>
    </el-steps>
</template>

<script setup>
import { ref, reactive } from 'vue';

// 表单数据
const formData = reactive({
    name: '',
    tag: ''
});

// 大输入框的内容
const contentText = ref('');

// 是否已提交表单
const isSubmitted = ref(false);

// 提交表单处理函数
const handleSubmit = () => {
    if (formData.name.trim() === '' || formData.tag.trim() === '') {
        ElMessage.warning('姓名和标签不能为空');
        return;
    }

    isSubmitted.value = true;
};
</script>

<style scoped lang="scss">
.steps {
    width: 80%;
    margin: 20px auto 0;
    height: 35px;

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
            width: 35px;
            height: 35px;
            font-size: 16px;
            border: 1px solid;

            .el-step__icon-inner {
                font-weight: unset !important;
            }
        }

        .el-step__head.is-process {
            color: #018736;
            border-color: #018736;
        }

        .el-step__head.is-success {
            color: #018736;
            border-color: #018736;
        }

        .is-process .el-step__icon.is-text {
            background: #018736;
            color: #fff;
        }

        .el-step__title.is-process {
            color: #018736;
        }

        .el-step__title.is-success {
            color: #565656;
        }

        .el-step__title {
            position: absolute;
            top: calc((100% - 35px)/2);
            left: calc(50% + 25px);
        }
    }
}
</style>
