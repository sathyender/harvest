"use client";
import { useFormStatus } from "react-dom";
export function SubmitButton({children,pendingText}:{children:React.ReactNode;pendingText:string}){const {pending}=useFormStatus();return <button type="submit" disabled={pending} className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{pending?pendingText:children}</button>}
