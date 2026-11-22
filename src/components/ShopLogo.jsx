"use client";

import React from "react";
import Icon from "@/lib/icons";

const SHOP_MARKS = {
  golden: { icon: "bread", background: "linear-gradient(135deg, #19678b 0%, #1fa5cd 100%)" },
  green: { icon: "leaf", background: "linear-gradient(135deg, #2f7d47 0%, #7dc142 100%)" },
  juniper: { icon: "coffee", background: "linear-gradient(135deg, #14506b 0%, #1fa5cd 100%)" },
  slice: { icon: "food", background: "linear-gradient(135deg, #19678b 0%, #14506b 100%)" },
  sweet: { icon: "cake", background: "linear-gradient(135deg, #1fa5cd 0%, #7dc142 100%)" },
  pantry: { icon: "leaf", background: "linear-gradient(135deg, #2f7d47 0%, #14506b 100%)" },
  spice: { icon: "food", background: "linear-gradient(135deg, #19678b 0%, #7dc142 100%)" },
  harvest: { icon: "leaf", background: "linear-gradient(135deg, #14506b 0%, #1fa5cd 100%)" },
};

export default function ShopLogo({ shop, className = "" }) {
  const mark = SHOP_MARKS[shop?.id] || SHOP_MARKS.golden;
  return (
    <span
      className={`shop-mark ${className}`.trim()}
      style={{ background: mark.background }}
      aria-hidden="true"
    >
      <Icon name={mark.icon} />
    </span>
  );
}
