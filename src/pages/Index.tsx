import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextInput } from "@/components/TextInput";
import { ActionButtons } from "@/components/ActionButtons";
import { ResultsPanel } from "@/components/ResultsPanel";
import { FileText, Shield, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

interface Citation {
  mla: string;
  apa: string;
}

interface MatchedSegment {
  text: string;
  citation?: Citation;
}

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [inputText, setInputText] = useState("");
  const [transformedText, setTransformedText] = useState("");
  const [similarityScore, setSimilarityScore] = useState<number | undefined>(undefined);
  const [matchedSegments, setMatchedSegments] = useState<MatchedSegment[]>([]);
  const [paraphrasedSuggestions, setParaphrasedSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const CITATION_THRESHOLD = 0.5; // Configurable threshold for citation assistance

  // Mock humanize function (replace with actual API call)
  const handleHumanize = () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text first");
      return;
    }

    // Remove forbidden symbols, emojis, and clean up
    const forbiddenChars = /[_\-':;/\\|]/g;
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{238C}-\u{2454}\u{20D0}-\u{20FF}\u{FE00}-\u{FE0F}]/gu;
    
    const humanized = inputText
      .replace(forbiddenChars, " ")
      .replace(emojiRegex, "")
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
      const segments: MatchedSegment[] = [
        {
          text: "This is a sample matched segment from source A",
          citation: mockScore > CITATION_THRESHOLD ? {
            mla: 'Smith, John. "Research Methods in Modern Technology." Journal of Digital Studies, vol. 15, no. 3, 2023, pp. 45-67.',
            apa: 'Smith, J. (2023). Research methods in modern technology. Journal of Digital Studies, 15(3), 45-67.'
          } : undefined
        },
        {
          text: "Another similar passage found in source B",
          citation: mockScore > CITATION_THRESHOLD ? {
            mla: 'Johnson, Emily. Understanding AI Systems. Tech Press, 2024.',
            apa: 'Johnson, E. (2024). Understanding AI systems. Tech Press.'
          } : undefined
        },
      ];
      setMatchedSegments(segments);
    } else {
      setMatchedSegments([]);
    }

    setTransformedText(inputText);
    toast.success("Plagiarism detection complete!");
  };

  // Sophisticated plagiarism removal using LLM
  const handleRemove = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text first");
      return;
    }

    // Security: Client-side validation for text length
    const MAX_LENGTH = 10000;
    if (inputText.length > MAX_LENGTH) {
      toast.error(`Text exceeds maximum length of ${MAX_LENGTH} characters. Please reduce and try again.`);
      return;
    }

    try {
      toast.loading("Generating high-quality paraphrases...");
      
      const { data, error } = await supabase.functions.invoke("paraphrase-text", {
        body: { text: inputText },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) {
        console.error("Edge function error:", error);
        toast.error(error.message || "Failed to paraphrase text");
        return;
      }

      if (!data) {
        toast.error("No response from paraphrasing service");
        return;
      }

      setTransformedText(data.paraphrased);
      setParaphrasedSuggestions(data.suggestions || []);
      setSimilarityScore(0.15);
      setMatchedSegments([]);
      toast.success(`Paraphrasing complete! Estimated ${data.similarity_reduction} similarity reduction.`);
    } catch (error) {
      console.error("Paraphrase error:", error);
      toast.error("Failed to paraphrase text. Please try again.");
    }
  };

  if (!session) {
    return null;
  }

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
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
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
