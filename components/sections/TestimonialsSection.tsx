import Image from 'next/image';
import { Quote } from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { getAllTestimonials } from '@/lib/customTestimonials';

export async function TestimonialsSection() {
  const testimonials = await getAllTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <PageContainer id="testimonials">
      <PageHeader as="h2" title="Testimonials" subtitle="What clients and collaborators say after working together." />

      <div className="scroll-fade-mask hide-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="flex w-[85%] shrink-0 snap-start flex-col justify-between gap-6 rounded-2xl border border-line bg-void-deep/40 p-6 sm:w-[420px]"
          >
            <div>
              <Quote size={22} color="var(--periwinkle)" strokeWidth={1.5} className="mb-4" />
              <p className="text-[15px] leading-relaxed text-text">&ldquo;{testimonial.quote}&rdquo;</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-line bg-void-deep">
                {testimonial.avatar ? (
                  <Image src={testimonial.avatar} alt="" fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-[15px] font-semibold text-periwinkle">
                    {testimonial.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium text-text">{testimonial.name}</p>
                <p className="truncate text-[12.5px] text-ash-dim">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
