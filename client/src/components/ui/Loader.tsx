interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const dotSize = {
  sm: 'size-1.5',
  md: 'size-2',
  lg: 'size-2.5',
};

const gapSize = {
  sm: 'gap-1',
  md: 'gap-1.5',
  lg: 'gap-2',
};

export function Loader({ size = 'md', fullScreen = false }: LoaderProps) {
  const dots = (
    <div className={`flex items-center ${gapSize[size]}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${dotSize[size]} rounded-full bg-primary animate-pulse`}
          style={{ animationDelay: `${i * 150}ms`, animationDuration: '900ms' }}
        />
      ))}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-bg-soft">
        {dots}
      </div>
    );
  }

  return dots;
}