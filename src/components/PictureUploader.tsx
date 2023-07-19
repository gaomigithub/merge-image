/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import React, { Fragment, memo, useCallback, useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Modal, Space, Upload } from 'antd'
import type { RcFile, UploadProps } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import useImageStore, { UploadFileWithSize } from '../store/imageStore'
import useLayoutUiStore from '../store/layoutUiStore'
import mergeImages from 'merge-images'

type EventProps = Pick<UploadProps, 'onChange' | 'customRequest'>
type OnChangeEvent = EventProps['onChange']
type customRequestEvent = EventProps['customRequest']
type Defined<T> = Exclude<T, undefined>

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

export function useMergeImages() {
  // useImageStore
  const fileList = useImageStore((state) => state.fileList)
  const setPreviewImage = useImageStore((state) => state.setPreviewImage)
  const setPreviewTitle = useImageStore((state) => state.setPreviewTitle)
  const setFileList = useImageStore((state) => state.setFileList)

  const [resImgPath, setResImgPath] = useState('')
  const [resImgHeight, setResImgHeight] = useState(0)
  const arrImgs = useCallback(() => {
    let totalHeight = 0
    const _arr = fileList.reduce(
      (
        accumulator: (UploadFileWithSize & {
          y: number
        })[],
        obj,
        index
      ) => {
        // 计算 y 值
        const y =
          index > 0
            ? (accumulator[index - 1]?.y ?? 0) +
              (accumulator[index - 1]?.height ?? 0)
            : 0
        // 将当前对象和新属性复制到新数组对象中
        console.log('new y,', y)
        const newObj = { ...obj, x: 0, y }
        // 将该新对象添加到累加数组中
        return [...accumulator, newObj]
      },
      []
    )

    const arr = _arr.map((item, idx) => {
      if (idx === fileList.length - 1) {
        totalHeight = fileList.reduce((accumulator, obj) => {
          return accumulator + (obj?.height ?? 0)
        }, 0)
        setResImgHeight(totalHeight)
      }
      return {
        src: item.base64str ?? '',
        x: 0,
        y: item.y,
      }
    })

    return { arr, totalHeight }
  }, [fileList])

  const initResImage = useCallback(
    async (
      imgs: {
        src: string
        x: number
        y: number
      }[],
      totalHeight: number
    ) => {
      const res = await mergeImages(imgs, {
        format: 'image/jpeg',
        quality: 1,
        height: totalHeight,
      })

      return new Promise<string>((resolve) => {
        const img = new Image() // 创建一个 image 元素
        img.src = res // 将 base64 字符串设置为图片的 src 属性值
        img.onload = () => {
          // 图片加载完成的处理逻辑，比如将图片添加到页面
          // document.body.appendChild(img) // 将图片添加到页面
          console.log('res img onload,', {
            width: img.width,
            height: img.height,
          })
          setResImgPath(img.src)
          resolve(res)
        }
      })

      //   const img = new Image() // 创建一个 image 元素
      //   img.src = res // 将 base64 字符串设置为图片的 src 属性值
      //   img.onload = () => {
      //     // 图片加载完成的处理逻辑，比如将图片添加到页面
      //     // document.body.appendChild(img) // 将图片添加到页面
      //     console.log('res img onload,', { width: img.width, height: img.height })
      //     setResImgPath(img.src)
      //   }
    },
    []
  )

  const b64toBlob = useCallback((dataurl: string) => {
    var arr = dataurl.split(',')
    var _arr = arr[1].substring(0, arr[1].length - 2)
    var mime = arr[0].match(/:(.*?);/)?.[1],
      bstr = atob(_arr),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], {
      type: mime,
    })
  }, [])
  const handleDownload = useCallback(
    (base64String: string) => {
      const blob = b64toBlob(base64String)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.setAttribute('download', `合集-${Date.now()}`)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },
    [b64toBlob]
  )

  const generateImageDownload = useCallback(async () => {
    const { arr, totalHeight } = arrImgs()
    console.log(`generateImageDownload`, arr, totalHeight)
    const base64: string = await initResImage(arr, totalHeight)
    handleDownload(base64)
  }, [arrImgs, handleDownload, initResImage])

  const clear = useCallback(() => {
    setPreviewImage('')
    setPreviewTitle('')
    setFileList([])
    setResImgPath('')
    setResImgHeight(0)
  }, [setFileList, setPreviewImage, setPreviewTitle])

  //   useEffect(() => {
  //     const { arr } = arrImgs()
  //     initResImage(arr)
  //   }, [arrImgs, initResImage])

  return {
    resImgPath,
    generateImageDownload,
    clear,
  }
}

