export default function SuccessBanner({ message }) {
  if (!message) return null;
  return (
    <div className="text-center text-[#24BC61] font-semibold p-5 bg-[#E7FCEF] rounded-lg w-full">
      {message}
    </div>
  );
}
