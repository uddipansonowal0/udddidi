import React from "react";

export default function BackgroundDecoration() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" id="background-decoration">
      {/* Radial Spot highlights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px]" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]" />
      <div className="absolute top-[40%] left-[30%] w-[35%] h-[35%] rounded-full bg-blue-500/3 blur-[120px]" />

      {/* Modern thin lined grid backdrop */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
    </div>
  );
}
