export enum BrandType {
  consignment = 'consignment', //위탁
  purchase = 'purchase', //매입
  production = 'production', //자가
}

export enum SupplierStatus {
  operating = 'operating', //운영
  withdrawal = 'withdrawal', //탈퇴
  dropping = 'dropping', //강퇴
}

export enum CommissionGrade {
  step0 = 'step0', //할인율0%
  step1 = 'step1', //할인율10%미만
  step2 = 'step2', //할인율20%이하
  step3 = 'step3', //할인율30%이하
  step4 = 'step4', //할인율40%이하
  step5 = 'step5', //할인율50%이하
  step6 = 'step6', //할인율60%이하
  step7 = 'step7', //할인율70%이하
  step8 = 'step8', //할인율80%이하
  step9 = 'step9', //할인율90%이하
  step10 = 'step10', //할인율100%이하
}

export enum TaxType {
  t = 't', //과세
  f = 'f', //면세
}

export enum AgeType {
  baby = 'baby', //베이비
  kids = 'kids', //키즈
  junior = 'junior', //주니어
}

export enum CouponType {
  product = 'product', //상품쿠폰
  order = 'order', //주문서쿠폰
}

export enum SquadType {
  plannig_squad = '기획SQ',
  consignment_squad = '위탁SQ',
  strategic_squad = '전략카테고리SQ',
  buying_squad = '매입SQ',
  essential_squad = '무무즈에센셜SQ',
}

export enum CostType {
  packing = 'packing', //포장비
  delivery = 'delivery', //운반비
  pg_commission = 'pg_commission', //판매수수료
  allowance = 'allowance', //인건비
  outsourcing = 'outsourcing', //외주용역비
  rent = 'rent', //임차료
}

export enum ClaimType {
  exchange = 'exchange', //교환
  return = 'return', //반품
}

export enum CountryType {
  KR = 'KR', //한국
  JP = 'JP', //일본
  US = 'US', //미국
  VE = 'VE', //베트남
  CN = 'CN', //중국
  ID = 'ID', //인도네시아
  IN = 'IN', //인도
  MY = 'MY', //말레이시아
}

export enum WarehouseType {
  abroad = 'abroad', //US/JP
  actual = 'actual', //실재고창고
  faulty = 'faulty', //불량창고
  sample = 'sample', //샘플창고
  adjust = 'adjust', //재고보정창고
  popup = 'popup', //팝업창고
  thirdparty = 'thirdparty', //외부창고
}

export enum JapanDeliveryFeeType {
  edi = 'edi', //EDI전송료
  delivery = 'delivery', //배송료
  emergency_fee = 'emergency_fee', //비상상황수수료
  tax = 'tax', //세금
  fuel_surcharge = 'fuel_surcharge', //유류할증료
  redelivery = 'redelivery', //재배송비
  return_warehouse = 'return_warehouse', //창고반송료
  add_fee = 'add_fee', //추가차감
  return_korea = 'return_korea', //한국반송료
}

export enum Account {
  marketing = 'marketing',
  logistic = 'logistic',
}
