import { Metadata } from "next";

export const metadata: Metadata = {
  title: "我是chat",
  description: "描述:我们聊天吧",
};

export default function chat() {
  return <div className="bg-blue-500">chat</div>;
}
