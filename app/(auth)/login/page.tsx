import { LoginForm } from "@/components/auth/LoginForm";
export default function LoginPage({searchParams}:{searchParams:{callbackUrl?:string}}){return <><h1 className="font-serif text-3xl font-semibold">Welcome back</h1><p className="mt-2 text-sm text-neutral-600">Sign in to continue shopping.</p><div className="mt-8"><LoginForm callbackUrl={searchParams.callbackUrl}/></div></>}
