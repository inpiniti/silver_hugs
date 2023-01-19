import React from "react";
import Boards from "./Boards";

export default {
  title: "TEMPLATES/Boards",
  component: Boards,
};

const rows = [
  { id: 1, lastName: '주민등록증모바일확인서비스 안내', firstName: '민원봉사과', age: '2022-12-16', fullName: 165 },
  { id: 2, lastName: '유사투자자문 소비자피해 사례 안내', firstName: '경제마케팅과', age: '2022-12-16', fullName: 80 },
  { id: 3, lastName: '코로나19 격리대상자 시험목적의 외출허용 안내', firstName: '보건소', age: '2022-12-13', fullName: 108 },
  { id: 4, lastName: '공공배달앱 연말연시 이벤트 안내', firstName: '경제마케팅과', age: '2022-12-13', fullName: 243 },
  { id: 5, lastName: '2022년 제2기분 자동차세 납부안내', firstName: '세무회계과', age: '2022-12-13', fullName: 128 },
  { id: 6, lastName: '2022년 풍수해보험 안내', firstName: '건설교통과', age: '2022-12-13', fullName: 142 },
  { id: 7, lastName: '코로나19 격리대상자 시험목적의 외출허용 안내', firstName: '보건소', age: '2022-12-06', fullName: 202 },
  { id: 8, lastName: '자영업자, 소상공인의 고금리 사업자대출의 저금리 전환 신청 접수 안내', firstName: '경제마케팅과',
    age: '2022-12-05', fullName: 350 },
  { id: 9, lastName: '진도군 군단위 LPG배관망 지원사업 공급단가(2022년 12월)', firstName: '그린에너지사업과', age: '2022-12-02',
    fullName: 295 },
];

export const Default = () => <Boards
  schedule={rows}
  notice={rows}
  job={rows}
  today={rows}
  cookie={rows}
  weather={rows}
/>;