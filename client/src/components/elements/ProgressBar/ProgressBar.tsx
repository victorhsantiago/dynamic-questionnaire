import "./ProgressBar.scss";

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="progress-bar">
      <div className="progress-bar__fill" style={{ width: `${percentage}%` }} />
    </div>
  );
};
