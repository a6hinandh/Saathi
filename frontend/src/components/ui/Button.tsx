import type { ButtonHTMLAttributes } from 'react';

export function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`rounded-full px-5 py-3 font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${className}`} {...props} />;
}
