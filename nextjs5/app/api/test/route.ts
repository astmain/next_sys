import { NextRequest, NextResponse as send } from "next/server";


export async function GET(request: NextRequest) {
  const { url } = request;
  console.log("url:", url);
  return send.json({ code: 200, msg: "成功:route", result: [] });

}