const PictureUploader = memo(() => {
  // useImageStore
  const previewOpen = useImageStore((state) => state.previewOpen)
  const previewImage = useImageStore((state) => state.previewImage)
  const previewTitle = useImageStore((state) => state.previewTitle)
  const fileList = useImageStore((state) => state.fileList)
  const setPreviewOpen = useImageStore((state) => state.setPreviewOpen)
  const setPreviewImage = useImageStore((state) => state.setPreviewImage)
  const setPreviewTitle = useImageStore((state) => state.setPreviewTitle)
  const setFileList = useImageStore((state) => state.setFileList)
  // useLayoutUiStore
  const setShowRes = useLayoutUiStore((state) => state.setShowRes)

  const { resImgPath, generateImageDownload, clear } = useMergeImages()

  const handleCancel = () => setPreviewOpen(false)

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
    )
  }

  const handleChange = useCallback<Defined<OnChangeEvent>>(
    ({ file, fileList }) => {
      let _fileList = fileList as unknown as UploadFileWithSize[]
      const _file = file.originFileObj as unknown as File
      const url = URL.createObjectURL(_file) // 创建临时URL
      const img = new Image()
      img.src = url // 加载图片
      img.onload = async () => {
        const width = img.width // 获取图片宽度
        const height = img.height // 获取图片高度
        _fileList[_fileList.length - 1] = {
          ..._fileList[_fileList.length - 1],
          status: 'done',
          width,
          height,
          base64str: await getBase64(file.originFileObj as RcFile),
        }
        console.log(`图片宽度：${width}px，图片高度：${height}px`)
        setFileList(_fileList)
        URL.revokeObjectURL(url) // 释放临时URL
      }
    },
    [setFileList]
  )

  // 跳转到阅览页版
  //   const handleClickComplete = useCallback(() => {
  //     setShowRes(true)
  //   }, [setShowRes])

  // 直接下载版
  const handleClickComplete = useCallback(async () => {
    await generateImageDownload()
  }, [generateImageDownload])

  const handleClickClear = useCallback(async () => {
    clear()
  }, [clear])
  const customUpload = useCallback<Defined<customRequestEvent>>(({ file }) => {
    new Promise((resolve) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file as Blob)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
    })
  }, [])

  useEffect(() => {
    console.log(`filelist: `, fileList)
  }, [fileList])

  const uploadButton = (
    <div>
      <PlusOutlined
        css={css`
          color: white;
        `}
      />
      <div
        css={css`
          margin-top: 8px;
          color: white;
        `}
      >
        Upload
      </div>
    </div>
  )
  return (
    <>
      <div
        css={css`
          display: flex;
          flex: 0.3 0.3 auto;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        `}
      >
        {/* <h2
          css={css`
            margin: 20px;
            color: #f7ed68;
          `}
        >
          🌸感谢使用🌸
        </h2> */}
        <h4
          css={css`
            margin: 10px;
          `}
        >
          用用我吧！
        </h4>
        <h6
          css={css`
            margin: 5px;
            font-size: 20px;
            color: #aaa8a8;
          `}
        >
          试试我好mua...
        </h6>
        <h6
          css={css`
            font-size: 12px;
            margin: 5px;
            color: #6d6b6b;
          `}
        >
          是我不好用吗😭QwQ
        </h6>
      </div>
      <div
        css={css`
          display: flex;
          flex: 1;
        `}
      >
        <Upload
          // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          customRequest={customUpload}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
      </div>
      <div
        css={css`
          flex: 1;
        `}
      >
        {resImgPath.length > 1 && (
          <Fragment>
            <img
              src={`${process.env.PUBLIC_URL}/cheerup.png`}
              alt="congratulations"
            />
            <h2
              css={css`
                margin: 20px;
                color: #f7ed68;
                text-shadow: 3px 3px #ccc, -2px -2px #ccc, 0 0 10px #fff;
              `}
            >
              🌸感谢使用，今天你画也很棒哦🌸
            </h2>
          </Fragment>
        )}

        <Space size={10}>
          <Button onClick={handleClickComplete}>🍭 融 合 🍭</Button>
          {fileList.length > 1 && (
            <Button onClick={handleClickClear}>🚮 清 空 🚮</Button>
          )}
        </Space>
      </div>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  )
})
export default PictureUploader
