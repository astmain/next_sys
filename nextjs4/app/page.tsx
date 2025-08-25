"use client";
import { Button, Modal, Form, Input, Checkbox } from "@arco-design/web-react";
import { axios_api } from "./axios_api";
import { useSnapshot, proxy } from "valtio";
import Main from "@/pages/Main";
import Flow from "@/pages/Flow";



export const BUS = proxy({
  count: 0,
  user: {
    name: "xupeng",
    tel: "15160315110",
    password: "123456",
  },
});

export default function Home() {
  const snap = useSnapshot(BUS);
  console.log(snap);
  return (
    <div className="flex flex-col gap-2">
      <div>https://arco.design/react/components/button</div>
      <div style={{ display: "none" }}>tel: {JSON.stringify(snap)}</div>

      <Button
        type="primary"
        className="w-[120px]"
        onClick={async () => (BUS.count += 1)}
      >
        add_count: {BUS.count}
      </Button>

      <div className="flex  gap-2">
        <Button
          type="primary"
          onClick={async () => {
            const res = await axios_api.get("/user");
            console.log(res);
          }}
        >
          get_user
        </Button>
        <Button
          type="primary"
          onClick={async () => {
            const res = await axios_api.post("/user");
            console.log(res);
          }}
        >
          post_user
        </Button>
      </div>
      <Main />
      <Flow />
    </div>
  );
}
