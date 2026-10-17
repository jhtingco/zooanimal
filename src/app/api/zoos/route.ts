import { NextRequest, NextResponse } from "next/server";
import { ZOOS_DATA } from "@/data/zoos";
import { Region, ZooCategory } from "@/types/zoo";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") as Region | null;
  const category = searchParams.get("category") as ZooCategory | null;
  const query = searchParams.get("q")?.toLowerCase();

  let filtered = [...ZOOS_DATA];

  if (region && region !== "전체") {
    filtered = filtered.filter((z) => z.region === region);
  }

  if (category && category !== "all") {
    filtered = filtered.filter((z) => z.category === category);
  }

  if (query) {
    filtered = filtered.filter(
      (z) =>
        z.name.toLowerCase().includes(query) ||
        z.address.toLowerCase().includes(query) ||
        z.keyAnimals.some((a) => a.toLowerCase().includes(query)) ||
        z.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  return NextResponse.json({
    total: filtered.length,
    zoos: filtered,
  });
}
