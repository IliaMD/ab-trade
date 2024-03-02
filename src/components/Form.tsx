import React, { useEffect } from 'react'
import { Group } from './Group'
import { Box, Button, TextField } from '@mui/material'
import { v4 as uuidv4 } from 'uuid'
import { UseFormSetValue, useFieldArray, useForm } from 'react-hook-form'
import { IForm, IGroup } from '../types'
import { formatToTwoDecimals } from '../helpers'
import { useFormContext } from '../store/FormProvider'

const defaultValues = {
  sum: 0,
  groups: [{ id: uuidv4(), sum: 0, products: [{ id: uuidv4(), name: '', sum: 0, count: 0, price: 0 }] }],
}

const localKey = 'formData'

const clearLocalStorageInAllTabs = () => {
  localStorage.setItem('clearLocalStorage', Date.now() + '')
  localStorage.removeItem('clearLocalStorage')
}

export const Form = () => {
  const getLocalData = React.useMemo(() => JSON.parse(localStorage.getItem(localKey)) || defaultValues, [])

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    register,
    watch,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<IForm>({ defaultValues: getLocalData })

  const { formChanged, handleFormChange } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'groups',
  })

  const allChanges = watch()

  useEffect(() => {
    if (formChanged) {
      localStorage.setItem(localKey, JSON.stringify(allChanges))
    }
  }, [formChanged, allChanges])

  useEffect(() => {
    const updateDataFromStorage = () => {
      const localData = JSON.parse(localStorage.getItem(localKey))

      if (!isSubmitSuccessful && !formChanged) {
        reset(localData)
      }
    }

    window.addEventListener('storage', updateDataFromStorage)

    return () => {
      window.removeEventListener('storage', updateDataFromStorage)
    }
  }, [reset, isSubmitSuccessful, formChanged])

  const handleDeleteGroup = React.useCallback(
    (groupIndex: number) => {
      remove(groupIndex)

      const groups = getValues('groups')

      const totalSum = groups.reduce((acc, cur) => {
        acc += +cur.sum
        return acc
      }, 0)

      setValue('sum', formatToTwoDecimals(totalSum))
    },
    [getValues, remove, setValue],
  )

  const handleAddGroup = React.useCallback(() => {
    append({ id: uuidv4(), sum: 0, products: [] })
    handleFormChange(true)
  }, [append, handleFormChange])

  useEffect(() => {
    const handleClearEvent = (event: StorageEvent) => {
      if (event.key === 'clearLocalStorage') {
        handleFormChange(false)
        reset(defaultValues)
        localStorage.removeItem(localKey)
      }
    }

    window.addEventListener('storage', handleClearEvent)

    return () => {
      window.removeEventListener('storage', handleClearEvent)
    }
  }, [handleFormChange, reset])

  const submitForm = (data: IForm) => {
    clearLocalStorageInAllTabs()
    reset(defaultValues)
    console.log(data)
  }

  const calcTotalSum = React.useCallback(
    (value: number, index: number) => {
      const groups = getValues('groups')

      groups[index].sum = value

      const totalSum = groups.reduce((acc, cur) => {
        acc += +cur.sum
        return acc
      }, 0)

      setValue('sum', formatToTwoDecimals(totalSum))
    },
    [getValues, setValue],
  )

  const onSetValue: UseFormSetValue<IForm> = React.useCallback(
    (name, value: any) => {
      setValue(name, value)
      handleFormChange(true)
    },
    [setValue, handleFormChange],
  )

  return (
    <Box
      component={'form'}
      sx={{ display: 'flex', flexDirection: 'column', margin: '10px 10px' }}
      onSubmit={handleSubmit(submitForm)}
      onChange={() => handleFormChange(true)}
    >
      <h2>Форма</h2>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {fields.map((group: IGroup, groupIndex: number) => (
          <Box
            key={group.id}
            sx={{
              padding: '10px 10px',
              border: '1px solid black',
            }}
          >
            <h4>Группа {groupIndex + 1}</h4>
            <Group
              register={register}
              control={control}
              getValues={getValues}
              setValue={onSetValue}
              errors={{ ...errors }}
              groupIndex={groupIndex}
              calcTotalSum={calcTotalSum}
              onDeleteGroup={() => handleDeleteGroup(groupIndex)}
            />
          </Box>
        ))}
      </Box>

      <TextField
        {...register(`sum`)}
        label="Итого"
        InputProps={{
          readOnly: true,
        }}
        sx={{ my: 2 }}
      />

      <Box>
        <Button variant="contained" onClick={handleAddGroup} sx={{ mr: 2 }}>
          Добавить группу
        </Button>

        <Button variant="contained" type="submit">
          Отправить данные
        </Button>
      </Box>
    </Box>
  )
}
