import React from 'react';
import { assets, dummyTestimonial } from '../../assets/assets';

const TestimonialsSection = () => {
  return (
    <div className='pb-14 px-8 md:px-0'>
      <h2 className='text-3xl font-medium text-gray-800'>Testimonials</h2>
      <p className='md:text-base text-gray-500 mt-3'>
        Hear from our learners as they share their journeys of transformation, success, and how our <br /> platform has made a difference in their lives.
      </p>
      <div className='grid grid-cols-auto gap-8 mt-14'>
        {dummyTestimonial.map((testimonial, index) => (
          <figure
            key={index}
            className='text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] overflow-hidden'
          >
            <div className='flex items-center gap-4 px-5 py-4 bg-gray-500/10'>
              <img
                className='h-12 w-12 rounded-full'
                src={testimonial.image}
                alt={testimonial.name}
              />
              <figcaption>
                <h1 className='text-lg font-medium text-gray-800'>{testimonial.name}</h1>
                <p className='text-gray-800/80'>{testimonial.role}</p>
              </figcaption>
            </div>
            <div className='p-5 pb-7'>
              <div className='flex gap-0.5'>
                {[...Array(5)].map((_, i) => (
                  <img
                    className='h-5'
                    key={i}
                    src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                    alt={i < Math.floor(testimonial.rating) ? 'Filled star' : 'Empty star'}
                    role='img'
                  />
                ))}
              </div>
              <blockquote className='text-gray-500 mt-5'>{testimonial.feedback}</blockquote>
            </div>
            <a href="#" className='text-blue-500 underline px-5'>Read more</a>
          </figure>

        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;