import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Calendar, Eye } from "lucide-react";
import { SavedNote } from "@/api/userApi";

interface NotesListProps {
  notes: SavedNote[];
  loading: boolean;
}

const NotesList = ({ notes, loading }: NotesListProps) => {
  const [selectedNote, setSelectedNote] = useState<SavedNote | null>(null);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse bg-muted rounded-lg h-20" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-modern pr-2">
        {notes.map(note => (
          <div key={note.id} className="glass-card p-4 rounded-xl hover-lift">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  {note.title}
                </h4>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {note.source}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {note.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedNote(note)}
                className="hover-scale"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {selectedNote?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                {selectedNote?.source}
              </span>
              <span>{selectedNote?.createdAt.toLocaleDateString()}</span>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p>{selectedNote?.content}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotesList;
