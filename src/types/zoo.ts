export type Region =
  | "전체"
  | "수도권"
  | "강원"
  | "충청"
  | "전라"
  | "경상"
  | "제주";

export type ZooCategory =
  | "all"
  | "major" // 대형 종합 동물원
  | "aquarium" // 아쿠아리움
  | "ecological" // 생태체험/사파리
  | "ranch" // 목장/체험형
  | "indoor"; // 실내 동물원

export type AnimalClass =
  | "포유류"
  | "조류"
  | "파충류"
  | "양서류"
  | "어류/해양"
  | "무척추동물";

export type EndangeredGrade =
  | "멸종위기 야생생물 I급"
  | "멸종위기 야생생물 II급"
  | "천연기념물"
  | "CITES I"
  | "CITES II"
  | "CITES III"
  | "일반보호종"
  | "관심대상";

export interface AnimalItem {
  id: string;
  name: string; // 동물 국문명 (예: 시베리아호랑이, 레서판다)
  scientificName?: string; // 학명 (예: Panthera tigris altaica)
  englishName?: string; // 영문명 (예: Siberian Tiger)
  className: AnimalClass; // 분류군 (포유류, 조류, 파충류 등)
  endangeredGrade?: EndangeredGrade; // 멸종위기 등급
  zone?: string; // 사육/전시 구역 (예: 맹수사, 유인원관, 물새장)
  highlights?: string; // 생태적 특징
  isKeyAnimal?: boolean; // 대표 동물 여부
}

export type PermitStatus =
  | "정식 허가 완료 (우수 생태기준)"
  | "허가제 전환 심사 중 (등록 유예)"
  | "권역별 거점동물원 (기후부 지정)"
  | "생태보전 연구기관";

export interface Facility {
  id: string;
  name: string;
  icon: string;
}

export interface Zoo {
  id: string;
  name: string;
  englishName: string;
  region: Exclude<Region, "전체">;
  category: Exclude<ZooCategory, "all">;
  categoryLabel: string;
  address: string;
  roadAddress?: string;
  phone: string;
  hours: string;
  closedDays?: string;
  admission: {
    adult: string;
    teen?: string;
    child: string;
    freeCondition?: string;
  };
  keyAnimals: string[];
  allAnimals?: AnimalItem[]; // 전체 보유 동물 도감 목록
  speciesCount?: number; // 총 사육 종수 (기후부 통계 기반)
  animalCount?: number; // 총 사육 개체수
  areaM2?: number; // 시설 및 사육 면적 (㎡)
  permitStatus?: PermitStatus; // 동물원수족관법 인허가 상태
  isHubZoo?: boolean; // 기후부 권역별 거점동물원 지정 여부
  habitatExConservation?: boolean; // 환경부 지정 서식지외보전기관 여부
  tags: string[];
  description: string;
  lat: number;
  lng: number;
  image: string;
  rating: number;
  reviewCount: number;
  isPublic: boolean; // 국공립 여부
  website?: string;
  facilities: string[];
}

