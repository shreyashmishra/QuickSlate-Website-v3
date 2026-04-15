import Link from 'next/link';
import './services.scss';
import { serviceItems } from '@/app/site-content';

export default function Services() {
  return (
    <section className='services-section'>
      <div className='hero'>
        <h1>Services</h1>
        <p>Production, consulting, distribution, and promotion with room for custom fees.</p>
      </div>
      <div className='grid'>
        {serviceItems.map((s) => (
          <div className='card' key={s.title}>
            <h3>{s.title}</h3>
            <p>{s.description}</p>
          </div>
        ))}
      </div>
      <div className='cta-row'>
        <Link className='cta' href='/Contact'>Let’s collaborate</Link>
      </div>
    </section>
  )
}
