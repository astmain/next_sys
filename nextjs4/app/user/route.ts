import { NextRequest, NextResponse as send } from "next/server";
import { db } from "@/prisma";

export async function GET(request: NextRequest) {
  const { url } = request;
  console.log("url:", url);

  const user = await db.tb_user.findMany();
  console.log("user:", user);

  return send.json({ code: 200, msg: "成功:route", result: user });
  //   http://127.0.0.1:60001/user
}

export async function POST(request: NextRequest) {
  const { url } = request;
  console.log("url:", url);

  const user = await db.tb_user.create({
    data: {
      name: "xupeng",
    },
  });
  console.log("user:", user);

  return send.json({ code: 200, msg: "成功:route", result: user });
}
