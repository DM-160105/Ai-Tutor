import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ToolCardProps {
  icon: string;
  title: string;
  description: string;
  badges?: string[];
  isActive?: boolean;
  onOpen: () => void;
}

const ToolCard = ({ icon, title, description, badges = [], isActive, onOpen }: ToolCardProps) => {
  return (
    <div 
      className={`glass-card p-6 rounded-2xl transition-all duration-300 group ${
        isActive ? 'ring-2 ring-primary shadow-lg' : ''
      }`}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {badges.map((badge, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {badge}
            </Badge>
          ))}
        </div>
      )}
      
      <Button 
        onClick={onOpen} 
        variant={isActive ? "default" : "outline"} 
        className="w-full hover-scale"
      >
        {isActive ? 'Active' : 'Open'}
      </Button>
    </div>
  );
};

export default ToolCard;
