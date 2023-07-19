/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import React from 'react'
import './App.css'
import PictureUploader from './components/PictureUploader'
import { ResultPage } from './components/ResultPage'
import useLayoutUiStore from './store/layoutUiStore'

function App() {
  // useLayoutUiStore
  const showRes = useLayoutUiStore((state) => state.showRes)
  return (
    <div className="App">
      <div
        className="App-header"
        css={css`
          display: flex;
          flex: 1;
          flex-direction: column;
        `}
      >
        <h1
          css={css`
            margin-bottom: 0;
            color: #f7ed68;
            text-shadow: 3px 3px #ccc, -2px -2px #ccc, 0 0 10px #fff;
          `}
        >
          郭奕杉专享拼图小工具
        </h1>
        <h6
          css={css`
            font-size: 14px;
            margin-top: 0;
          `}
        >
          Version 1.1, updated on 2023/07/20
        </h6>
        {showRes === false ? <PictureUploader /> : <ResultPage />}
      </div>
    </div>
  )
}

export default App
