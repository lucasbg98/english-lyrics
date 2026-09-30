import type { Difficulty } from '../types';

interface Props {
  value: Difficulty;
  onChange: (d: Difficulty) => void;
}

const OPTIONS: { value: Difficulty; label: string; desc: string }[] = [
  { value: 'easy',   label: 'Fácil',  desc: '~30% removido' },
  { value: 'medium', label: 'Médio',  desc: '~60% removido' },
  { value: 'hard',   label: 'Difícil',desc: '~80% removido' },
];

export default function DifficultySelector({ value, onChange }: Props) {
  return (
    <div className="difficulty-row">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`difficulty-btn difficulty-${opt.value}${value === opt.value ? ' active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          <span className="difficulty-label">{opt.label}</span>
          <span className="difficulty-desc">{opt.desc}</span>
        </button>
      ))}
    </div>
  );
}
