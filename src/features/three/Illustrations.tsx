import { useId } from 'react';

export function DeskIllustration({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      className={className}
      viewBox="0 0 660 420"
      role="img"
      aria-label="Technical illustration of a monitor, keyboard, electronics and home server on a desk"
    >
      <defs>
        <linearGradient id={`${id}screen`} x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#174251" />
          <stop offset="1" stopColor="#0e2732" />
        </linearGradient>
        <pattern
          id={`${id}grid`}
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M30 0H0V30"
            fill="none"
            stroke="#315767"
            strokeWidth=".5"
            opacity=".3"
          />
        </pattern>
      </defs>
      <rect width="660" height="420" fill={`url(#${id}grid)`} />
      <g stroke="#57899a" strokeWidth="1.25" strokeLinejoin="round">
        <path d="M62 273 423 198 610 287 244 379Z" fill="#172b35" />
        <path
          d="M62 273v13l182 92v-13Zm182 92 366-78v13l-366 78"
          fill="#10212a"
        />
        <path
          d="M85 298v61l13 7v-62M578 309v58l-13 4v-59M251 382v28l14-3v-28"
          fill="#1d3440"
        />
        <path d="m229 246 65 30 93-20-62-29Z" fill="#294754" />
        <path d="m304 196 27-6 2 51-27 7Z" fill="#335562" />
        <path d="M192 74 410 31 410 207 192 254Z" fill="#25414e" />
        <path d="m410 31 12 6v176l-12-6Z" fill="#192f3b" />
        <path d="M203 86 398 48v145l-195 42Z" fill={`url(#${id}screen)`} />
        <path d="m203 218 195-42" stroke="#40798c" />
        <circle cx="302" cy="222" r="2" fill="#5ac5dd" stroke="none" />
        <path d="m206 295 132-28 76 37-134 29Z" fill="#203a46" />
        {Array.from({ length: 5 }, (_, row) => (
          <path
            key={row}
            d={`m${216 + row * 11} ${295 + row * 5.5} 115-24`}
            stroke="#4a6b79"
          />
        ))}
        {Array.from({ length: 10 }, (_, col) => (
          <path
            key={col}
            d={`m${219 + col * 12} ${293 - col * 2.5} 44 22`}
            stroke="#4a6b79"
          />
        ))}
        <path
          d="m445 294 23-5c8-1 17 3 17 9 0 7-9 11-18 13l-21 4c-13-4-14-16-1-21Z"
          fill="#2c4c5b"
        />
        <path d="m459 293 12 6" stroke="#6b96a4" />
        <path d="M483 178v98l56 27V205Z" fill="#1e3541" />
        <path d="m483 178 61-13 55 26-60 14Z" fill="#2b4857" />
        <path d="M539 205v98l60-13v-99Z" fill="#274956" />
        <path
          d="m550 216 38-8v17l-38 8Zm0 27 38-8v17l-38 8Zm0 27 38-8v9l-38 8Z"
          fill="#102630"
        />
        <circle cx="581" cy="215" r="2" fill="#a7e8f2" stroke="none" />
        <path d="m111 271 47-10 33 16-47 10Z" fill="#27515b" />
        <path d="m130 272 14-3 10 5-14 3Z" fill="#10232e" />
        <path d="m155 268 13 6m-45 5 13 6" stroke="#7395a0" />
      </g>
      <g
        fill="#a7e8f2"
        fontFamily="monospace"
        fontSize="12"
        transform="matrix(1,-.21,0,1,218,114)"
      >
        <text>NICO OS</text>
        <text y="22" fontSize="8">
          PERSONAL WORKSTATION
        </text>
        <path d="M0 36h165" stroke="#5ac5dd" strokeWidth=".6" />
        <text y="56" fontSize="8">
          01 / BUILD. BREAK. UNDERSTAND.
        </text>
        <text y="80" fontSize="8">
          SYSTEM READY_
        </text>
      </g>
      <g fill="#9ab3bf" fontFamily="monospace" fontSize="8">
        <text x="64" y="65">
          WORKSTATION / 001
        </text>
        <text x="453" y="385">
          LOCAL ENVIRONMENT
        </text>
      </g>
      <g stroke="#416d7e" strokeWidth=".7" fill="none">
        <path d="M64 73h75l39 27M487 377h-51l-26-24" />
        <circle cx="178" cy="100" r="3" />
        <circle cx="410" cy="353" r="3" />
      </g>
    </svg>
  );
}

