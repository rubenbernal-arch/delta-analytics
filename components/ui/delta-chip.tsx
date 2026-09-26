'use client'

export function DeltaChip() {
  const pins = Array.from({ length: 10 }, (_, i) => {
    const x = 192 + i * 24
    const end = 65 + ((i * 37) % 85)
    const bend = i % 2 === 0 ? 12 : -12

    return { x, end, bend }
  })

  return (
    <div className="delta-chip">
      <svg viewBox="0 0 600 600" fill="none" aria-hidden="true">
        <g className="delta-chip__cycle">
          {/* Circuitos en los cuatro lados */}
          {[0, 90, 180, 270].map((rotation) => (
            <g key={rotation} transform={`rotate(${rotation} 300 300)`}>
              {pins.map(({ x, end, bend }, i) => (
                <g key={i}>
                  <path
                    className="delta-chip__trace"
                    style={{ animationDelay: `${i * 65}ms` }}
                    pathLength="1"
                    d={`
                      M ${x} 180
                      V ${end + 30}
                      H ${x + bend}
                      V ${end}
                    `}
                    stroke={i % 3 === 0 ? '#ed8b27' : '#707574'}
                    strokeWidth="1.5"
                  />

                  <circle
                    className="delta-chip__node"
                    cx={x + bend}
                    cy={end}
                    r="3"
                    fill={i % 3 === 0 ? '#ed8b27' : '#707574'}
                  />

                  <path d={`M ${x} 180 V 158`} stroke="#ed8b27" strokeWidth="3" />
                </g>
              ))}
            </g>
          ))}

          {/* Cuerpo del chip */}
          <g className="delta-chip__body">
            <rect x="180" y="180" width="240" height="240" rx="16" fill="#121b39" stroke="#d98929" strokeWidth="2.5" />

            {/* Cuadrícula interna */}
            {[220, 260, 300, 340, 380].map((position) => (
              <g key={position} stroke="#d98929" strokeOpacity=".09">
                <path d={`M ${position} 182 V 418`} />
                <path d={`M 182 ${position} H 418`} />
              </g>
            ))}

            {/* Puntos en las esquinas */}
            {[
              [194, 194],
              [406, 194],
              [194, 406],
              [406, 406],
            ].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill="#97988e" />
            ))}

            {/* Símbolo Delta */}
            <path
              className="delta-chip__logo"
              d="M 300 255 L 340 337 H 260 Z"
              stroke="#ef8c28"
              strokeWidth="12"
              strokeLinejoin="miter"
            />
          </g>
        </g>
      </svg>

      <style>{`
        .delta-chip {
          width: 100%;
          min-height: 360px;
          height: 100%;
          display: grid;
          place-items: center;
          position: relative;
        }

        .delta-chip svg {
          display: block;
          width: 100%;
          max-width: 680px;
          height: auto;
          overflow: visible;
        }

        .delta-chip__cycle,
        .delta-chip__body,
        .delta-chip__logo {
          transform-box: fill-box;
          transform-origin: center;
        }

        .delta-chip__cycle {
          animation: delta-chip-cycle 8s ease-in-out infinite;
        }

        .delta-chip__trace {
          stroke-dasharray: 1;
          animation: delta-chip-trace 8s ease-in-out infinite;
        }

        .delta-chip__body {
          animation: delta-chip-body 8s ease-in-out infinite;
          filter: drop-shadow(0 0 22px rgba(65, 91, 165, .25));
        }

        .delta-chip__node {
          animation: delta-chip-node 8s ease-in-out infinite;
        }

        .delta-chip__logo {
          animation: delta-chip-logo 8s ease-in-out infinite;
          filter: drop-shadow(0 0 12px rgba(239, 140, 40, .65));
        }

        @keyframes delta-chip-cycle {
          0%, 6% {
            opacity: 0;
            transform: translateY(14px) scale(.94);
          }
          20%, 72% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          88%, 100% {
            opacity: 0;
            transform: translateY(-10px) scale(1.025);
          }
        }

        @keyframes delta-chip-trace {
          0%, 8% { stroke-dashoffset: 1; }
          32%, 72% { stroke-dashoffset: 0; }
          92%, 100% { stroke-dashoffset: 1; }
        }

        @keyframes delta-chip-body {
          0%, 14% { opacity: 0; transform: scale(.9); }
          30%, 76% { opacity: 1; transform: scale(1); }
          90%, 100% { opacity: 0; transform: scale(.98); }
        }

        @keyframes delta-chip-logo {
          0%, 27% { opacity: 0; transform: scale(.8); }
          40%, 55% { opacity: 1; transform: scale(1); }
          63% { opacity: .7; transform: scale(.97); }
          72% { opacity: 1; transform: scale(1); }
          86%, 100% { opacity: 0; transform: scale(1); }
        }

        @keyframes delta-chip-node {
          0%, 15% { opacity: 0; }
          35%, 72% { opacity: .85; }
          90%, 100% { opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .delta-chip * {
            animation: none !important;
          }
          .delta-chip__trace {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  )
}
