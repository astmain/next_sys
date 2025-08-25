'use client'

import { Dispatch, createContext, SetStateAction, useState, ReactNode, useMemo, useContext } from 'react'

type State = {
  displayNavigation: boolean
}

type AppContextProps = {
  state: State
  setState: Dispatch<SetStateAction<State>>
}

const AppContext = createContext<AppContextProps>(null!)


export function useAppContext() {
  return useContext(AppContext)     
}

export default function AppContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({ displayNavigation: true })

  const  [ test, setTest]  = useState(false)
  // console.log("AppContextProvider---rendered",test)

  const contextValue = useMemo(() => ({ state, setState }), [state, setState])

  return <AppContext.Provider value={contextValue}>
    {/* <button onClick={() => setTest((v)=>!v)}>test</button> */}
    
    
    {children}</AppContext.Provider>
}
