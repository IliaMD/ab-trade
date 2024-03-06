import React from 'react'
import { useForm, FormProvider, UseFormSetValue } from 'react-hook-form'
import { IForm } from '../types'
import { v4 as uuidv4 } from 'uuid'

export const defaultValues = {
  sum: 0,
  groups: [{ id: uuidv4(), sum: 0, products: [{ id: uuidv4(), name: '', sum: 0, count: 0, price: 0 }] }],
}

export const localKey = 'formData'

export const FormProviderContainer = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm<IForm>({ defaultValues })

  const { setValue, getValues } = methods

  const onSetValue: UseFormSetValue<IForm> = React.useCallback(
    (name, value: any) => {
      setValue(name, value)
      const data = getValues()
      localStorage.setItem(localKey, JSON.stringify(data))
    },
    [setValue, getValues],
  )

  return (
    <FormProvider {...methods} setValue={onSetValue}>
      {children}
    </FormProvider>
  )
}

