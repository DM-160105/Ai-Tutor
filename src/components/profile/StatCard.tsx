interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

const StatCard = ({ value, label, icon }: StatCardProps) => {
  return (
    <div className="glass-card p-4 rounded-xl text-center">
      {icon && <div className="mb-2 flex justify-center text-primary">{icon}</div>}
      <div className="text-2xl md:text-3xl font-bold gradient-text">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
};

export default StatCard;
