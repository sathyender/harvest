import { logoutAction } from "@/actions/auth";
export function LogoutButton(){return <form action={logoutAction}><button type="submit" className="text-sm font-medium text-emerald-700 hover:underline">Log out</button></form>}
