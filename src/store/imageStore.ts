import { UploadFile } from 'antd/es/upload/interface'
import create from 'zustand'

export interface UploadFileWithSize extends UploadFile {
  width?: number
  height?: number
  base64str?: string
}

interface States {
  previewOpen: boolean
  previewImage: string
  previewTitle: string
  fileList: UploadFileWithSize[]
}
interface Actions {
  setPreviewOpen: (previewOpen: boolean) => void

  setPreviewImage: (previewImage: string) => void

  setPreviewTitle: (previewTitle: string) => void

  setFileList: (fileList: UploadFileWithSize[]) => void
}

export const useImageStore = create<States & Actions>()((set) => ({
  previewOpen: false,
  previewImage: '',
  previewTitle: '',
  fileList: [],
  setPreviewOpen: (previewOpen) => set({ previewOpen }),
  setPreviewImage: (previewImage) => set({ previewImage }),
  setPreviewTitle: (previewTitle) => set({ previewTitle }),
  setFileList: (fileList) => set({ fileList }),
}))

export default useImageStore
