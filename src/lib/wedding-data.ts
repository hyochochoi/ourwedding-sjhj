export const WEDDING = {
  groom: { name: "이상진", father: "이승학", mother: "박영미" },
  bride: { name: "최효정", father: "최진혁", mother: "정대영" },
  /** 2027년 3월 14일 13:00 (KST) */
  dateISO: "2027-03-14T13:00:00+09:00",
  dateLabel: "2027년 3월 14일 일요일 오후 1시",
  venue: "일산 웨스턴빌리프",
  hall: "9층 그랜드홀",
  address: "경기도 고양시 일산동구 정발산로 24 웨스턴타워 3차 9층",
  addressShort: "정발산로 24 웨스턴타워 3차 9층",
  lat: 37.6584,
  lng: 126.7747,
} as const;

export type Contact = {
  relation: string;
  name: string;
  phone: string;
};

export const GROOM_CONTACTS: Contact[] = [
  { relation: "신랑", name: "이상진", phone: "010-0000-0000" },
  { relation: "신랑 아버지", name: "이승학", phone: "010-0000-0000" },
  { relation: "신랑 어머니", name: "박영미", phone: "010-0000-0000" },
];

export const BRIDE_CONTACTS: Contact[] = [
  { relation: "신부", name: "최효정", phone: "010-0000-0000" },
  { relation: "신부 아버지", name: "최진혁", phone: "010-0000-0000" },
  { relation: "신부 어머니", name: "정대영", phone: "010-0000-0000" },
];

export type Account = {
  relation: string;
  name: string;
  bank: string;
  number: string;
  kakaopay?: string;
  toss?: string;
};

export const GROOM_ACCOUNTS: Account[] = [
  { relation: "신랑", name: "이상진", bank: "은행 준비중", number: "" },
  { relation: "신랑 아버지", name: "이승학", bank: "은행 준비중", number: "" },
  { relation: "신랑 어머니", name: "박영미", bank: "은행 준비중", number: "" },
];

export const BRIDE_ACCOUNTS: Account[] = [
  { relation: "신부", name: "최효정", bank: "신한은행", number: "11053" },
  { relation: "신부 아버지", name: "최진혁", bank: "은행 준비중", number: "" },
  { relation: "신부 어머니", name: "정대영", bank: "은행 준비중", number: "" },
];

/** 하객 사진 업로드용 구글 드라이브 폴더 링크 (받는 즉시 교체) */
export const GUEST_PHOTO_UPLOAD_URL = "";

/** 배경 음악 파일 주소 (전달받으면 교체) */
export const MUSIC_URL = "";

export const FAQS: { q: string; a: string }[] = [
  {
    q: "주차는 어디에 하나요?",
    a: "웨스턴타워 3차 B동 지하주차장을 이용해 주세요. 예식 당일 2시간 무료 주차가 지원되며, 안내데스크에서 주차권을 받으실 수 있습니다.",
  },
  {
    q: "식사는 어디에서 하나요?",
    a: "예식 후 같은 층 연회장에서 뷔페로 준비되어 있습니다. 식권은 입장 시 안내해 드립니다.",
  },
  {
    q: "아이와 함께 가도 되나요?",
    a: "물론입니다. 유아용 의자와 수유실이 마련되어 있으니 편하게 오셔도 좋습니다.",
  },
  {
    q: "축의금은 어떻게 전달하나요?",
    a: "현장 접수대에서 받고 있으며, 참석이 어려우신 분은 사이트의 마음 전하실 곳에서 계좌 복사나 간편송금을 이용하실 수 있습니다.",
  },
  {
    q: "사진은 언제 받을 수 있나요?",
    a: "예식 후 약 3~4주 뒤 본식 사진이 정리되며, 이 사이트를 통해 다시 안내드릴 예정입니다.",
  },
];
