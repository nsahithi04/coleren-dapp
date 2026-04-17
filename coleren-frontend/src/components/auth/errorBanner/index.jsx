export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="text-center text-[#D64750] font-semibold p-5 bg-[#FFF9FA] rounded-lg w-full">
      {message}
    </div>
  );
}
