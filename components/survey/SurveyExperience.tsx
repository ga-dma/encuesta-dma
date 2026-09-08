"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Info, Loader2, Mail, RotateCcw } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { saveQuizResult, updateQuizResultEmail } from "@/app/actions/save-quiz-result";
import { sendQuizEmail } from "@/app/actions/send-quiz-email";
import { categories, maturityFor, maturityLevels, questions, resultCopy, type CategoryId, type Language, type Question } from "./survey-content";

type Stage = "welcome" | "initial" | "tie" | "summary" | "deep" | "result";
const initialIds = ["MIQ1", "BIQ1", "DEQ1"];
const codes: Record<CategoryId, string> = { market: "MIQ", business: "BIQ", engineering: "DEQ" };
const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" ");

const text = {
  es: { eyebrow: "DIAGNÓSTICO DE MADUREZ DE DATOS", title: "¿Su organización aprovecha todo el potencial de sus datos?", lead: "Una evaluación de dos minutos para entender su nivel actual de madurez analítica.", preliminary: "ANÁLISIS PRELIMINAR", analyze: "Ver análisis preliminar", choose: "ELIJA SU ENFOQUE", chooseTitle: "¿Qué área desea analizar primero?", chooseLead: "Sus respuestas muestran una oportunidad similar en estas áreas.", select: "Seleccionar área", benefit: "Sus respuestas sugieren que su organización se beneficiaría más de", detail: "Las siguientes preguntas profundizan en esta necesidad.", deep: "Continuar diagnóstico", question: "Pregunta", of: "de", continue: "Continuar", result: "SU RESULTADO", resultTitle: "Su nivel actual es", score: "Puntaje promedio", means: "Qué significa", next: "Siguiente paso recomendado", restart: "Reiniciar evaluación", home: "Volver al sitio", email: "Enviarme este resultado por correo", placeholder: "Ingrese su correo electrónico", send: "Enviar resultado", sent: "Resultado enviado. Revise su correo.", error: "No fue posible enviar el resultado.", more: "Conocer más sobre una evaluación exhaustiva", moreBody: "Nuestro equipo puede acompañarle con un diagnóstico detallado y una hoja de ruta para su organización.", contact: "Contactar a DMA", other: "Evaluar las otras áreas analíticas" },
  en: { eyebrow: "DATA MATURITY ASSESSMENT", title: "Is your organization using its data to full potential?", lead: "A two-minute assessment to understand your current data maturity.", preliminary: "PRELIMINARY ANALYSIS", analyze: "View preliminary analysis", choose: "CHOOSE YOUR FOCUS", chooseTitle: "Which area would you like to assess first?", chooseLead: "Your answers show a similar opportunity across these areas.", select: "Select area", benefit: "Your responses suggest that your organization would benefit most from", detail: "The following questions dive deeper into this need.", deep: "Continue assessment", question: "Question", of: "of", continue: "Continue", result: "YOUR RESULT", resultTitle: "Your current level is", score: "Average score", means: "What it means", next: "Recommended next step", restart: "Restart assessment", home: "Back to website", email: "E-mail me this result", placeholder: "Enter your e-mail address", send: "Send result", sent: "Result sent. Check your inbox.", error: "We could not send the result.", more: "Learn about a thorough assessment", moreBody: "Our team can support a detailed diagnostic and a practical roadmap for your organization.", contact: "Contact DMA", other: "Assess the other analytical areas" },
} as const;

function Options({ question, answer, language, onSelect, compact }: { question: Question; answer?: number; language: Language; onSelect: (value: number) => void; compact?: boolean }) {
  return <div className={cx(compact ? "mt-5 grid gap-2 sm:grid-cols-2" : "mt-7 space-y-2.5")}>
    {question.options.map((option) => {
      const selected = answer === option.value;
      return <button type="button" key={option.value} onClick={() => onSelect(option.value)} className={cx("flex w-full items-center gap-3 rounded-xl border p-3 text-left transition", selected ? "border-neon-green bg-neon-green/15" : "border-deep-green/12 bg-white hover:border-deep-green/35")}>
        <span className={cx("grid h-6 w-6 shrink-0 place-items-center rounded-md border text-[11px] font-bold", selected ? "border-deep-green bg-deep-green text-white" : "border-deep-green/25 text-deep-green/55")}>{selected ? <Check className="h-3.5 w-3.5" /> : option.value}</span>
        <span className="font-fustat text-sm leading-snug text-deep-green">{option[language]}</span>
      </button>;
    })}
  </div>;
}

