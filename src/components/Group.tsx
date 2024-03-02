import React from 'react'
import { Box, Button, TextField } from '@mui/material'
import { Product } from './Product'
import { IForm, IProduct } from '../types'
import { v4 as uuidv4 } from 'uuid'
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  useFieldArray,
} from 'react-hook-form'
import { formatToTwoDecimals } from '../helpers'
import { useFormContext } from '../store/FormProvider'

type GroupProps = {
  control: Control<IForm>
  register: UseFormRegister<IForm>
  setValue: UseFormSetValue<IForm>
  getValues: UseFormGetValues<IForm>
  errors: FieldErrors<IForm>
  groupIndex: number
  calcTotalSum: (value: number, index: number) => void
  onDeleteGroup: () => void
}

export const Group = ({
  control,
  register,
  setValue,
  getValues,
  errors,
  groupIndex,
  calcTotalSum,
  onDeleteGroup,
}: GroupProps) => {
  const { handleFormChange } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: `groups.${groupIndex}.products`,
  })

  const handleAddProduct = React.useCallback(() => {
    append({ id: uuidv4(), name: '', sum: 0, count: 0, price: 0 })
    handleFormChange(true)
  }, [append, handleFormChange])

  const calcGroupSum = React.useCallback(
    (groupIndex: number, products: IProduct[]): number => {
      const groupSum = products.reduce((acc, curr) => acc + curr.count * curr.price, 0)
      setValue(`groups.${groupIndex}.sum`, formatToTwoDecimals(groupSum))

      return groupSum
    },
    [setValue],
  )

  const handleDeleteProduct = React.useCallback(
    (index: number) => {
      remove(index)

      const products = getValues(`groups.${groupIndex}.products`)
      const groupSum = calcGroupSum(groupIndex, products)

      calcTotalSum(groupSum, groupIndex)
    },
    [calcGroupSum, remove, getValues, calcTotalSum, groupIndex],
  )

  const calcProductSum = React.useCallback(
    (value: number, field: 'count' | 'price', groupIndex: number, productIndex: number) => {
      const products = getValues(`groups.${groupIndex}.products`)
      products[productIndex][`${field}`] = formatToTwoDecimals(value)
      products[productIndex].sum = formatToTwoDecimals(products[productIndex].count * products[productIndex].price)

      setValue(`groups.${groupIndex}.products.${productIndex}`, products[productIndex])

      const groupSum = calcGroupSum(groupIndex, products)

      calcTotalSum(groupSum, groupIndex)
    },
    [calcTotalSum, calcGroupSum, setValue, getValues],
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <TextField
        {...register(`groups.${groupIndex}.sum`)}
        label="Сумма группы"
        onChange={e => calcTotalSum(+e.target.value, groupIndex)}
        InputProps={{
          readOnly: true,
        }}
      />
      <Box>
        <Button variant="contained" color="error" onClick={onDeleteGroup}>
          Удалить группу
        </Button>
      </Box>

      {fields.map((product, productIndex) => (
        <Product
          key={product.id}
          register={register}
          errors={{ ...errors }}
          productIndex={productIndex}
          groupIndex={groupIndex}
          onDeleteProduct={() => handleDeleteProduct(productIndex)}
          calcProductSum={calcProductSum}
        />
      ))}

      <Box>
        <Button variant="contained" onClick={handleAddProduct}>
          Добавить продукт
        </Button>
      </Box>
    </Box>
  )
}
