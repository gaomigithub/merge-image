/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { memo, useCallback, useEffect, useState } from 'react'
import mergeImages from 'merge-images'
import useImageStore, { UploadFileWithSize } from '../store/imageStore'
import useLayoutUiStore from '../store/layoutUiStore'
import { Button } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

export const ResultPage = memo((props: any) => {
  const setShowRes = useLayoutUiStore((state) => state.setShowRes)
  // useImageStore
  const fileList = useImageStore((state) => state.fileList)
  const setPreviewImage = useImageStore((state) => state.setPreviewImage)
  const setPreviewTitle = useImageStore((state) => state.setPreviewTitle)
  const setFileList = useImageStore((state) => state.setFileList)

  const [resImgPath, setResImgPath] = useState('')
  const [resImgHeight, setResImgHeight] = useState(0)

  const handleClickBack = useCallback(() => {
    setShowRes(false)
    setResImgPath('')
    setPreviewImage('')
    setPreviewTitle('')
    setFileList([])
  }, [setFileList, setPreviewImage, setPreviewTitle, setShowRes])

  const arrImgs = useCallback(() => {
    let totalHeight = 0
    // fileList.map((item, idx) => {
    //   if (idx === fileList.length - 1) {
    //     totalHeight = fileList.reduce((accumulator, obj) => {
    //       return accumulator + (obj?.height ?? 0)
    //     }, 0)
    //     setResImgHeight(totalHeight)
    //   }
    // })

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

    return { arr }
  }, [fileList])

  const initResImage = useCallback(
    async (
      imgs: {
        src: string
        x: number
        y: number
      }[]
    ) => {
      const res = await mergeImages(imgs, {
        format: 'image/jpg',
        quality: 1,
        height: resImgHeight,
      })

      const img = new Image() // 创建一个 image 元素
      img.src = res // 将 base64 字符串设置为图片的 src 属性值
      img.onload = () => {
        // 图片加载完成的处理逻辑，比如将图片添加到页面
        // document.body.appendChild(img) // 将图片添加到页面
        console.log('res img onload,', { width: img.width, height: img.height })
        setResImgPath(img.src)
      }
    },
    [resImgHeight]
  )

  useEffect(() => {
    const { arr } = arrImgs()
    console.log(1111111, resImgHeight)
    initResImage(arr)
  }, [arrImgs, initResImage, resImgHeight])

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        flex: 1;
        align-items: center;
        max-width: 80%;
        min-height: 0px;
      `}
    >
      <Button onClick={handleClickBack}>返 回</Button>

      {resImgPath.length > 0 ? (
        <img src={resImgPath} alt="res-output-img" />
      ) : (
        <div
          css={css`
            margin-top: 100px;
          `}
        >
          <LoadingOutlined />
        </div>
      )}
    </div>
  )
})
