import React, { createContext, useState, useContext } from 'react'

type FormChangedType = {
  formChanged: boolean
  handleFormChange: (changed: boolean) => void
}

const FormContext = createContext<FormChangedType>(null)

export const useFormContext = () => useContext(FormContext)

const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [formChanged, setFormChanged] = useState(false)

  const handleFormChange = (changed: boolean) => {
    setFormChanged(changed)
  }

  return <FormContext.Provider value={{ formChanged, handleFormChange }}>{children}</FormContext.Provider>
}

export default FormProvider

