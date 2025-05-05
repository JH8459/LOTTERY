interface AlertProps {
  type?: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export default function Alert({ type = 'success', message, onClose }: AlertProps) {
  return (
    <div
      className={`w-full px-4 py-3 rounded-md text-sm font-medium flex items-start justify-between gap-2
        ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto text-xs hover:underline">
        닫기
      </button>
    </div>
  );
}
