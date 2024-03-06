import React from 'react'
import { Counter } from './components/Counter'
import { Form } from './components/Form'
import { FormProviderContainer } from './components/FormProvider'

import './App.css'

function App() {
  return (
    <>
      <Counter />
      <br />
      <FormProviderContainer>
        <Form />
      </FormProviderContainer>
    </>
  )
}

export default App