export function CarIllustration({
  color = '#87aeb3',
  sedan = false,
  className,
}: {
  color?: string;
  sedan?: boolean;
  className?: string;
}) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      className={className}
      viewBox="0 0 720 390"
      role="img"
      aria-label="Stylized concept vehicle illustration; placeholder geometry, not a vehicle scan"
    >
      <defs>
        <linearGradient id={`${id}paint`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={color} />
          <stop offset="1" stopColor="#1d3542" />
        </linearGradient>
        <pattern
          id={`${id}ground`}
          width="45"
          height="22"
          patternUnits="userSpaceOnUse"
          patternTransform="skewX(-30)"
        >
          <path d="M45 0H0V22" stroke="#315665" strokeWidth=".6" fill="none" />
        </pattern>
      </defs>
      <rect width="720" height="390" fill={`url(#${id}ground)`} opacity=".5" />
      <ellipse cx="369" cy="295" rx="245" ry="36" fill="#071015" opacity=".3" />
      <g stroke="#476b7c" strokeWidth="1.3" strokeLinejoin="round">
        <path
          d="m109 228 102-50 88-21 69-64 141 6 86 93 25 43-20 39-186 54-271-67Z"
          fill={`url(#${id}paint)`}
        />
        <path d="m299 157 69-64 141 6-31 20-95-2-56 55Z" fill="#3a5b6b" />
        <path d="m383 117 95 2 65 69-119 25-97-41Z" fill="#10232e" />
        <path d="m395 128 72 2 49 54-88 16-80-30Z" fill="#375f70" />
        <path d="m509 99 86 93-52-4-65-69Z" fill="#182f3b" />
        <path
          d={sedan ? 'm534 151 30-4m-53-33 24 68' : 'm520 121 36 62'}
          fill="none"
          stroke="#588193"
          strokeWidth="4"
        />
        <path d="m109 228 215 57 296-50-20 39-186 54-271-67Z" fill={color} />
        <path d="m324 285 90 43 186-54 20-39Z" fill="#274454" />
        <path d="m143 261 271 67 186-54-5 14-179 54-277-68Z" fill="#132a35" />
        <path
          d="m116 228 50-23 70 18-48 26Zm97 26 40-26 61 15-33 28Z"
          fill="#b7dfe8"
        />
        <path d="m112 245 53 14-2 12-47-13Z" fill="#2a596d" />
        <path d="m326 287 53 17 16 16-67-19Z" fill="#163240" />
        <path
          d="m450 229 81-17 8 61-83 22-32-82"
          fill="none"
          stroke="#3b667b"
        />
        <path d="m509 230 16-3" stroke="#81adbb" strokeWidth="3" />
        <path d="m563 236 45-10" stroke="#81adbb" strokeWidth="3" />
        <path d="m143 261c3-43 59-30 71 20l-7 18-64-18Z" fill="#0c1a24" />
        <ellipse
          cx="181"
          cy="277"
          rx="24"
          ry="35"
          transform="rotate(-19 181 277)"
          fill="#0b161e"
        />
        <ellipse
          cx="184"
          cy="277"
          rx="14"
          ry="23"
          transform="rotate(-19 184 277)"
          fill="#6e8d9a"
        />
        <ellipse
          cx="184"
          cy="277"
          rx="5"
          ry="9"
          transform="rotate(-19 184 277)"
          fill="#274553"
        />
        <path d="m504 300c-3-48 42-63 52-19" fill="#0b1922" />
        <ellipse
          cx="529"
          cy="294"
          rx="23"
          ry="34"
          transform="rotate(10 529 294)"
          fill="#0b161e"
        />
        <ellipse
          cx="530"
          cy="293"
          rx="13"
          ry="22"
          transform="rotate(10 530 293)"
          fill="#6e8d9a"
        />
        <ellipse
          cx="530"
          cy="293"
          rx="5"
          ry="8"
          transform="rotate(10 530 293)"
          fill="#274553"
        />
        <path
          d="m130 219 83-41 86-21 28 15-74 56M543 188l52 4"
          fill="none"
          stroke="#79a8b6"
          opacity=".7"
        />
      </g>
      <g stroke="#3b6375" strokeWidth=".6">
        <path d="M110 346h502M110 340v12m502-12v12" />
        <path d="M651 123v173m-6-173h12m-12 173h12" />
      </g>
      <g fontFamily="monospace" fontSize="8" fill="#91adba">
        <text x="275" y="364">
          ENGINEERING STUDY / CONCEPT GEOMETRY
        </text>
        <text x="37" y="50">
          VEHICLE SYSTEMS
        </text>
        <text x="37" y="64">
          FORM × FUNCTION
        </text>
      </g>
    </svg>
  );
}
