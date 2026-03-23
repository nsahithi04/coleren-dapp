import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home() {
  return <h1>Home</h1>;
}

export default function App() {
  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<Home />} />
    //   </Routes>
    // </BrowserRouter>
    <div className="text-[#348670] text-4xl">welcome to react app</div>
  );
}
