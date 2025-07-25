<template>
  <div class="article-edit">
    <div>
      <div class="editor-wrap">
        <!-- 文章标题、类型 -->
        <el-row :gutter="10">
          <el-col :span="18">
            <el-input
              v-model.trim="articleName"
              placeholder="请输入文章标题（最多100个字符）"
              maxlength="100"
            />
          </el-col>
          <el-col :span="6">
            <el-select v-model="articleType" placeholder="请选择文章类型" filterable>
              <el-option
                v-for="item in articleTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>
        </el-row>

        <!-- 富文本编辑器 -->
        <ArtWangEditor class="el-top" v-model="editorHtml" />

        <div class="form-wrap">
          <h2>发布设置</h2>
          <!-- 图片上传 -->
          <el-form>
            <el-form-item label="封面">
              <div class="el-top upload-container">
                <el-upload
                  class="cover-uploader"
                  :action="uploadImageUrl"
                  :headers="uploadHeaders"
                  :show-file-list="false"
                  :on-success="onSuccess"
                  :on-error="onError"
                  :before-upload="beforeUpload"
                >
                  <div v-if="!cover" class="upload-placeholder">
                    <el-icon class="upload-icon"><Plus /></el-icon>
                    <div class="upload-text">点击上传封面</div>
                  </div>
                  <img v-else :src="cover" class="cover-image" />
                </el-upload>
                <div class="el-upload__tip">建议尺寸 16:9，jpg/png 格式</div>
              </div>
            </el-form-item>
            <el-form-item label="可见">
              <el-switch v-model="visible" />
            </el-form-item>
          </el-form>

          <div style="display: flex; justify-content: flex-end">
            <el-button type="primary" @click="submit" style="width: 100px">
              {{ pageMode === PageModeEnum.Edit ? '保存' : '发布' }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="outline-wrap">
        <div class="item" v-for="(item, index) in outlineList" :key="index">
          <p :class="`level${item.level}`">{{ item.text }}</p>
        </div>
      </div> -->
  </div>
</template>

<script setup lang="ts">
  import { Plus } from '@element-plus/icons-vue'
  import { ArticleService } from '@/api/articleApi'
  import { ApiStatus } from '@/utils/http/status'
  import { ElMessage } from 'element-plus'
  import { useUserStore } from '@/store/modules/user'
  import EmojiText from '@/utils/emojo'
  import { PageModeEnum } from '@/enums/formEnum'
  import axios from 'axios'
  import { useCommon } from '@/composables/useCommon'

  const route = useRoute()
  const router = useRouter()

  const userStore = useUserStore()
  let { accessToken } = userStore

  // 上传路径
  const uploadImageUrl = `${import.meta.env.VITE_API_URL}/api/common/upload`
  // 传递 token
  const uploadHeaders = { Authorization: 'Bearer' + accessToken }

  let pageMode: PageModeEnum = PageModeEnum.Add // 页面类型 新增 ｜ 编辑
  const articleName = ref('') // 文章标题
  const articleType = ref() // 文章类型
  const articleTypes = ref() // 类型列表
  const editorHtml = ref('') // 编辑器内容
  const createDate = ref('') // 创建时间
  const cover = ref('') // 图片
  const visible = ref(true) // 可见
  // const outlineList = ref()

  onMounted(() => {
    useCommon().scrollToTop()
    getArticleTypes()
    initPageMode()
  })

  // 初始化页面类型 新增 ｜ 编辑
  const initPageMode = () => {
    const { id } = route.query
    pageMode = id ? PageModeEnum.Edit : PageModeEnum.Add
    if (pageMode === PageModeEnum.Edit && id) {
      initEditArticle(Number(id))
    } else {
      initAddArticle()
    }
  }

  // 初始化编辑文章的逻辑
  const initEditArticle = (id: number) => {
    articleId = id
    getArticleDetail()
  }

  // 初始化新增文章逻辑
  const initAddArticle = () => {
    createDate.value = formDate(useNow().value)
  }

  // 获取文章类型
  const getArticleTypes = async () => {
    try {
      const response = await axios.get('https://www.qiniu.lingchen.kim/classify.json')
      if (response.data.code === 200) {
        articleTypes.value = response.data.data
      }
    } catch (error) {
      console.error('Error fetching JSON data:', error)
    }
    // try {
    //   const res = await ArticleService.getArticleTypes({})
    //   if (res.code === ApiStatus.success) {
    //     articleTypes.value = res.data
    //   }
    // } catch (err) { }
  }

  // 获取文章详情内容
  let articleId: number = 0
  const getArticleDetail = async () => {
    const res = await axios.get('https://www.qiniu.lingchen.kim/blog_list.json')

    if (res.data.code === ApiStatus.success) {
      let { title, blog_class, html_content } = res.data.data
      articleName.value = title
      articleType.value = Number(blog_class)
      editorHtml.value = html_content
    }

    // const res = await ArticleService.getArticleDetail(articleId)
    // if (res.code === ApiStatus.success) {
    //   let { title, blog_class, create_time, home_img, html_content } = res.data

    //   articleName.value = title
    //   articleType.value = Number(blog_class)
    //   editorHtml.value = html_content
    //   cover.value = home_img
    //   createDate.value = formDate(create_time)

    //   // getOutline(html_content)
    // }
  }

  // const getOutline = (content: string) => {
  //   const regex = /<h([1-3])>(.*?)<\/h\1>/g
  //   const headings = []
  //   let match

  //   while ((match = regex.exec(content)) !== null) {
  //     headings.push({ level: match[1], text: match[2] })
  //   }
  //   outlineList.value = headings
  // }

  // 提交
  const submit = () => {
    if (pageMode === PageModeEnum.Edit) {
      editArticle()
    } else {
      addArticle()
    }
  }

  // 格式化日期
  const formDate = (date: string | Date): string => {
    return useDateFormat(date, 'YYYY-MM-DD').value
  }

  // 验证输入
  const validateArticle = () => {
    if (!articleName.value) {
      ElMessage.error(`请输入文章标题`)
      return false
    }

    if (!articleType.value) {
      ElMessage.error(`请选择文章类型`)
      return false
    }

    if (editorHtml.value === '<p><br></p>') {
      ElMessage.error(`请输入文章内容`)
      return false
    }

    if (!cover.value) {
      ElMessage.error(`请上传图片`)
      return false
    }

    return true
  }

  // 构建参数
  const buildParams = () => {
    return {
      title: articleName.value,
      html_content: editorHtml.value,
      home_img: cover.value,
      blog_class: articleType.value,
      create_time: createDate.value
    }
  }

  // 添加文章
  const addArticle = async () => {
    try {
      if (!validateArticle()) return

      editorHtml.value = delCodeTrim(editorHtml.value)

      const params = buildParams()
      const res = await ArticleService.addArticle(params)

      if (res.code === ApiStatus.success) {
        ElMessage.success(`发布成功 ${EmojiText[200]}`)
        goBack()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 编辑文章
  const editArticle = async () => {
    try {
      if (!validateArticle()) return

      editorHtml.value = delCodeTrim(editorHtml.value)

      const params = buildParams()
      const res = await ArticleService.editArticle(articleId, params)

      if (res.code === ApiStatus.success) {
        ElMessage.success(`修改成功 ${EmojiText[200]}`)
        goBack()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const delCodeTrim = (content: string): string => {
    return content.replace(/(\s*)<\/code>/g, '</code>')
  }

  const onSuccess = (response: any) => {
    cover.value = response.data.url
    ElMessage.success(`图片上传成功 ${EmojiText[200]}`)
  }

  const onError = () => {
    ElMessage.error(`图片上传失败 ${EmojiText[500]}`)
  }

  // 返回上一页
  const goBack = () => {
    setTimeout(() => {
      router.go(-1)
    }, 800)
  }

  // 添加上传前的校验
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/')
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isImage) {
      ElMessage.error('只能上传图片文件!')
      return false
    }
    if (!isLt2M) {
      ElMessage.error('图片大小不能超过 2MB!')
      return false
    }
    return true
  }
</script>

<style lang="scss" scoped>
  .article-edit {
    .editor-wrap {
      max-width: 1000px;
      margin: 20px auto;

      .el-top {
        margin-top: 10px;
      }

      .form-wrap {
        padding: 20px;
        margin-top: 20px;
        background-color: var(--art-main-bg-color);
        border: 1px solid var(--art-border-color);
        border-radius: calc(var(--custom-radius) / 2 + 2px) !important;

        h2 {
          margin-bottom: 20px;
          font-size: 20px;
          font-weight: 500;
        }
      }
    }

    .outline-wrap {
      box-sizing: border-box;
      width: 280px;
      padding: 20px;
      border: 1px solid #e3e3e3;
      border-radius: 8px;

      .item {
        p {
          height: 30px;
          font-size: 13px;
          line-height: 30px;
          cursor: pointer;
        }

        .level3 {
          padding-left: 10px;
        }
      }
    }

    .upload-container {
      .cover-uploader {
        position: relative;
        overflow: hidden;
        cursor: pointer;
        border-radius: 6px;
        transition: var(--el-transition-duration);

        &:hover {
          border-color: var(--el-color-primary);
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 260px;
          height: 160px;
          border: 1px dashed #d9d9d9;
          border-radius: 6px;

          .upload-icon {
            font-size: 28px;
            color: #8c939d;
          }

          .upload-text {
            margin-top: 8px;
            font-size: 14px;
            color: #8c939d;
          }
        }

        .cover-image {
          display: block;
          width: 260px;
          height: 160px;
          object-fit: cover;
        }
      }

      .el-upload__tip {
        margin-top: 8px;
        font-size: 12px;
        color: #666;
      }
    }
  }
</style>
