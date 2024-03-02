export interface IProduct {
  id: string | number
  name: string
  sum: number
  count: number
  price: number
}

export interface IGroup {
  id: string | number
  sum: number
  products: IProduct[]
}

export interface IForm {
  sum: number
  groups: IGroup[]
}
