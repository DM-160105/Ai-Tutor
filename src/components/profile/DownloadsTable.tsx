import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown, File } from "lucide-react";
import { DownloadEntry } from "@/api/userApi";

interface DownloadsTableProps {
  downloads: DownloadEntry[];
  loading: boolean;
}

const DownloadsTable = ({ downloads, loading }: DownloadsTableProps) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse bg-muted rounded-lg h-12" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead className="hidden sm:table-cell">Type</TableHead>
            <TableHead className="hidden md:table-cell">From Tool</TableHead>
            <TableHead className="hidden sm:table-cell">Date</TableHead>
            <TableHead className="text-right">Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {downloads.map(download => (
            <TableRow key={download.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="truncate max-w-[150px] md:max-w-none">{download.fileName}</span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">{download.type}</TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="bg-secondary px-2 py-1 rounded-full text-xs">
                  {download.fromTool}
                </span>
              </TableCell>
              <TableCell className="hidden sm:table-cell">{download.date.toLocaleDateString()}</TableCell>
              <TableCell className="text-right">{download.size}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DownloadsTable;
