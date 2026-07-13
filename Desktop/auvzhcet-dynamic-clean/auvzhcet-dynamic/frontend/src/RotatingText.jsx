import { forwardRef, useEffect, useRef, useState, useCallback } from 'react';

const RotatingText = forwardRef((props, ref) => {
  const {
    texts = [],
    rotationInterval = 3000,
    mainClassName = '',
    splitLevelClassName = '',
    elementLevelClassName = '',
    staggerDuration = 0.05,
    transition = 'all 0.5s ease-out',
    onNext
  } = props;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const timerRef = useRef(null);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % texts.length);
    if (onNext) onNext(currentIndex);
  }, [texts.length, currentIndex, onNext]);

  useEffect(() => {
    if (!isAutoPlay || texts.length === 0) return;

    timerRef.current = setInterval(goToNext, rotationInterval);
    return () => clearInterval(timerRef.current);
  }, [isAutoPlay, texts.length, rotationInterval, goToNext]);

  if (texts.length === 0) return null;

  const currentText = texts[currentIndex];
  const characters = currentText.split('');

  return (
    <div
      ref={ref}
      className={mainClassName}
      style={{
        display: 'inline-block',
        position: 'relative'
      }}
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {characters.map((char, idx) => (
          <span
            key={`${currentIndex}-${idx}`}
            className={splitLevelClassName}
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              animation: `slideIn 0.5s ease-out ${idx * staggerDuration}s`,
              opacity: 1,
              color: 'inherit',
              transition
            }}
          >
            <span
              className={elementLevelClassName}
              style={{
                display: 'inline-block',
                animation: `slideInChar 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * staggerDuration}s`,
                willChange: 'transform'
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInChar {
          from {
            transform: translateY(100%) rotateX(90deg);
            opacity: 0;
          }
          to {
            transform: translateY(0) rotateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
});

RotatingText.displayName = 'RotatingText';
export default RotatingText;
