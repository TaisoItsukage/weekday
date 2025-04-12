"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// 曜日配列
const WEEKDAYS_JA = ["日", "月", "火", "水", "木", "金", "土"];

// 過去100年〜未来100年の間でランダムな日付を生成する関数
function getRandomDate(): Date {
  const now = new Date();
  // 過去100年分と未来100年分をミリ秒換算（おおよそで計算）
  const oneYearMs = 365.25 * 24 * 60 * 60 * 1000;
  const pastMs = now.getTime() - 100 * oneYearMs;
  const futureMs = now.getTime() + 100 * oneYearMs;
  const randomMs = Math.random() * (futureMs - pastMs) + pastMs;
  return new Date(randomMs);
}

// 日付を YYYY/MM/DD に変換するヘルパー
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}/${m}/${d}`;
}

export default function QuizPage() {
  const router = useRouter();
  const [quizDates, setQuizDates] = useState<Date[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]); // ユーザーの回答
  const [finished, setFinished] = useState(false);

  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (finished) return; // 終了後は計測停止

    const timerId = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [finished]);

  // ページ初期表示時に5問の日付を生成
  useEffect(() => {
    const dates = Array.from({ length: 5 }, () => getRandomDate());
    setQuizDates(dates);
  }, []);

  // 回答ハンドラ
  const handleAnswer = (answer: string) => {
    // 正解かどうかを判定
    const currentDate = quizDates[currentIndex];
    const correctIndex = currentDate.getDay();
    const correctAnswer = WEEKDAYS_JA[correctIndex];
    const isCorrect = answer === correctAnswer;

    // 毎回新しく生成する
    if (isCorrect) {
      const maruSound = new Audio("/sounds/maru.mp3");
      maruSound.currentTime = 0;
      maruSound.play();
    } else {
      const batsuSound = new Audio("/sounds/batsu.mp3");
      batsuSound.currentTime = 0;
      batsuSound.play();
    }

    // ユーザー回答を保存
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentIndex] = answer;
      return newAnswers;
    });

    // 次の問題へ、またはクイズ終了
    if (currentIndex < quizDates.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  // 結果を計算する関数
  const calculateResult = () => {
    return quizDates.map((date, idx) => {
      const correctIndex = date.getDay();
      const correctAnswer = WEEKDAYS_JA[correctIndex];
      const userAnswer = answers[idx];
      const isCorrect = correctAnswer === userAnswer;
      return {
        date: formatDate(date),
        correctAnswer,
        userAnswer,
        isCorrect,
      };
    });
  };

  // ローディング
  if (quizDates.length === 0) {
    return <div className="text-center mt-10">問題を準備中です...</div>;
  }

  // 終了時の結果画面
  if (finished) {
    const results = calculateResult();
    const correctCount = results.filter((r) => r.isCorrect).length;

    return (
      <div className="max-w-2xl mx-auto mt-10 space-y-4">
        <h2 className="text-2xl font-bold text-center mb-4">結果発表！</h2>
        <p className="text-center">
          {correctCount} / {quizDates.length} 問正解
        </p>
        <div className="border border-gray-700 rounded p-4 space-y-2">
          {results.map((r, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-gray-800 p-2 rounded"
            >
              <span>
                {idx + 1}. {r.date}
              </span>
              <span
                className={`font-bold ${
                  r.isCorrect ? "text-green-400" : "text-red-400"
                }`}
              >
                あなた: {r.userAnswer ?? "未回答"} | 正解: {r.correctAnswer}
              </span>
            </div>
          ))}
        </div>
        <button
          className="block mx-auto mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-semibold"
          onClick={() => router.push("/")}
        >
          ホームに戻る
        </button>
      </div>
    );
  }

  // 出題中のUI
  const currentDate = quizDates[currentIndex];
  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          問題 {currentIndex + 1} / {quizDates.length}
        </h2>
        <span className="text-red-400 font-bold">
          経過時間: {elapsedTime}秒
        </span>
      </div>
      <div className="p-6 bg-gray-800 rounded text-center">
        <p className="text-lg mb-4">この日付の曜日は？</p>
        <p className="text-2xl font-bold">{formatDate(currentDate)}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {WEEKDAYS_JA.map((day) => (
          <button
            key={day}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-semibold"
            onClick={() => handleAnswer(day)}
          >
            {day}曜日
          </button>
        ))}
      </div>
    </div>
  );
}
