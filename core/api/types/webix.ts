import { TTableSortDirection } from '~/components/webix/WebixDataTable.vue';

export interface ITrend {
  date: string,
  ordersSum: number,
  orders: number,
}

export interface ITotals {
  productWbId: string,
  sellType: string,
  image: null | string,
  url: null | string,
  isNew: boolean,
  sellDays: null | number,
  lastPrice: null | string,
  lastDiscountPercent: null | number,
  positionRating: null | number,
  reviewsRating: null | number,
  lastAvailableSizes: number,
  lastTotalSizes: number,
  lastOrders: null | number,
  yesterdayOrdersSum: null | string,
  creationDate: null | string,
  lastRemains: number,
  reviewsCount: number,
  name: string,
  isFavorite: boolean,
  orders: number,
  ordersSum: number,
  loosesPercent: number,
  avgSum: number,
  loosesSum: number,
  trend: Array<ITrend>,
  categoriesCount: null | number,
  promotionsCount: null | number,
  lastSells: null | string,
  lastTotalEarning: null | string,
  remainsBeginDay: null | string,
  remainsCostBeginDay: null | string,
  costBeginDay: null | string,
  subject: null | string,
  subjectId: null | string,
  supplier: null | string,
  wbOrgNameId: null | string,
  isClient: boolean,
  userArticle: null | string,
  lastPriceYesterday: null | string,
  categoriesCountYesterday: null | number,
  promotionsCountYesterday: null | number,
  lastAvailableSizesYesterday: number,
}

export interface IFilters {
  productWbId: {
    type: string,
    value: null | string,
  },
  lastPrice: {
    type: string,
    min: null | string,
    max: null | string
  },
  lastDiscountPercent: {
    type: string,
    min: null | string,
    max: null | string
  },
  positionRating: {
    type: string,
    min: null | string,
    max: null | string
  },
  lastAvailableSizes: {
    type: string,
    min: null | string,
    max: null | string
  },
  lastTotalSizes: {
    type: string,
    min: null | string,
    max: null | string
  },
  lastOrders: {
    type: string,
    min: null | string,
    max: null | string
  },
  yesterdayOrdersSum: {
    type: string,
    min: null | string,
    max: null | string
  },
  reviewsRating: {
    type: string,
    options: Array<string>
  },
  categoriesCount: {
    type: string,
    min: null | string,
    max: null | string
  },
  promotionsCount: {
    type: string,
    min: null | string,
    max: null | string
  },
  sellType: {
    type: string,
    options: Array<string>
  },
  orders: {
    type: string,
    min: null | string,
    max: null | string
  },
  ordersSum: {
    type: string,
    min: null | string,
    max: null | string
  },
  loosesPercent: {
    type: string,
    min: null | string,
    max: null | string
  },
  avgSum: {
    type: string,
    min: null | string,
    max: null | string
  },
  loosesSum: {
    type: string,
    min: null | string,
    max: null | string
  },
  name: {
    type: string,
    value: null | string,
  },
  supplier: {
    type: string,
    options: Array<string>
  },
  subject: {
    type: string,
    options: Array<string>
  },
  reviewsCount: {
    type: string,
    min: null | string,
    max: null | string
  },
  lastRemains: {
    type: string,
    min: null | string,
    max: null | string
  },
  userArticle: {
    type: string,
    value: null | string,
  },
  lastSells: {
    type: string,
    min: null | string,
    max: null | string
  },
  lastTotalEarning: {
    type: string,
    min: null | string,
    max: null | string
  },
  remainsBeginDay: {
    type: string,
    min: null | string,
    max: null | string
  },
  remainsCostBeginDay: {
    type: string,
    min: null | string,
    max: null | string
  },
  costBeginDay: {
    type: string,
    min: null | string,
    max: null | string
  }
}

export interface IWebixRequest {
    filters: null,
    checkDate: string,
    periodDays: number,
    trendType: string,
    draw: number,
    start: number,
    length: number,
    orderBy: string,
    orderDirection: string,
}

export interface IWebixTableItem {
  productWbId: string,
  sellType: string,
  positionNumber: null | number,
  positionNumberChange: null | number,
  image: string,
  url: string,
  isNew: boolean,
  sellDays: number,
  lastPrice: number,
  lastDiscountPercent: number,
  positionRating: number,
  reviewsRating: number,
  lastAvailableSizes: number,
  lastTotalSizes: number,
  lastOrders: number,
  yesterdayOrdersSum: number,
  creationDate: null | string,
  lastRemains: number,
  reviewsCount: number,
  name: string,
  isFavorite: boolean,
  orders: number,
  ordersSum: number,
  loosesPercent: number,
  avgSum: number,
  loosesSum: number,
  trend: Array<ITrend>,
  categoriesCount: number,
  promotionsCount: number,
  lastSells: number,
  lastTotalEarning: number,
  remainsBeginDay: number,
  remainsCostBeginDay: number,
  costBeginDay: number,
  subject: string,
  subjectId: number,
  supplier: string,
  wbOrgNameId: string,
  isClient: boolean,
  userArticle: string,
  lastPriceYesterday: number,
  categoriesCountYesterday: number,
  promotionsCountYesterday: number,
  lastAvailableSizesYesterday: number,
}

export type TWebixTableItemsArray = Array<IWebixTableItem>

export type TTableItemFavorite = 'f' | 'n'

export interface ITableFetchOptions {
  favorites: TTableItemFavorite,
  search: string,
  searchFields: Array<keyof IWebixTableItem>,
  sortField: keyof IWebixTableItem,
  sortDirection: TTableSortDirection
}
