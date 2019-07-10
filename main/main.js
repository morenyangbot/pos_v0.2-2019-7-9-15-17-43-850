'use strict';

const DATA_BASE = [
  {
    barcode: 'ITEM000000',
    name: '可口可乐',
    unit: '瓶',
    price: 3.00
  },
  {
    barcode: 'ITEM000001',
    name: '雪碧',
    unit: '瓶',
    price: 3.00
  },
  {
    barcode: 'ITEM000002',
    name: '苹果',
    unit: '斤',
    price: 5.50
  },
  {
    barcode: 'ITEM000003',
    name: '荔枝',
    unit: '斤',
    price: 15.00
  },
  {
    barcode: 'ITEM000004',
    name: '电池',
    unit: '个',
    price: 2.00
  },
  {
    barcode: 'ITEM000005',
    name: '方便面',
    unit: '袋',
    price: 4.50
  }
];

const isBarcodeValid = (barcode) => !!DATA_BASE.find(item => item.barcode === barcode);
const findItemInDB = (barcode) => {
  return isBarcodeValid ? DATA_BASE.find(item => item.barcode === barcode) : null
}
const setItemInSettlementItems = (barcode, settlementItems) => {
  const itemSettled = settlementItems.find(item => item.barcode === barcode);
  if (!itemSettled) {
    const itemInDB = findItemInDB(barcode);
    settlementItems.push({
      barcode,
      detail: itemInDB,
      count: itemInDB && 1,
      amount: itemInDB && itemInDB.price
    })
  } else {
    itemSettled.count += 1
    itemSettled.amount += itemSettled.detail.price
  }
}
const calculateItemsAndPrices = (barcodes) => {
  let settlementItems = [];
  let total = 0;

  barcodes.forEach(barcode => {
    setItemInSettlementItems(barcode, settlementItems)
  })
  settlementItems.forEach(item => {
    total += item.amount
  })
  return { settlementItems, total }
}

const createReceiptText = ({settlementItems, total}) =>  {
  let errorMsg = '';
  let receiptText = '***<没钱赚商店>收据***\n';
  settlementItems.forEach(item => {
    if(item.detail) {
      receiptText += `名称：${item.detail.name}，数量：${item.count}${item.detail.unit}，单价：${item.detail.price.toFixed(2)}(元)，小计：${item.amount.toFixed(2)}(元)\n`
    } else {
      errorMsg += `[Error]: Barcode ${item.barcode} is illeagal.\n`
    }
  })
  receiptText += `----------------------\n总计：${total.toFixed(2)}(元)\n**********************`
  return errorMsg + receiptText
}

const printReceipt = (inputs) => {
  console.log(createReceiptText(calculateItemsAndPrices(inputs)));
}
