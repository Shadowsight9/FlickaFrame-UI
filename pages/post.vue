<script setup lang="ts">

import { Field as FormField, useForm } from 'vee-validate'
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { getFileUrl, getUrlOssKey, postVideo } from '~/apis'

definePageMeta({
  scrollToTop: true,
  needAuth: true,
})

const form = useForm({
  validationSchema: toTypedSchema(z.object({
    playUrl: z.string().min(1),
    thumbUrl: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional(),
    category: z.string().default('1'),
    tags: z.array(z.string()).default([]),
    publishTime: z.number().optional(),
    visibility: z.number().default(1),
    videoDuration: z.number().optional(),
    videoHeight: z.number().optional(),
    videoWidth: z.number().optional(),
  })),
})

const defaultCoverUrl = ref('')

const formEnd = ref(false)

async function handleVideoUploaded(videoUrl: string) {
  const thumbKey = `cover/${videoUrl.split('/')[1]}.jpg`
  const thumbUrl = await getFileUrl(thumbKey)
  defaultCoverUrl.value = thumbUrl
}

const handleSubmit = form.handleSubmit(async (values) => {
  values.thumbUrl = getUrlOssKey(values.thumbUrl)
  const { success } = await postVideo(values)
  if (!success) {
    message.error('投稿失败')
  } else {
    message.success('投稿成功')
    formEnd.value = true
  }
})

function handleRetry() {
  formEnd.value = false
  form.resetForm()
}

</script>

<template>
  <div>
    <div v-if="!formEnd">

      <form class="max-w-250 w-full space-y-8" @submit.prevent>

        <div class="w-full text-center text-5xl">创作服务平台</div>

        <FormField v-slot="{ componentField }" name="playUrl">
          <UiFormItem>
            <UiFormLabel>视频</UiFormLabel>
            <UiFormControl>
              <ManageVideoUploader
                v-bind="componentField"
                @update:duration="form.setFieldValue('videoDuration', $event)"
                @update:width="form.setFieldValue('videoWidth', $event)"
                @update:height="form.setFieldValue('videoHeight', $event)"
                @uploaded="handleVideoUploaded"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="thumbUrl">
          <UiFormItem>
            <UiFormLabel>封面</UiFormLabel>
            <UiFormControl>
              <ManageCoverUploader v-bind="componentField" :defalut-file-url="defaultCoverUrl" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="title">
          <UiFormItem>
            <UiFormLabel>标题</UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="category">
          <UiFormItem>
            <UiFormLabel>分类</UiFormLabel>
            <UiFormControl>
              <ManageCategorySelector v-bind="componentField" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>

        </FormField>

        <FormField v-slot="{ componentField }" name="tags">
          <UiFormItem>
            <UiFormLabel>标签</UiFormLabel>
            <UiFormControl>
              <ManageTagManager v-bind="componentField" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <UiFormItem>
            <UiFormLabel>视频描述</UiFormLabel>
            <UiFormControl>
              <UiTextarea placeholder="详细描述一下视频吧～" v-bind="componentField" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="publishTime">
          <UiFormItem>
            <UiFormLabel>上传时间</UiFormLabel>
            <UiFormControl>
              <ManageUploadTimeSelector v-bind="componentField" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="visibility">
          <UiFormItem>
            <UiFormLabel>可见性</UiFormLabel>
            <UiFormControl>
              <ManageVisibilitySelector v-bind="componentField" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </FormField>
        <div class="w-full flex flex-row-reverse pb-10">
          <UiButton @click="handleSubmit">
            立即投稿
          </UiButton>
        </div>

      </Form>
    </div>
    <div v-else class="mt-100">

      <a-result
        status="success"
        title="上传视频成功～"
      >
        <template #extra>
          <UiButton @click="navigateTo('/explore')">
            返回发现页
          </UiButton>
          <UiButton @click="handleRetry">
            上传更多视频
          </UiButton>
        </template>
      </a-result>

    </div>
  </div>

</template>
