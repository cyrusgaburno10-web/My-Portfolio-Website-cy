import { get } from '@vercel/global-config';
import type { Testimonial } from './testimonials';

const CUSTOM_TESTIMONIALS_KEY = 'customTestimonials';

/** Testimonials added through /admin, stored as a single JSON array in Global Config. There is no hardcoded seed list, so this is the entire source of truth. */
export async function getCustomTestimonials(): Promise<Testimonial[]> {
  if (!process.env.GLOBAL_CONFIG) return [];

  try {
    const value = await get<Testimonial[]>(CUSTOM_TESTIMONIALS_KEY);
    return Array.isArray(value) ? value.map((t) => ({ ...t, isCustom: true })) : [];
  } catch {
    return [];
  }
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return getCustomTestimonials();
}
