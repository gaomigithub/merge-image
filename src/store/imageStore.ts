import { UploadFile } from 'antd/es/upload/interface'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface States {
  previewOpen: boolean
  previewImage: string
  previewTitle: string
  fileList: UploadFile[]
}
interface Actions {
  setPreviewOpen: (previewOpen: boolean) => void

  setPreviewImage: (previewImage: string) => void

  setPreviewTitle: (previewTitle: string) => void

  setFileList: (fileList: UploadFile[]) => void
}

export const useImageStore = create(
  immer<States & Actions>((set) => ({
    previewOpen: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
    setPreviewOpen: (previewOpen) =>
      set((state) => {
        state.previewOpen = previewOpen
      }),
    setPreviewImage: (previewImage) =>
      set((state) => {
        state.previewImage = previewImage
      }),
    setPreviewTitle: (previewTitle) =>
      set((state) => {
        state.previewTitle = previewTitle
      }),
    setFileList: (fileList) =>
      set((state) => {
        state.fileList = fileList
      }),
  }))
)

export default useImageStore
