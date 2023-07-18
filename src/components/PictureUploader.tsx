/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Modal, Upload } from 'antd'
import type { RcFile, UploadProps } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import useImageStore from '../store/imageStore'

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

const PictureUploader: React.FC = () => {
  const previewOpen = useImageStore((state) => state.previewOpen)
  const previewImage = useImageStore((state) => state.previewImage)
  const previewTitle = useImageStore((state) => state.previewTitle)
  const fileList = useImageStore((state) => state.fileList)
  const setPreviewOpen = useImageStore((state) => state.setPreviewOpen)
  const setPreviewImage = useImageStore((state) => state.setPreviewImage)
  const setPreviewTitle = useImageStore((state) => state.setPreviewTitle)
  const setFileList = useImageStore((state) => state.setFileList)

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

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList)

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )
  return (
    <>
      <div className="App-title">
        <h3>请使用我！</h3>
        <h3>用用我好吗！</h3>
        <h3
          css={css`
            color: lightgray;
          `}
        >
          试试我吧好吗... QwQ
        </h3>
      </div>
      <Upload
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
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
}

export default PictureUploader
