import { useState } from "react";
import { TextInput } from "@/components/TextInput";
import { ActionButtons } from "@/components/ActionButtons";
import { ResultsPanel } from "@/components/ResultsPanel";
import { FileText, Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [transformedText, setTransformedText] = useState("");
  const [similarityScore, setSimilarityScore] = useState<number | undefined>(undefined);
  const [matchedSegments, setMatchedSegments] = useState<string[]>([]);
  const [paraphrasedSuggestions, setParaphrasedSuggestions] = useState<string[]>([]);

  // Mock humanize function (replace with actual API call)
  const handleHumanize = () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text first");
      return;
    }

    // Simple humanization: remove forbidden symbols and clean up
    const forbiddenChars = /[_\-':;/\\|]/g;
    const humanized = inputText
      .replace(forbiddenChars, " ")
      .replace(/\s+/g, " ")
      .trim();

    setTransformedText(humanized);
    setSimilarityScore(undefined);
    setMatchedSegments([]);
    setParaphrasedSuggestions([]);
    toast.success("Text humanized successfully!");
  };

  // Mock plagiarism detection (replace with actual TF-IDF + cosine similarity)
  const handleDetect = () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text first");
      return;
    }

    // Mock detection with random score for demo
    const mockScore = Math.random() * 0.8 + 0.1;
    setSimilarityScore(mockScore);

    if (mockScore > 0.3) {
      setMatchedSegments([
        "This is a sample matched segment from source A",
        "Another similar passage found in source B",
      ]);
    } else {
      setMatchedSegments([]);
    }

    setTransformedText(inputText);
    toast.success("Plagiarism detection complete!");
  };

  // Mock plagiarism removal (replace with actual paraphrasing)
  const handleRemove = () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text first");
      return;
    }

    // Simple paraphrase simulation
    const paraphrased = inputText
      .replace(/\bhowever\b/gi, "nevertheless")
      .replace(/\bimportant\b/gi, "significant")
      .replace(/\bshows\b/gi, "demonstrates");

    setTransformedText(paraphrased);
    setParaphrasedSuggestions([
      "Consider using synonyms for repeated words",
      "Restructure long sentences for better flow",
      "Replace passive voice with active voice",
    ]);
    setSimilarityScore(0.15);
    setMatchedSegments([]);
    toast.success("Plagiarism removal suggestions generated!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  TextGuard
                </h1>
                <p className="text-sm text-muted-foreground">Plagiarism Detection & Text Humanization</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Input Text</h2>
              </div>
              <TextInput
                value={inputText}
                onChange={setInputText}
                placeholder="Paste your text here to analyze for plagiarism or humanize AI-generated content..."
              />
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-sm font-medium mb-4">Available Actions</h3>
              <ActionButtons
                onHumanize={handleHumanize}
                onDetect={handleDetect}
                onRemove={handleRemove}
                disabled={!inputText.trim()}
              />
            </div>

            {/* Info Cards */}
            <div className="grid gap-4">
              <div className="rounded-lg border bg-card p-4">
                <h4 className="font-medium text-sm mb-2">💡 Humanize</h4>
                <p className="text-xs text-muted-foreground">
                  Removes AI-ish artifacts and forbidden symbols to make text more natural
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <h4 className="font-medium text-sm mb-2">🔍 Detect</h4>
                <p className="text-xs text-muted-foreground">
                  Analyzes text using TF-IDF and cosine similarity to find matching sources
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <h4 className="font-medium text-sm mb-2">✨ Remove</h4>
                <p className="text-xs text-muted-foreground">
                  Suggests paraphrases and rewrites to reduce similarity scores
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div>
            <div className="sticky top-24">
              <ResultsPanel
                transformedText={transformedText}
                similarityScore={similarityScore}
                matchedSegments={matchedSegments}
                paraphrasedSuggestions={paraphrasedSuggestions}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Built with advanced NLP algorithms • Your text stays private • No data stored
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