export default function SurveyExperience() {
  const language: Language = "es";
  const [stage, setStage] = useState<Stage>("welcome");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [initialIndex, setInitialIndex] = useState(0);
  const [deepIndex, setDeepIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const saved = useRef(false);
  const t = text[language];
  const initial = useMemo(() => questions.filter((item) => initialIds.includes(item.id)), []);
  const tied = useMemo(() => {
    if (!initial.every((item) => answers[item.id])) return [];
    const min = Math.min(...initial.map((item) => answers[item.id]));
    return initial.filter((item) => answers[item.id] === min).map((item) => item.category);
  }, [answers, initial]);
  const deep = useMemo(() => category ? questions.filter((item) => item.category === category && !initialIds.includes(item.id)) : [], [category]);
  const initialQuestion = initial[initialIndex];
  const current = deep[deepIndex];
  const score = useMemo(() => !category ? 0 : questions.filter((item) => item.category === category).reduce((sum, item) => sum + (answers[item.id] || 0), 0) / 5, [answers, category]);
  const maturity = maturityFor(score);
  const level = maturityLevels.find((item) => item.id === maturity)?.label[language] || maturity;
  const result = category ? resultCopy(category, maturity, language) : null;
  const selectCategory = (id: CategoryId) => { setCategory(id); setDeepIndex(0); setStage("summary"); };
  const restart = () => { setStage("welcome"); setAnswers({}); setCategory(null); setInitialIndex(0); setDeepIndex(0); setEmail(""); setEmailStatus("idle"); saved.current = false; };

  useEffect(() => {
    if (stage !== "result" || !category || !result || saved.current) return;
    saved.current = true;
    const code = codes[category];
    void saveQuizResult({ category_id: code.slice(0, 2), category_full_id: code, category_name: categories[category].name[language], score, maturityTitle: level, description: result.description, suggestion: result.suggestion, answers });
  }, [answers, category, language, level, result, score, stage]);

  const selectInitial = (value: number) => {
    if (!initialQuestion) return;
    const nextAnswers = { ...answers, [initialQuestion.id]: value };
    setAnswers(nextAnswers);
    window.setTimeout(() => {
      if (initialIndex < initial.length - 1) {
        setInitialIndex((index) => index + 1);
        return;
      }
      const scores = initial.map((item) => ({ category: item.category, value: nextAnswers[item.id] }));
      const minimum = Math.min(...scores.map((item) => item.value));
      const candidates = scores.filter((item) => item.value === minimum).map((item) => item.category);
      if (candidates.length === 1) selectCategory(candidates[0]);
      else setStage("tie");
    }, 220);
  };
  const selectDeep = (value: number) => {
    if (!current) return;
    setAnswers((old) => ({ ...old, [current.id]: value }));
    window.setTimeout(() => {
      if (deepIndex < 3) setDeepIndex((index) => index + 1);
      else setStage("result");
    }, 220);
  };
  const otherCategory = (id: CategoryId) => {
    const code = codes[id];
    setAnswers((old) => Object.fromEntries(Object.entries(old).filter(([key]) => !key.startsWith(code) || key === code + "1")));
    selectCategory(id); setEmailStatus("idle"); saved.current = false;
  };
  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!category || !result || !email) return;
    setEmailStatus("sending");
    const response = await sendQuizEmail(email, { maturityTitle: level, score: score.toFixed(1), category: categories[category].name[language], description: result.description, suggestion: result.suggestion });
    if (response.success) {
      setEmailStatus("sent");
      void updateQuizResultEmail(categories[category].name[language], score, email);
    } else setEmailStatus("error");
  };

  return <main className="min-h-[100svh] bg-[#fbfaf7] px-4 py-4 text-deep-green sm:px-6 sm:py-6 lg:px-10 lg:py-8">
    <div className="mx-auto max-w-[1440px]">
      <section className="relative min-h-[calc(100svh-2rem)] overflow-hidden rounded-[28px] bg-[#003830] px-5 py-7 text-white shadow-[0_24px_70px_rgba(0,56,48,0.18)] sm:rounded-[38px] sm:px-8 sm:py-9 lg:min-h-[calc(100svh-64px)] lg:px-12 lg:py-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-neon-green/15 blur-3xl" />
        <div className="relative">
          {stage === "welcome" && <div className="mx-auto flex min-h-[calc(100svh-7rem)] max-w-3xl flex-col justify-center py-6 text-center sm:min-h-[calc(100svh-10rem)] sm:py-12"><Link href="https://www.dmaanalytics.com" aria-label="DMA Analytics — Inicio" className="inline-block self-center"><Image src="/icons/DMA_simple-beige.svg" alt="DMA Analytics" width={136} height={37} priority className="h-auto w-[112px] sm:w-[136px]" /></Link><p className="mt-7 font-fustat text-[11px] font-bold tracking-[0.22em] text-neon-green sm:text-xs">DIAGNÓSTICO DE MADUREZ DE DATOS</p><h1 className="mx-auto mt-5 max-w-3xl font-bricolage text-[34px] font-semibold leading-[1] tracking-[-0.055em] sm:text-[52px]">Bienvenidos, miembros del Comité de proveedores, productores y distribuidores.</h1><p className="mx-auto mt-6 max-w-2xl font-fustat text-base leading-relaxed text-white/80 sm:text-lg">Respondan las siguientes preguntas:</p><button type="button" onClick={() => setStage("initial")} className="mt-8 inline-flex items-center gap-2 self-center rounded-full bg-neon-green px-7 py-3.5 font-fustat text-sm font-bold text-deep-green">Comenzar evaluación<ArrowRight className="h-4 w-4" /></button></div>}
          {stage === "initial" && initialQuestion && <div className="mx-auto max-w-4xl text-center">
            <p className="font-fustat text-[11px] font-bold tracking-[0.22em] text-neon-green sm:text-xs">{t.eyebrow}</p>
            <h1 className="mx-auto mt-3 max-w-3xl font-bricolage text-[32px] font-semibold leading-[1] tracking-[-0.06em] sm:text-[44px] lg:text-[48px]">{t.title}</h1>
            <p className="mt-2 font-fustat text-sm text-white/70 sm:text-base">{t.lead}</p>
            <div className="mx-auto mt-4 flex max-w-2xl items-center justify-between font-fustat text-xs font-semibold tracking-[0.14em] text-white/65"><span>{t.question} {initialIndex + 1} {t.of} 3</span><span>{categories[initialQuestion.category].name[language]}</span></div>
            <div className="mx-auto mt-3 flex max-w-2xl gap-1.5">{initial.map((item, index) => <span key={item.id} className={cx("h-1.5 flex-1 rounded-full", index <= initialIndex ? "bg-neon-green" : "bg-white/20")} />)}</div>
            <article className="mx-auto mt-5 max-w-2xl rounded-[24px] bg-[#fbfaf7] p-5 text-left text-deep-green shadow-xl sm:p-6"><p className="font-fustat text-[10px] font-bold tracking-[0.16em] text-deep-green/50">{categories[initialQuestion.category].name[language]}</p><h2 className="mt-2 font-bricolage text-[25px] font-semibold leading-[1.08] tracking-[-0.04em] sm:text-[31px]">{initialQuestion.text[language]}</h2><Options question={initialQuestion} answer={answers[initialQuestion.id]} language={language} onSelect={selectInitial} compact /></article>
          </div>}

          {stage === "tie" && <div className="mx-auto max-w-5xl py-4 text-center sm:py-10"><p className="font-fustat text-xs font-bold tracking-[0.2em] text-neon-green">{t.choose}</p><h1 className="mt-4 font-bricolage text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{t.chooseTitle}</h1><p className="mx-auto mt-4 max-w-xl font-fustat text-sm text-white/70">{t.chooseLead}</p><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{tied.map((id) => <button type="button" key={id} onClick={() => selectCategory(id)} className="group rounded-[22px] border border-white/15 bg-white/10 p-6 text-left transition hover:-translate-y-1 hover:bg-white/15"><h2 className="font-bricolage text-2xl font-semibold">{categories[id].name[language]}</h2><p className="mt-3 font-fustat text-sm leading-relaxed text-white/70">{categories[id].focus[language]}</p><span className="mt-6 inline-flex items-center gap-2 font-fustat text-sm font-bold text-neon-green">{t.select}<ChevronRight className="h-4 w-4 group-hover:translate-x-1" /></span></button>)}</div></div>}

          {stage === "summary" && category && <div className="mx-auto max-w-4xl py-4 text-center sm:py-8"><p className="font-fustat text-xs font-bold tracking-[0.2em] text-neon-green">{t.preliminary}</p><h1 className="mx-auto mt-4 max-w-3xl font-bricolage text-[38px] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-[56px]">¿Sabía que existen tres verticales del análisis de datos en una empresa?</h1><p className="mx-auto mt-4 max-w-2xl font-fustat text-sm leading-relaxed text-white/70 sm:text-base">Su respuesta indica que se beneficiaría más de:</p><div className="mx-auto mt-7 max-w-3xl rounded-[28px] border border-neon-green/40 bg-neon-green/15 px-6 py-5 text-left sm:px-8 sm:py-6"><p className="font-fustat text-[11px] font-bold tracking-[0.18em] text-neon-green">ÁREA PRIORITARIA</p><p className="mt-2 font-bricolage text-[32px] font-semibold leading-tight text-neon-green sm:text-[46px]">{categories[category].name[language]}</p></div><article className="mx-auto mt-4 max-w-3xl rounded-[22px] border border-white/15 bg-white/5 px-6 py-5 text-left sm:px-8"><p className="font-fustat text-[11px] font-bold tracking-[0.16em] text-white/50">POR QUÉ ESTA ES LA PRIORIDAD</p><p className="mt-2 font-fustat text-sm leading-relaxed text-white/80 sm:text-base">ya que {categories[category].diagnosis[language]}</p></article><div className="mx-auto mt-6 max-w-2xl border-t border-white/15 pt-6"><p className="font-fustat text-base leading-relaxed text-white/80 sm:text-lg">Profundicemos más en su situación actual, responda las siguientes cuatro (4) preguntas.</p><button type="button" onClick={() => setStage("deep")} className="mt-5 inline-flex items-center gap-2 rounded-full bg-neon-green px-6 py-3 font-fustat text-sm font-bold text-deep-green">{t.deep}<ArrowRight className="h-4 w-4" /></button></div></div>}

          {stage === "deep" && category && current && <div className="mx-auto max-w-4xl py-1 sm:py-6"><div className="flex items-center justify-between font-fustat text-xs font-semibold tracking-[0.14em] text-white/65"><span>{t.question} {deepIndex + 2} {t.of} 5</span><span>{categories[category].name[language]}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-neon-green transition-all" style={{ width: ((deepIndex + 2) / 5 * 100) + "%" }} /></div><article className="mt-7 rounded-[26px] bg-[#fbfaf7] p-6 text-deep-green shadow-2xl sm:p-9 lg:p-10"><h1 className="font-bricolage text-[30px] font-semibold leading-[1.06] tracking-[-0.045em] sm:text-[42px]">{current.text[language]}</h1><Options question={current} answer={answers[current.id]} language={language} onSelect={selectDeep} /><div className="mt-7"><button type="button" onClick={restart} className="inline-flex items-center gap-2 font-fustat text-sm font-semibold text-deep-green/55 hover:text-deep-green"><RotateCcw className="h-4 w-4" />{t.restart}</button></div></article></div>}

          {stage === "result" && category && result && <div className="mx-auto max-w-6xl py-2 sm:py-5"><p className="font-fustat text-xs font-bold tracking-[0.2em] text-neon-green">{t.result}</p><p className="mt-3 max-w-2xl font-fustat text-sm leading-relaxed text-white/70 sm:text-base">Gracias por responder, a continuación encontrará la evaluación utilizando nuestra herramienta de puntuación rápida ¿Qué le gustaría hacer?</p><div className="mt-5 grid gap-5 lg:grid-cols-[0.86fr_1.14fr] lg:gap-8"><div><p className="font-fustat text-sm text-white/65">{categories[category].name[language]}</p><h1 className="mt-3 font-bricolage text-[45px] font-semibold leading-[0.92] tracking-[-0.06em] sm:text-[60px]">{t.resultTitle}</h1><p className="mt-5 font-bricolage text-[29px] font-semibold leading-tight text-neon-green sm:text-[38px]">{level}</p><p className="mt-5 font-fustat text-sm text-white/60">{t.score}: {score.toFixed(1)} / 5</p><div className="mt-3 flex gap-1.5">{maturityLevels.map((item) => <span key={item.id} className={cx("h-2 flex-1 rounded-full", item.id === maturity ? "bg-neon-green" : "bg-white/20")} />)}</div></div><div className="space-y-4"><article className="rounded-[24px] bg-white p-6 text-deep-green sm:p-7"><p className="font-fustat text-[11px] font-bold tracking-[0.16em] text-deep-green/50">{t.means}</p><p className="mt-3 font-fustat text-base leading-relaxed">{result.description}</p></article><article className="rounded-[24px] border border-neon-green/45 bg-neon-green/10 p-6 sm:p-7"><p className="font-fustat text-[11px] font-bold tracking-[0.16em] text-neon-green">{t.next}</p><p className="mt-3 font-fustat text-base leading-relaxed text-white">{result.suggestion}</p></article></div></div>
            <div className="mt-7 grid gap-5 border-t border-white/15 pt-7 lg:grid-cols-[0.85fr_1.15fr]"><article className="rounded-[22px] border border-white/15 bg-white/5 p-5"><h2 className="font-bricolage text-2xl font-semibold">{t.more}</h2><p className="mt-3 font-fustat text-sm leading-relaxed text-white/70">{t.moreBody}</p><Link href="https://www.dmaanalytics.com/#contact" className="mt-5 inline-flex items-center gap-2 font-fustat text-sm font-bold text-neon-green">{t.contact}<ArrowRight className="h-4 w-4" /></Link></article><div className="space-y-3"><form onSubmit={send} className="rounded-[22px] border border-white/15 bg-white/5 p-5"><div className="flex items-center gap-3"><Mail className="h-5 w-5 text-neon-green" /><h2 className="font-bricolage text-xl font-semibold">{t.email}</h2></div><div className="mt-4 flex flex-col gap-2 sm:flex-row"><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t.placeholder} className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-fustat text-sm text-white placeholder:text-white/45 focus:border-neon-green focus:outline-none" /><button disabled={emailStatus === "sending"} className="inline-flex items-center justify-center gap-2 rounded-xl bg-neon-green px-5 py-3 font-fustat text-sm font-bold text-deep-green disabled:opacity-50">{emailStatus === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}{t.send}</button></div>{emailStatus === "sent" && <p className="mt-3 font-fustat text-sm text-neon-green">{t.sent}</p>}{emailStatus === "error" && <p className="mt-3 font-fustat text-sm text-red-200">{t.error}</p>}</form><article className="rounded-[22px] border border-white/15 bg-white/5 p-5"><div className="flex items-center gap-3"><Info className="h-5 w-5 text-neon-green" /><h2 className="font-bricolage text-xl font-semibold">{t.other}</h2></div><div className="mt-4 flex flex-wrap gap-2">{(Object.keys(categories) as CategoryId[]).filter((id) => id !== category).map((id) => <button key={id} type="button" onClick={() => otherCategory(id)} className="rounded-full border border-white/25 px-4 py-2 font-fustat text-sm font-semibold text-white transition hover:border-neon-green hover:bg-neon-green hover:text-deep-green">{categories[id].name[language]}</button>)}</div></article></div></div>
            <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={restart} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 font-fustat text-sm font-bold text-white hover:bg-white/10"><RotateCcw className="h-4 w-4" />{t.restart}</button><Link href="https://www.dmaanalytics.com" className="inline-flex items-center gap-2 rounded-full bg-neon-green px-5 py-3 font-fustat text-sm font-bold text-deep-green"><ArrowLeft className="h-4 w-4" />{t.home}</Link></div></div>}
        </div>
      </section>
    </div>
  </main>;
}
