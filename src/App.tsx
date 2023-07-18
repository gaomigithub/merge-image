/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import React from 'react'
import './App.css'
import PictureUploader from './components/PictureUploader'

function App() {
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
        <PictureUploader />
      </div>
    </div>
  )
}

export default App
