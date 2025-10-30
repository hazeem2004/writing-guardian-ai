import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Download, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface ResultsPanelProps {
  transformedText: string;
  similarityScore?: number;
  matchedSegments?: string[];
  paraphrasedSuggestions?: string[];
}

export const ResultsPanel = ({
  transformedText,
  similarityScore,
  matchedSegments,
  paraphrasedSuggestions,
}: ResultsPanelProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(transformedText);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([transformedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "humanized-text.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded successfully!");
  };

  const getSimilarityColor = (score: number) => {
    if (score < 0.3) return "success";
    if (score < 0.6) return "warning";
    return "destructive";
  };

  const getSimilarityIcon = (score: number) => {
    if (score < 0.3) return <CheckCircle className="h-4 w-4" />;
    if (score < 0.6) return <AlertTriangle className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  const getSimilarityLabel = (score: number) => {
    if (score < 0.3) return "Low Similarity";
    if (score < 0.6) return "Medium Similarity";
    return "High Similarity";
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Transformed Text</CardTitle>
              <CardDescription>Humanized and optimized content</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-muted p-4 font-mono text-sm whitespace-pre-wrap">
            {transformedText || "Your transformed text will appear here..."}
          </div>
        </CardContent>
      </Card>

      {similarityScore !== undefined && (
        <Card>
          <CardHeader>
            <CardTitle>Plagiarism Detection Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Similarity Score</span>
              <Badge
                variant={getSimilarityColor(similarityScore) as any}
                className="flex items-center gap-1"
              >
                {getSimilarityIcon(similarityScore)}
                {(similarityScore * 100).toFixed(1)}%
              </Badge>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  similarityScore < 0.3
                    ? "bg-success"
                    : similarityScore < 0.6
                    ? "bg-warning"
                    : "bg-destructive"
                }`}
                style={{ width: `${similarityScore * 100}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {getSimilarityLabel(similarityScore)} - {similarityScore < 0.3 
                ? "Your text appears to be original." 
                : similarityScore < 0.6 
                ? "Some similarities detected. Consider reviewing highlighted sections."
                : "High similarity detected. Review and paraphrase recommended."}
            </p>
          </CardContent>
        </Card>
      )}

      {matchedSegments && matchedSegments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Matched Segments</CardTitle>
            <CardDescription>Similar content found in sources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {matchedSegments.map((segment, idx) => (
              <div key={idx} className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm">
                {segment}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {paraphrasedSuggestions && paraphrasedSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Paraphrased Suggestions</CardTitle>
            <CardDescription>Alternative phrasings to reduce similarity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {paraphrasedSuggestions.map((suggestion, idx) => (
              <div key={idx} className="rounded-md bg-accent/10 border border-accent/20 p-3 text-sm">
                {suggestion}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
