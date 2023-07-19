/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import React, { memo, useCallback, useEffect } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Modal, Upload } from 'antd'
import type { RcFile, UploadProps } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import useImageStore, { UploadFileWithSize } from '../store/imageStore'
import useLayoutUiStore from '../store/layoutUiStore'

type EventProps = Pick<UploadProps, 'onChange'>
type OnChangeEvent = EventProps['onChange']

type Defined<T> = Exclude<T, undefined>

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

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
      console.log({ file, url: file.url, fileList })

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

  const handleClickComplete = useCallback(() => {
    console.log('handleClickComplete', fileList)

    setShowRes(true)
  }, [fileList, setShowRes])

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
        <h2
          css={css`
            margin: 20px;
            color: #f7ed68;
          `}
        >
          🌸感谢使用🌸
        </h2>
        <h4
          css={css`
            margin: 10px;
          `}
        >
          用用我好吗！
        </h4>
        <h6
          css={css`
            margin: 5px;
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
          是我不好用吗 QwQ
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
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
      </div>
      <div
        css={css`
          flex: 1;
        `}
      >
        <Button onClick={handleClickComplete}>🍭 融 合 🍭</Button>
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
