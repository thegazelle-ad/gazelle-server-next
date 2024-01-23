'use client';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
 
  return (
    <div className="flex justify-center w-full">
      <p>Error: {error.message}</p>
    </div>
  );
}