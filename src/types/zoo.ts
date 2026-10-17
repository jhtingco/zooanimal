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
