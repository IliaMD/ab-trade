import React from 'react'
import { Box, TextField, Button } from '@mui/material'
import { useFormContext } from 'react-hook-form'

type ProductProps = {
  groupIndex: number
  productIndex: number
  calcProductSum: (value: number, field: 'count' | 'price', groupIndex: number, productIndex: number) => void
  onDeleteProduct: () => void
}

export const Product = React.memo(({ groupIndex, productIndex, calcProductSum, onDeleteProduct }: ProductProps) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext()

  return (
    <Box sx={{ display: 'flex', gap: '10px' }}>
      <TextField
        label="Название"
        {...register(`groups.${groupIndex}.products.${productIndex}.name`, {
          validate: (value, formValues) => {
            const products = formValues.groups[groupIndex]?.products
            const otherProductNames = products
              .filter((pr, index) => index !== productIndex)
              .map(pr => pr.name)
              .filter(pr => !!pr)
            return !otherProductNames.includes(value) || 'Имя должно быть уникальным'
          },
        })}
        error={!!errors.groups?.[groupIndex]?.products?.[productIndex]?.name}
        helperText={errors.groups?.[groupIndex]?.products?.[productIndex]?.name?.message}
        onChange={e => setValue(`groups.${groupIndex}.products.${productIndex}.name`, e.target.value)}
        sx={{ flex: 1 }}
      />

      <TextField
        {...register(`groups.${groupIndex}.products.${productIndex}.price`)}
        label="Цена"
        type="number"
        inputProps={{ min: '0' }}
        onChange={e => calcProductSum(+e.target.value, 'price', groupIndex, productIndex)}
        sx={{ flex: 1 }}
      />

      <TextField
        {...register(`groups.${groupIndex}.products.${productIndex}.count`)}
        label="Кол-во"
        type="number"
        inputProps={{ min: '0' }}
        onChange={e => calcProductSum(+e.target.value, 'count', groupIndex, productIndex)}
        sx={{ flex: 1 }}
      />

      <TextField
        {...register(`groups.${groupIndex}.products.${productIndex}.sum`)}
        label="Сумма"
        type="number"
        InputProps={{
          readOnly: true,
        }}
        sx={{ flex: 1 }}
      />

      <Button variant="contained" color="error" onClick={onDeleteProduct}>
        Удалить
      </Button>
    </Box>
  )
})
