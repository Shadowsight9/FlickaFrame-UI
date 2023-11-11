import type { FileResponse, OssHostResponse, UpTokenQuery, UpTokenResponse, UpTokenType, VideoQualityItem } from '~/models'
import SparkMD5 from 'spark-md5'
import { joinURL, parseURL } from 'ufo'

function generateMD5(file: File): Promise<string> {
  const spark = new SparkMD5.ArrayBuffer()
  const fileReader = new FileReader()
  return new Promise((resolve) => {
    fileReader.onload = (e) => {
      spark.append(e.target?.result as ArrayBuffer)
      const md5 = spark.end()
      resolve(md5)
    }
    fileReader.readAsArrayBuffer(file)
  })
}

export async function createFileToken(query: UpTokenQuery) {
  return $fetch<ApiResult<UpTokenResponse>>('/api/oss/uptoken', {
    query,
  })
}

export async function uploadFile(file: File, token: string, fileType: UpTokenType) {
  const md5 = await generateMD5(file)
  const formData = new FormData()
  formData.append('file', file)
  formData.append('token', token)
  formData.append('key', `${fileType}/${md5}`)
  return $fetch<FileResponse>('http://up-z2.qiniup.com', {
    method: 'POST',
    body: formData,
  })
}

export async function getFileUrl(key: string) {
  const { success, data } = await $fetch<ApiResult<OssHostResponse>>('/api/oss/endpoint')
  const host = success ? data.endpoint : 'http://s2i8a2ssf.hn-bkt.clouddn.com'

  return joinURL(host, key)
}

export const QualityPostfix = {
  '2300kbps': '.2300kbps.flv',
  '1400kbps': '.1400kbps.mp4',
}

export function getQualityList(url: string) {
  const res: VideoQualityItem[] = [{
    name: '原画',
    value: url,
    default: true,
  }]

  Object.entries(QualityPostfix).forEach(([name, postfix]) => {
    res.push({
      name,
      value: url.replace(/\.\w+$/, postfix),
    })
  })

  return res
}

export function getUrlOssKey(url: string) {
  const formatted = parseURL(url)
  if (formatted.host) {
    return parseURL(url).pathname.substring(1)
  } else {
    return url
  }
}
