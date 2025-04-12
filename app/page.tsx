// app/page.tsx

"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [startSound, setStartSound] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const sound = new Audio("/sounds/start.mp3");
    setStartSound(sound);
  }, []);

  const handleStart = () => {
    startSound?.play();
    router.push("/quiz");
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-10">
      <h1 className="text-3xl font-bold">曜日計算クイズ</h1>
      <p className="max-w-lg text-center">
        過去100年〜未来100年のランダムな日付が出題されます。
        5問をできるだけ早く解答してみましょう！
      </p>
      <button
        onClick={handleStart}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-semibold"
      >
        スタート
      </button>
    </div>
  );
}
