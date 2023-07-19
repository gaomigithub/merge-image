import create from 'zustand'

interface States {
  showRes: boolean
}
interface Actions {
  setShowRes: (showRes: boolean) => void
}

export const useLayoutUiStore = create<States & Actions>()((set) => ({
  showRes: false,
  setShowRes: (showRes) => set({ showRes }),
}))

export default useLayoutUiStore
