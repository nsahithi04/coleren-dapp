import { useState } from "react";

export default function MultiTagInput() {
  const [input, setInput] = useState("");
  const [tags, setTags] = useState([]);

  function handleKeyDown(e) {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const value = input.trim();
    if (!value) return;

    const updated = [...tags, value];
    setTags(updated);
    setInput("");
  }

  function removeTag(index) {
    const updated = tags.filter((_, i) => i !== index);
    setTags(updated);
  }

  return (
    <div className="w-full h-[50px] mt-2 border border-[#A1A1A180] rounded-lg py-1.5 px-3 flex flex-wrap gap-3 items-center">
      {/* TAGS */}
      {tags.map((tag, index) => (
        <div
          key={index}
          className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#E7FCEF]"
        >
          <span className="text-[#062732] text-md">{tag}</span>

          <button onClick={() => removeTag(index)}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.82238 7.00011L11.4974 3.33094C11.6072 3.2211 11.6689 3.07212 11.6689 2.91677C11.6689 2.76143 11.6072 2.61245 11.4974 2.50261C11.3875 2.39276 11.2386 2.33105 11.0832 2.33105C10.9279 2.33105 10.7789 2.39276 10.6691 2.50261L6.99988 6.17761L3.33072 2.50261C3.22087 2.39276 3.07189 2.33105 2.91655 2.33105C2.76121 2.33105 2.61223 2.39276 2.50238 2.50261C2.39254 2.61245 2.33083 2.76143 2.33083 2.91677C2.33083 3.07212 2.39254 3.2211 2.50238 3.33094L6.17738 7.00011L2.50238 10.6693C2.44771 10.7235 2.40431 10.788 2.3747 10.8591C2.34508 10.9302 2.32983 11.0064 2.32983 11.0834C2.32983 11.1604 2.34508 11.2367 2.3747 11.3078C2.40431 11.3789 2.44771 11.4434 2.50238 11.4976C2.55661 11.5523 2.62113 11.5957 2.69221 11.6253C2.7633 11.6549 2.83954 11.6702 2.91655 11.6702C2.99356 11.6702 3.0698 11.6549 3.14089 11.6253C3.21197 11.5957 3.27649 11.5523 3.33072 11.4976L6.99988 7.82261L10.6691 11.4976C10.7233 11.5523 10.7878 11.5957 10.8589 11.6253C10.93 11.6549 11.0062 11.6702 11.0832 11.6702C11.1602 11.6702 11.2365 11.6549 11.3076 11.6253C11.3786 11.5957 11.4432 11.5523 11.4974 11.4976C11.5521 11.4434 11.5955 11.3789 11.6251 11.3078C11.6547 11.2367 11.6699 11.1604 11.6699 11.0834C11.6699 11.0064 11.6547 10.9302 11.6251 10.8591C11.5955 10.788 11.5521 10.7235 11.4974 10.6693L7.82238 7.00011Z"
                fill="black"
              />
            </svg>
          </button>
        </div>
      ))}

      {/* INPUT */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 min-w-[150px] outline-none text-lg"
      />
    </div>
  );
}
