export default function SuccessShow({ success }) {
  if (!success) return null;
  return (
    <div className="text-center text-[#24BC61] font-semibold p-5 bg-[#E7FCEF] rounded-lg w-full">
      {success}
    </div>
  );
}
