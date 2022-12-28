export enum BrandType {
  consignment = '위탁',
  purchase = '매입',
  production = '자가',
}

export enum CommissionGrade {
  step0 = '',
  step1 = '',
  step2 = '',
  step3 = '',
  step4 = '',
  step5 = '',
  step6 = '',
  step7 = '',
  step8 = '',
  step9 = '',
  step10 = '',
}

export enum TaxType {
  taxation = '과세',
  taxfree = '면세',
}

export enum AgeType {
  baby = '베이비',
  kids = '키즈',
  junior = '주니어',
}

export enum CouponType {
  product = '상품쿠폰',
  order = '주문서쿠폰',
}

export enum CostType {
  allowance = '인건비',
  packing = '포장비',
  outsourcing = '외주용역비',
  rent = '임차료',
}

export enum ClaimType {
  exchange = '교환',
  return = '반품',
}

export enum CountryType {
  kr = '한국',
  jp = '일본',
  vt = '베트남',
  cn = '중국',
  in = '인도네시아',
}

export enum WarehouseType {
  abroad = '해외창고',
  actual = '실재고창고',
  faulty = '불량창고',
  sample = '샘플창고',
  adjust = '재고조정창고',
  popup = '팝업창고',
  thirdparty = '외부창고',
}

export enum JapanDeliveryFeeType {
  edi = 'edi',
  delivery = '배송료',
  emergency_fee = '긴급',
  tax = '관세',
  fuel_surcharge = '유료할증료',
  redelivery = '재배송비',
  return_warehouse = '반품창고료',
  add_fee = '',
  return_korea = '',
}
