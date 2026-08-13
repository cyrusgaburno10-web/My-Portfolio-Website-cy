export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar?: string;
  /** Always true today since every testimonial is added through /admin, kept for consistency with the other admin-managed lists. */
  isCustom?: boolean;
}
