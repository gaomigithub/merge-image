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
        <h1>郭郭专用拼图小工具 Ver1.0</h1>
        {showRes === false ? <PictureUploader /> : <ResultPage />}
      </div>
    </div>
  )
}

export default App
