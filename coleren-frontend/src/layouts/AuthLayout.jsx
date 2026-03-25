export default function AuthLayout({ children, image }) {
  return (
    <div className="grid lg:grid-cols-2 items-stretch min-h-screen">
      <div className="p-20 flex flex-col items-center justify-center gap-10 w-[90%] mx-auto">
        {children}
      </div>
      <img className="hidden lg:block object-cover w-full h-full" src={image} />
    </div>
  );
}
