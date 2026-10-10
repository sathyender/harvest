"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/types/product";

type Answer = { label: string; value: string; emoji: string };

const questions: Array<{ title: string; eyebrow: string; key: "mood" | "moment" | "energy"; answers: Answer[] }> = [
  { eyebrow: "01 / your craving", title: "What sounds delicious?", key: "mood", answers: [{ label: "Sweet & juicy", value: "sweet", emoji: "✦" }, { label: "Bright & zesty", value: "citrus", emoji: "◌" }, { label: "Cool & refreshing", value: "refreshing", emoji: "≈" }] },
  { eyebrow: "02 / your moment", title: "Who is this bowl for?", key: "moment", answers: [{ label: "Just me", value: "everyday", emoji: "♡" }, { label: "A little celebration", value: "gift", emoji: "✧" }, { label: "The whole family", value: "share", emoji: "◎" }] },
  { eyebrow: "03 / your energy", title: "How should it feel?", key: "energy", answers: [{ label: "Easy and everyday", value: "easy", emoji: "☼" }, { label: "A little extraordinary", value: "special", emoji: "✺" }] },
];

export function FruitMatch({ products }: { products: Product[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const result = useMemo(() => {
    const scored = products.map((product) => {
      let score = product.inSeason ? 2 : 0;
      if (answers.mood === "sweet" && product.tasteTags.includes("Sweet")) score += 4;
      if (answers.mood === "citrus" && (product.category === "citrus" || product.tasteTags.includes("Citrusy"))) score += 5;
      if (answers.mood === "refreshing" && product.tasteTags.includes("Refreshing")) score += 4;
      if (answers.moment === "gift" && product.category === "boxes") score += 6;
      if (answers.moment === "share" && ["boxes", "melons", "everyday"].includes(product.category)) score += 3;
      if (answers.energy === "special" && (product.category === "exotic" || product.category === "boxes")) score += 3;
      return { product, score };
    });
    return scored.sort((a, b) => b.score - a.score)[0]?.product ?? products[0];
  }, [answers, products]);
  const choose = (value: string) => {
    const question = questions[step];
    setAnswers((current) => ({ ...current, [question.key]: value }));
    setStep((current) => current + 1);
  };
  const restart = () => { setAnswers({}); setStep(0); };
  const complete = step >= questions.length;
  return <section className="match-section" id="fruit-match" aria-labelledby="fruit-match-title"><div className="match-header"><span className="eyebrow">A tiny bit of magic</span><h2 id="fruit-match-title">Find your <em>fruit match.</em></h2><p>Three quick questions. One deliciously personal recommendation.</p></div>{complete ? <div className="match-result"><div className="match-result-art" aria-hidden="true">{result.category === "citrus" ? "🍊" : result.category === "mangoes" ? "🥭" : result.category === "berries" ? "🍓" : "🍍"}</div><div><span className="eyebrow">Your match is in</span><h3>{result.name}</h3><p>{result.description}</p><div className="match-actions"><Link className="button" href={`/products/${result.slug}`}>Meet your match →</Link><button type="button" onClick={restart}>Start over</button></div></div></div> : <div className="match-card"><div className="match-progress"><span style={{ width: `${(step / questions.length) * 100}%` }} /></div><div className="match-question"><span className="eyebrow">{questions[step].eyebrow}</span><h3>{questions[step].title}</h3><div className="match-options">{questions[step].answers.map((answer) => <button type="button" key={answer.value} onClick={() => choose(answer.value)}><span>{answer.emoji}</span>{answer.label}<b>↗</b></button>)}</div></div><small>Question {step + 1} of {questions.length}</small></div>}</section>;
}
