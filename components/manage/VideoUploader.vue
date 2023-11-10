<script setup lang='ts'>
import { createFileToken, uploadFile } from '~/apis'
import { type FileResponse, UpTokenType } from '~/models'

const emit = defineEmits<{
  (e: 'uploaded', val: string): void
}>()

const selectFileElement = ref<HTMLInputElement | null>(null)

const playUrl = defineModel<string | undefined>()
const videoDuration = defineModel<number | undefined>('duration')
const videoWidth = defineModel<number | undefined>('width')
const videoHeight = defineModel<number | undefined>('height')

const uploadResult = ref({})

const isUploading = ref(false)

function setVideoMetadata(fileInfo: FileResponse) {
  videoDuration.value = Number(fileInfo.videoDuration)
  videoWidth.value = Number(fileInfo.videoWidth)
  videoHeight.value = Number(fileInfo.videoHeight)
}

async function onVideoSelect() {
  if (isUploading.value) return

  const [file] = selectFileElement.value?.files || []
  if (!file) {
    notification.warn({ message: '请选择视频' })
  } else {
    isUploading.value = true
    const result = await upload(file)
    isUploading.value = false
    if (!result) {
      notification.warn({ message: '上传失败' })
    } else {
      notification.success({ message: '上传成功' })
      uploadResult.value = result
      setVideoMetadata(result)
      playUrl.value = result.key
      emit('uploaded', result.key)
    }
  }
}

async function upload(file: File) {
  const { success: tokenSuccess, data: tokenData } = await createFileToken({ uploadType: UpTokenType.Video })

  if (!tokenSuccess) return false

  return uploadFile(file, tokenData!.upToken, UpTokenType.Video)
}
</script>

<template>

  <UiCard class="mt-5 w-full p-10">
    <div
      class="relative h-80 w-full border-2 rounded-md border-dotted bg-foreground/5 hover-border-indigo-600"
    >
      <input
        ref="selectFileElement"
        class="h-full w-full cursor-pointer opacity-0"
        type="file"
        accept="video/*"
        @change="onVideoSelect"
      >
      <div
        class="pointer-events-none absolute left-1/2 top-1/2 flex-col-center -translate-x-1/2 -translate-y-1/2"
      >
        <div>拖拽视频到此或点击上传</div>
        <UiButton
          class="mt-2 w-30 rounded-sm"
          :disabled="isUploading"
        >
          <span class="flex-center gap-1">
            <div v-if="isUploading" class="i-mdi-loading animate-spin text-lg" />
            {{ isUploading ? '正在上传' : '上传视频' }}
          </span>

        </UiButton>
      </div>
    </div>
  </UiCard>
</template>
