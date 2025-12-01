import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
  className?: string;
}

export function PDFViewer({ fileUrl, className = "" }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error: Error): void {
    console.error('Erro ao carregar PDF:', error);
    setLoading(false);
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Área do PDF */}
      <div className="flex-1 overflow-auto bg-background p-4">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Carregando PDF...</p>
          </div>
        )}

        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Carregando documento...</p>
            </div>
          }
          error={
            <div className="flex items-center justify-center h-full">
              <p className="text-destructive">Erro ao carregar o PDF. Verifique se o arquivo existe.</p>
            </div>
          }
          className="flex justify-center"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
          />
        </Document>
      </div>

      {/* Barra de navegação do PDF na parte inferior */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-card border-t">
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="h-7"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground font-medium px-1.5">
            Página {pageNumber} de {numPages || "..."}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="h-7"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="h-7 w-7"
          >
            <ZoomOut className="h-3 w-3" />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[2.5rem] text-center font-medium">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={zoomIn}
            disabled={scale >= 2.0}
            className="h-7 w-7"
          >
            <ZoomIn className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
