import React from 'react'
import { Counter } from './components/Counter'
import { Form } from './components/Form'
import FormProvider from './store/FormProvider'

import './App.css'

function App() {
  return (
    <>
      <Counter />
      <br />
      <FormProvider>
        <Form />
      </FormProvider>
    </>
  )
}

export default App
