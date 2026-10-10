"use client";

import { useId, useState } from "react";

export function PasswordField({ name, label, error, required }: { name: string; label: string; error?: string; required?: boolean }) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  return <div className="space-y-1.5"><label htmlFor={id} className="block text-sm font-medium">{label}</label><div className="relative"><input id={id} name={name} type={visible ? "text" : "password"} required={required} aria-invalid={!!error} className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 pr-20 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 ${error ? "border-red-400" : "border-neutral-300"}`} /><button type="button" onClick={() => setVisible((value) => !value)} className="absolute inset-y-0 right-3 text-xs font-medium text-emerald-700" aria-label={visible ? "Hide password" : "Show password"}>{visible ? "Hide" : "Show"}</button></div>{error ? <p className="text-xs text-red-600">{error}</p> : null}</div>;
}
