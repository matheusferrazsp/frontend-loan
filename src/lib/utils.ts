import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateExtended(date: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function isSubscriptionBlocked(user: any): boolean {
  if (!user || user.isLifetime) return false;
  
  if (['pending', 'past_due', 'canceled', 'unpaid'].includes(user.subscriptionStatus)) {
    return true;
  }
  
  if (user.subscriptionStatus === 'trialing' && user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) < new Date()) {
    return true;
  }
  
  return false;
}
