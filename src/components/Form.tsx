import React, { useEffect } from 'react'
import { Group } from './Group'
import { Box, Button, TextField } from '@mui/material'
import { v4 as uuidv4 } from 'uuid'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { IForm, IGroup } from '../types'
import { formatToTwoDecimals } from '../helpers'
import { localKey } from './FormProvider'

const clearLocalStorageInAllTabs = () => {
  localStorage.setItem('clearLocalStorage', Date.now() + '')
  localStorage.removeItem('clearLocalStorage')
}

export const Form = () => {
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    register,
    reset,
    formState: { isSubmitSuccessful },
  } = useFormContext<IForm>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'groups',
  })

  useEffect(() => {
    const updateDataFromStorage = () => {
      const localData = JSON.parse(localStorage.getItem(localKey))

      if (!localData || isSubmitSuccessful) return

      reset(localData)
    }

    window.addEventListener('storage', updateDataFromStorage)

    return () => {
      window.removeEventListener('storage', updateDataFromStorage)
    }
  }, [reset])

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem(localKey))
    reset(localData)
  }, [reset])

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
    const groups = getValues('groups')
    append({} as IGroup)
    setValue(`groups.${groups.length}`, { id: uuidv4(), sum: 0, products: [] })
  }, [append, setValue, getValues])

  useEffect(() => {
    const handleClearEvent = (event: StorageEvent) => {
      if (event.key === 'clearLocalStorage') {
        // reset(defaultValues)
        localStorage.removeItem(localKey)
      }
    }

    window.addEventListener('storage', handleClearEvent)

    return () => {
      window.removeEventListener('storage', handleClearEvent)
    }
  }, [reset])

  const submitForm = (data: IForm) => {
    clearLocalStorageInAllTabs()
    // reset(defaultValues)
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

  return (
    <Box
      component={'form'}
      sx={{ display: 'flex', flexDirection: 'column', margin: '10px 10px' }}
      onSubmit={handleSubmit(submitForm)}
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
              key={group.id}
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
        defaultValue={0}
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
