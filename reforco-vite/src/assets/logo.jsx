import React from "react";

const Logo = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Livro Turquesa */}
          <g className="book-1">
            <path d="M40 60L100 40V160L40 140V60Z" fill="#00b0b5" />
            <path
              d="M40 60L100 40L100 160L40 140L40 60Z"
              stroke="black"
              strokeWidth="2"
            />
            <path
              d="M60 80L80 70M60 100L80 90M60 120L80 110"
              stroke="black"
              strokeWidth="2"
            />
            <circle cx="70" cy="95" r="15" fill="black" />
            <circle cx="72" cy="93" r="5" fill="white" />
            <path
              d="M70 108C73 108 73 105 73 105"
              stroke="black"
              strokeWidth="2"
              fill="none"
            />
          </g>

          {/* Livro Salmão */}
          <g className="book-2">
            <path d="M110 40L170 60V140L110 160V40Z" fill="#ff8a8a" />
            <path
              d="M110 40L170 60L170 140L110 160L110 40Z"
              stroke="black"
              strokeWidth="2"
            />
            <path d="M130 78L150 85" stroke="black" strokeWidth="3" />
            <path d="M120 95L160 110" stroke="black" strokeWidth="3" />
            <path d="M125 115L150 125" stroke="black" strokeWidth="3" />
          </g>
        </svg>
      </div>
      <div className="text-darkBlue text-center font-bold">
        <div className="text-2xl">Reforço</div>
        <div className="text-xl">do Saber</div>
      </div>
    </div>
  );
};

export default Logo;
