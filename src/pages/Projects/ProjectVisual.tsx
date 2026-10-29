import { useId } from 'react';
import type { ProjectVisual as VisualType } from '../../data/models';
import styles from './Projects.module.css';

/** Lightweight architectural illustrations, not screenshots of a delivered product. */
export default function ProjectVisual({
  type,
  large = false,
}: {
  type: VisualType;
  large?: boolean;
}) {
  const gridId = `project-grid-${useId().replace(/:/g, '')}`;
  return (
    <div
      className={`${styles.visual} ${large ? styles.visualLarge : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 600 300" fill="none" className={styles.diagram}>
        <defs>
          <pattern
            id={gridId}
            width="25"
            height="25"
            patternUnits="userSpaceOnUse"
          >
            <path d="M25 0H0V25" stroke="currentColor" strokeOpacity=".065" />
          </pattern>
        </defs>
        <rect width="600" height="300" fill={`url(#${gridId})`} />
        {type === 'vision' && (
          <>
            <path
              d="M184 76 300 22 418 77V219L300 275 184 220Z"
              fill="currentColor"
              fillOpacity=".025"
              stroke="currentColor"
              strokeOpacity=".25"
            />
            <path
              d="m184 76 116 58 118-57M300 134v141M184 146l116 58 118-57M242 50v198M359 50v198M184 110l116 58 118-57M184 182l116 58 118-57"
              stroke="currentColor"
              strokeOpacity=".18"
            />
            <path
              d="M225 125v-20l21-10m108 0 21 10v20m0 56v20l-21 10m-108 0-21-10v-20"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle
              cx="300"
              cy="154"
              r="31"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle
              cx="300"
              cy="154"
              r="10"
              fill="currentColor"
              fillOpacity=".14"
            />
            <path
              d="M72 154h159m100 0h197"
              stroke="currentColor"
              strokeDasharray="4 5"
              strokeOpacity=".45"
            />
            <rect x="55" y="146" width="16" height="16" stroke="currentColor" />
            <rect
              x="528"
              y="146"
              width="16"
              height="16"
              stroke="currentColor"
            />
            <text
              x="49"
              y="185"
              fill="currentColor"
              fontSize="8"
              fontFamily="monospace"
            >
              INPUT
            </text>
            <text
              x="519"
              y="185"
              fill="currentColor"
              fontSize="8"
              fontFamily="monospace"
            >
              VISION
            </text>
          </>
        )}
        {type === 'rag' && (
          <>
            <path
              d="M117 90h82l61 60-61 60h-82m143-60h77m0 0 53-60h75m-128 60 53 60h75"
              stroke="currentColor"
              strokeOpacity=".45"
            />
            {[70, 130, 190].map((y, i) => (
              <g key={y}>
                <rect
                  x="65"
                  y={y}
                  width="62"
                  height="38"
                  rx="2"
                  fill="var(--project-bg, var(--surface))"
                  stroke="currentColor"
                  strokeOpacity=".6"
                />
                <path
                  d={`M80 ${y + 13}h30m-30 8h20`}
                  stroke="currentColor"
                  strokeOpacity=".35"
                />
                <text
                  x="55"
                  y={y + 22}
                  fill="currentColor"
                  fontFamily="monospace"
                  fontSize="7"
                >
                  {i + 1}
                </text>
              </g>
            ))}
            <path
              d="M127 89h35v61h98M127 149h133M127 209h35v-59"
              stroke="currentColor"
              strokeOpacity=".45"
            />
            <rect
              x="260"
              y="119"
              width="77"
              height="62"
              rx="3"
              fill="var(--project-bg, var(--surface))"
              stroke="currentColor"
            />
            <path d="m284 140 15-8 15 8v18l-15 9-15-9Z" stroke="currentColor" />
            <path d="m284 140 15 9 15-9m-15 9v18" stroke="currentColor" />
            <rect
              x="465"
              y="71"
              width="68"
              height="38"
              rx="2"
              fill="var(--project-bg, var(--surface))"
              stroke="currentColor"
            />
            <rect
              x="465"
              y="191"
              width="68"
              height="38"
              rx="2"
              fill="var(--project-bg, var(--surface))"
              stroke="currentColor"
            />
            <text
              x="478"
              y="94"
              fill="currentColor"
              fontFamily="monospace"
              fontSize="9"
            >
              ANSWER
            </text>
            <text
              x="477"
              y="214"
              fill="currentColor"
              fontFamily="monospace"
              fontSize="9"
            >
              SOURCE
            </text>
          </>
        )}
        {type === 'infra' && (
          <>
            <path
              d="m300 40 138 69v120L300 292 162 224V109Z"
              stroke="currentColor"
              strokeOpacity=".18"
            />
            <path
              d="m162 109 138 69 138-69M300 178v114"
              stroke="currentColor"
              strokeOpacity=".18"
            />
            {[82, 133, 184].map((y) => (
              <g key={y}>
                <path
                  d={`m228 ${y} 72-35 72 35-72 36Z`}
                  fill="var(--project-bg, var(--surface))"
                  stroke="currentColor"
                  strokeOpacity=".8"
                />
                <path
                  d={`m228 ${y}v22l72 36 72-36v-22M300 ${y + 36}v22`}
                  fill="var(--project-bg, var(--surface))"
                  stroke="currentColor"
                  strokeOpacity=".65"
                />
                <path
                  d={`m243 ${y + 16} 20 10m9 4 20 10`}
                  stroke="currentColor"
                  strokeOpacity=".7"
                />
                <circle cx="350" cy={y + 10} r="2" fill="currentColor" />
              </g>
            ))}
            <path
              d="M228 133H98v84h57M372 133h130V73h-51"
              stroke="currentColor"
              strokeDasharray="4 5"
              strokeOpacity=".6"
            />
            <rect
              x="75"
              y="113"
              width="46"
              height="40"
              stroke="currentColor"
              strokeOpacity=".6"
            />
            <rect
              x="480"
              y="111"
              width="44"
              height="44"
              stroke="currentColor"
              strokeOpacity=".6"
            />
          </>
        )}
        {type === 'schedule' && (
          <>
            <rect
              x="120"
              y="54"
              width="360"
              height="192"
              rx="3"
              fill="currentColor"
              fillOpacity=".025"
              stroke="currentColor"
              strokeOpacity=".5"
            />
            <path
              d="M120 89h360M184 89v157M244 89v157M304 89v157M364 89v157M424 89v157M120 141h360M120 193h360"
              stroke="currentColor"
              strokeOpacity=".2"
            />
            <rect
              x="197"
              y="107"
              width="153"
              height="17"
              rx="2"
              fill="currentColor"
              fillOpacity=".2"
            />
            <rect
              x="257"
              y="159"
              width="152"
              height="17"
              rx="2"
              fill="currentColor"
              fillOpacity=".4"
            />
            <rect
              x="197"
              y="211"
              width="92"
              height="17"
              rx="2"
              fill="currentColor"
              fillOpacity=".15"
            />
            <circle cx="143" cy="72" r="3" fill="currentColor" />
            <path
              d="M157 72h42M394 40v220"
              stroke="currentColor"
              strokeDasharray="3 4"
            />
          </>
        )}
        {type === 'audio' && (
          <>
            <path d="M50 150h500" stroke="currentColor" strokeOpacity=".2" />
            {Array.from({ length: 47 }, (_, i) => {
              const height =
                10 +
                Math.sin(i * 0.48) ** 2 * Math.sin((i + 2) * 0.17) ** 2 * 160;
              return (
                <rect
                  key={i}
                  x={68 + i * 10}
                  y={150 - height / 2}
                  width="3"
                  height={height}
                  rx="1.5"
                  fill="currentColor"
                  opacity={0.3 + Math.sin(i * 0.1) ** 2 * 0.6}
                />
              );
            })}
            <path
              d="M195 46v208M405 46v208"
              stroke="currentColor"
              strokeDasharray="3 5"
              strokeOpacity=".35"
            />
            <circle cx="195" cy="150" r="4" fill="currentColor" />
            <circle cx="405" cy="150" r="4" fill="currentColor" />
          </>
        )}
        <path
          d="M20 38V20h18m524 0h18v18M20 262v18h18m524 0h18v-18"
          stroke="currentColor"
          strokeOpacity=".4"
        />
        <text
          x="22"
          y="293"
          fill="currentColor"
          opacity=".6"
          fontFamily="monospace"
          fontSize="7"
        >
          FIG. {type.toUpperCase()} / CONCEPT ARCHITECTURE
        </text>
      </svg>
    </div>
  );
}
