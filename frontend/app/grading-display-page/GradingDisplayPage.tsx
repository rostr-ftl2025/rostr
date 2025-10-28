import React from "react";

export default function GradingDisplayPage() {
  
  const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const gradeParam = search.get("grade");
  const grade = gradeParam === null ? null : (isNaN(Number(gradeParam)) ? gradeParam : Number(gradeParam));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5DBD5] text-gray-900">
      <h1 className="text-4xl font-bold mb-6">Team Grade</h1>
      <p className="text-2xl font-semibold">{grade ? grade : "N/A"}</p>
      <a href="/"
        className="mt-8 bg-[#562424] text-white px-4 py-2 rounded-xl hover:bg-[#734343]"
      >
        Back to Team Maker
      </a>
    </div>
  );
}
