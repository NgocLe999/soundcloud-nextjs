import type { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  //   return new Response("This is a new API route");
  // method GET auto
  const url = new URL(request.url);
  //   console.log("check url", url);
  const searchParams = new URLSearchParams(url.search);
  //   console.log("check searchParams", searchParams);
  const fileName = searchParams.get("audio");
  //   console.log("check fileName", fileName);
  return await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${fileName}`
  ); // chọc tới backend
}
