import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "전국 동물원 지도 & 가이드 | ZooSafari Korea",
  description:
    "전국의 국공립 동물원, 사파리 테마파크, 아쿠아리움, 생태체험 목장을 카카오맵과 함께 한눈에 탐색하세요. 입장료, 관람시간, 대표 동물, 길찾기 안내.",
  keywords: [
    "동물원",
    "전국 동물원",
    "카카오맵 동물원",
    "아쿠아리움",
    "사파리",
    "아이와 가볼만한곳",
    "주말 나들이",
    "서울대공원",
    "에버랜드 주토피아",
  ],
  authors: [{ name: "ZooSafari Korea" }],
  openGraph: {
    title: "전국 동물원 지도 & 가이드 | ZooSafari Korea",
    description:
      "전국의 동물원과 아쿠아리움을 카카오맵으로 쉽게 찾고 관람 정보를 확인하세요.",
    type: "website",
    locale: "ko_KR",
  },
};

export const viewport: Viewport = {
  themeColor: "#15803d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
