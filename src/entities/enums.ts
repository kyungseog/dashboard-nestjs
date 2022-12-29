export enum BrandType {
  consignment = '위탁',
  purchase = '매입',
  production = '자가',
}

export enum SupplierStatus {
  operating = '운영',
  withdrawal = '탈퇴',
  dropping = '강퇴',
}

export enum CommissionGrade {
  step0 = '할인율0%',
  step1 = '할인율10%미만',
  step2 = '할인율20%이하',
  step3 = '할인율30%이하',
  step4 = '할인율40%이하',
  step5 = '할인율50%이하',
  step6 = '할인율60%이하',
  step7 = '할인율70%이하',
  step8 = '할인율80%이하',
  step9 = '할인율90%이하',
  step10 = '할인율100%이하',
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
  packing = '포장비',
  delivery = '운반비',
  pg_commission = '판매수수료',
  allowance = '인건비',
  outsourcing = '외주용역비',
  rent = '임차료',
}

export enum ClaimType {
  exchange = '교환',
  return = '반품',
}

export enum CountryType {
  KR = '한국',
  JP = '일본',
  US = '미국',
  VE = '베트남',
  CN = '중국',
  ID = '인도네시아',
  IN = '인도',
  MY = '말레이시아',
}

export enum WarehouseType {
  abroad = 'US/JP',
  actual = '실재고창고',
  faulty = '불량창고',
  sample = '샘플창고',
  adjust = '재고보정창고',
  popup = '팝업창고',
  thirdparty = '외부창고',
}

export enum JapanDeliveryFeeType {
  edi = 'EDI전송료',
  delivery = '배송료',
  emergency_fee = '비상상황수수료',
  tax = '세금',
  fuel_surcharge = '유류할증료',
  redelivery = '재배송비',
  return_warehouse = '창고반송료',
  add_fee = '추가차감',
  return_korea = '한국반송료',
}

export enum OrderStatus {
  o1 = '입금대기',
  p1 = '결제완료',
  g1 = '상품준비중',
  g2 = '구매발주',
  g3 = '상품입고',
  g4 = '상품출고',
  d1 = '배송중',
  d2 = '배송완료',
  s1 = '구매확정',
  c1 = '자동취소',
  c2 = '품절취소',
  c3 = '관리자취소',
  c4 = '고객요청취소',
  f1 = '결제시도',
  f2 = '고객결제중단',
  f3 = '결제실패',
  b1 = '반품접수',
  b2 = '반품반송중',
  b3 = '반품보류',
  b4 = '반품회수완료',
  e1 = '교환접수',
  e2 = '교환반송중',
  e3 = '재배송중',
  e4 = '교환보류',
  e5 = '교환완료',
  r1 = '환불접수',
  r2 = '환불보류',
  r3 = '환불완료',
  z1 = '추가입금대기',
  z2 = '추가결제완료',
  z3 = '추가배송중',
  z4 = '추가배송완료',
  z5 = '교환추가완료',
}

export enum MarketingChannel {
  meta = '메타',
  naver = '네이버',
  kakao = '카카오',
  google = '구글',
}
