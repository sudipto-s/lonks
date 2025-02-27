import { useSprings, animated } from '@react-spring/web'
import { useEffect, useRef, useState } from 'react'
import "../css/ReactBits.css"

export const SplitText = ({
   text = '',
   className = '',
   delay = 100,
   animationFrom = { opacity: 0, transform: 'translate3d(0,40px,0)' },
   animationTo = { opacity: 1, transform: 'translate3d(0,0,0)' },
   easing = 'easeOutCubic',
   threshold = 0.1,
   rootMargin = '-100px',
   textAlign = 'center'
}) => {
   const words = text.split(' ').map(word => word.split(''))

   const letters = words.flat()
   const [inView, setInView] = useState(false)
   const ref = useRef()
   const animatedCount = useRef(0)

   useEffect(() => {
      const observer = new IntersectionObserver(
         ([entry]) => {
         if (entry.isIntersecting) {
            setInView(true)
            observer.unobserve(ref.current)
         }
         },
         { threshold, rootMargin }
      )

      observer.observe(ref.current)

      return () => observer.disconnect()
   }, [threshold, rootMargin])

   const springs = useSprings(
      letters.length,
      letters.map((_, i) => ({
         from: animationFrom,
         to: inView
         ? async (next) => {
            await next(animationTo)
            animatedCount.current += 1
         }
         : animationFrom,
         delay: i * delay,
         config: { easing },
      }))
   )

   return (
      <p
         ref={ref}
         className={`split-parent ${className}`}
         style={{ textAlign, overflow: 'hidden', display: 'inline', whiteSpace: 'normal', wordWrap: 'break-word' }}
      >
         {words.map((word, wordIndex) => (
         <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {word.map((letter, letterIndex) => {
               const index = words
               .slice(0, wordIndex)
               .reduce((acc, w) => acc + w.length, 0) + letterIndex

               return (
               <animated.span
                  key={index}
                  style={{
                     ...springs[index],
                     display: 'inline-block',
                     willChange: 'transform, opacity',
                  }}
               >
                  {letter}
               </animated.span>
               )
            })}
            <span style={{ display: 'inline-block', width: '0.3em' }}></span>
         </span>
         ))}
      </p>
   )
}


export const BlurText = ({
   text = '',
   delay = 200,
   className = '',
   animateBy = 'words', // 'words' or 'letters'
   direction = 'top', // 'top' or 'bottom'
   threshold = 0.1,
   rootMargin = '0px',
   animationFrom,
   animationTo,
   easing = 'easeOutCubic'
}) => {
   const elements = animateBy === 'words' ? text.split(' ') : text.split('')
   const [inView, setInView] = useState(false)
   const ref = useRef()
   const animatedCount = useRef(0)

   const defaultFrom =
      direction === 'top'
         ? { filter: 'blur(10px)', opacity: 0, transform: 'translate3d(0,-50px,0)' }
         : { filter: 'blur(10px)', opacity: 0, transform: 'translate3d(0,50px,0)' }

   const defaultTo = [
      {
         filter: 'blur(5px)',
         opacity: 0.5,
         transform: direction === 'top' ? 'translate3d(0,5px,0)' : 'translate3d(0,-5px,0)',
      },
      { filter: 'blur(0px)', opacity: 1, transform: 'translate3d(0,0,0)' },
   ]

   useEffect(() => {
      const observer = new IntersectionObserver(
         ([entry]) => {
         if (entry.isIntersecting) {
            setInView(true)
            observer.unobserve(ref.current)
         }
         },
         { threshold, rootMargin }
      )

      observer.observe(ref.current)

      return () => observer.disconnect()
   }, [threshold, rootMargin])

   const springs = useSprings(
      elements.length,
      elements.map((_, i) => ({
         from: animationFrom || defaultFrom,
         to: inView
         ? async (next) => {
            for (const step of (animationTo || defaultTo)) {
               await next(step)
            }
            animatedCount.current += 1
         }
         : animationFrom || defaultFrom,
         delay: i * delay,
         config: { easing },
      }))
   )

   return (
      <p ref={ref} className={`blur-text ${className}`}>
         {springs.map((props, index) => (
         <animated.span
            key={index}
            style={{
               ...props,
               display: 'inline-block',
               willChange: 'transform, filter, opacity',
            }}
         >
            {elements[index] === ' ' ? '\u00A0' : elements[index]}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
         </animated.span>
         ))}
      </p>
   )
}


export const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
   const animationDuration = `${speed}s`

   return (
      <div
         className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
         style={{ animationDuration }}
      >
         {text}
      </div>
   )
}
