export type ActionState = { success:boolean; message?:string; fieldErrors?:Record<string,string>; values?:Record<string,string> };
export const initialActionState: ActionState = { success:false };
