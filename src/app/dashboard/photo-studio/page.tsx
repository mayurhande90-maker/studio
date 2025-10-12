
'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowRight, Download, Info, Loader2, Sparkles, UploadCloud, FileImage, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useCredits } from '@/hooks/use-credits';
import { enhanceUploadedImage, EnhanceUploadedImageOutput } from '@/ai/flows/enhance-uploaded-image';
import Image from 'next/image';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';


const smartTips = [
    "Upload a clear, high-resolution photo for best results.",
    "Avoid reflections or glare on your product.",
    "Make sure your logo and label are clearly visible and centered.",
    "Natural, even lighting works best for AI enhancement.",
];

const generationMessages = [
    "Analyzing product...",
    "Enhancing lighting...",
    "Creating scene...",
    "Polishing details...",
    "Finalizing your image...",
];

const GENERATION_COST = 3;

export default function AIPhotoStudioPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [mimeType, setMimeType] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStep, setGenerationStep] = useState(0);
    const [analysisResult, setAnalysisResult] = useState<EnhanceUploadedImageOutput['analysis'] | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);
    
    const outputRef = useRef<HTMLDivElement>(null);

    const { toast } = useToast();
    const { credits, deductCredits, isLoading: isCreditsLoading } = useCredits();

    const readDataUrl = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            setFile(selectedFile);
            setMimeType(selectedFile.type);
            setGeneratedImage(null);
            setAnalysisResult(null);
            setUploadProgress(0);

            // Show preview immediately
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreview(objectUrl);

            // Simulate upload progress
            const timer = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev === null || prev >= 100) {
                        clearInterval(timer);
                         setTimeout(async () => {
                           setUploadProgress(null);
                           const dataUri = await readDataUrl(selectedFile);
                           handleImageAnalysis(dataUri, selectedFile.type);
                        }, 500);
                        return 100;
                    }
                    return prev + 20;
                });
            }, 100);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
        multiple: false,
    });

    const handleImageAnalysis = async (dataUri: string, mime: string) => {
         try {
            const response: EnhanceUploadedImageOutput = await enhanceUploadedImage({ photoDataUri: dataUri, mimeType: mime });
            setAnalysisResult(response.analysis);
        } catch (error) {
            console.error("Analysis failed:", error);
            setAnalysisResult({ productType: 'Unknown', imageQuality: 'Analysis failed', friendlyCaption: "Perfect upload! Let's see what Magicpixa can do." });
        }
    };


    const handleGenerate = async () => {
        if (!file || !mimeType) return;
        if (credits === null || credits < GENERATION_COST) {
            setShowInsufficientCredits(true);
            return;
        }

        setIsGenerating(true);
        setGeneratedImage(null);
        setGenerationStep(0);
        
        outputRef.current?.scrollIntoView({ behavior: 'smooth' });

        const stepInterval = setInterval(() => {
            setGenerationStep(prev => (prev + 1) % generationMessages.length);
        }, 2500);

        try {
            const dataUri = await readDataUrl(file);
            const response: EnhanceUploadedImageOutput = await enhanceUploadedImage({ photoDataUri: dataUri, mimeType: mimeType });
            setGeneratedImage(response.enhancedPhotoDataUri);
            setAnalysisResult(response.analysis);
            deductCredits(GENERATION_COST);
            toast({
                title: 'Success! Image Generated',
                description: `${GENERATION_COST} credits were deducted from your account.`,
            });
        } catch (error) {
            console.error('Generation Error:', error);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: 'Something went wrong. Please try again.',
            });
        } finally {
            clearInterval(stepInterval);
            setIsGenerating(false);
        }
    };
    
    const handleReset = () => {
        setFile(null);
        setPreview(null);
        setMimeType(null);
        setGeneratedImage(null);
        setAnalysisResult(null);
        setUploadProgress(null);
        setIsGenerating(false);
    };

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = 'magicpixa-studio-image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const SmartFeedbackZone = () => {
        if (uploadProgress !== null) {
             return (
                <div className="space-y-2 text-center animate-fade-in">
                    <p className="font-semibold">Uploading...</p>
                    <Progress value={uploadProgress} />
                    <p className="text-sm text-muted-foreground">Optimizing image for best results...</p>
                </div>
            )
        }

        if(isGenerating) {
            return (
                 <div className="relative w-full h-full p-8 bg-secondary/50 rounded-2xl animate-fade-in">
                    <div className="flex flex-col items-center justify-center">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="font-semibold text-lg text-foreground mt-4">{generationMessages[generationStep]}</p>
                        <p className="text-muted-foreground text-sm">Enhancing colors, fixing lighting, and adding clarity.</p>
                    </div>
                </div>
            )
        }

        if (analysisResult) {
            return (
                <div className="p-4 rounded-2xl bg-secondary/50 space-y-4 animate-fade-in">
                    <div className="flex items-center gap-4">
                        <Image src={preview!} alt="thumbnail" width={64} height={64} className="rounded-lg" />
                        <div className="flex-1">
                            <p className="font-bold text-sm truncate">{file?.name}</p>
                            <p className="text-xs text-muted-foreground">{file && (file.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                     <p className='text-base font-semibold text-center text-primary'>{analysisResult.friendlyCaption}</p>
                </div>
            )
        }
        
         if (generatedImage) {
            return (
                <div className="p-6 rounded-2xl bg-green-500/10 text-center space-y-3 animate-fade-in">
                    <h3 className="font-bold text-lg text-green-700 dark:text-green-400">✅ Done! Your image has been enhanced.</h3>
                    <p className="text-sm text-muted-foreground">This one turned out great — want to try another?</p>
                </div>
            );
        }

        return (
            <div className="p-4 rounded-2xl bg-secondary/50 space-y-3 text-center animate-fade-in">
                <p className="text-sm text-muted-foreground"><Info className="inline-block w-4 h-4 mr-1" />Upload a clear, front-facing photo for best results.</p>
                <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG (max 20MB).</p>
                <Button variant="outline" size="sm" className="mt-2">Try Sample Image</Button>
            </div>
        )
    }

    return (
        <div className="w-full space-y-8">
            <div className="text-center">
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full text-sm font-bold mb-4">
                    AI Photo Studio
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Transform Your Product Photos</h1>
                <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Upload a raw product photo, and our AI will generate a hyper-realistic, ready-to-post image in seconds.
                </p>
            </div>

            <div ref={outputRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                 {/* Preview / Generated Image Column */}
                 <div className="space-y-6">
                     <h2 className="text-2xl font-bold">
                        {generatedImage ? 'AI Generated Result' : 'Your Workspace'}
                     </h2>
                    <Card className="rounded-3xl shadow-lg overflow-hidden aspect-w-4 aspect-h-3">
                        <CardContent className="p-0">
                            {isGenerating && (
                                <div className="relative w-full h-full">
                                    <Image src={preview!} alt="Generating" layout="fill" objectFit="contain" className="opacity-30 blur-sm" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                                        <Loader2 className="w-16 h-16 text-primary animate-spin" />
                                        <p className="font-semibold text-lg text-primary-foreground mt-4">{generationMessages[generationStep]}</p>
                                    </div>
                                </div>
                            )}
                            {!isGenerating && generatedImage && (
                                <Image src={generatedImage} alt="Generated" layout="responsive" width={1024} height={768} />
                            )}
                            {!isGenerating && !generatedImage && preview && (
                                <Image src={preview} alt="Preview" layout="responsive" width={800} height={600} />
                            )}
                             {!isGenerating && !preview && (
                                <div
                                    {...getRootProps()}
                                    className={cn(
                                        'flex flex-col items-center justify-center text-center p-12 rounded-3xl cursor-pointer transition-all duration-300 h-full min-h-[400px]',
                                        isDragActive ? 'bg-primary/10 border-primary' : 'bg-secondary/30 border-transparent',
                                        'border-2 border-dashed'
                                    )}
                                >
                                    <input {...getInputProps()} />
                                    <UploadCloud className="w-16 h-16 text-primary mb-4" />
                                    <p className="text-xl font-bold">Drop your product photo here</p>
                                    <p className="text-muted-foreground">or click to upload (JPG, PNG)</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                 </div>

                {/* Control Panel Column */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Configuration & Actions</h2>
                    <Card className="rounded-3xl shadow-lg">
                        <CardContent className="p-6 space-y-6">
                           
                           <SmartFeedbackZone />
                            
                            <div className="space-y-4">
                               {generatedImage && !isGenerating ? (
                                    <div className="grid grid-cols-1 gap-4 pt-4 border-t">
                                        <Button onClick={handleReset} variant="outline" size="lg" className="rounded-2xl">
                                            <UploadCloud className="mr-2 h-4 w-4" />
                                            Upload New Image
                                        </Button>
                                        <Button onClick={handleDownload} size="lg" className="rounded-2xl">
                                            <Download className="mr-2 h-4 w-4" />
                                            Download (JPG)
                                        </Button>
                                    </div>
                               ) : (
                                <>
                                    <Button onClick={handleGenerate} size="lg" className="w-full font-bold text-lg py-7 rounded-2xl" disabled={isGenerating || !preview}>
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Creating Magic...
                                            </>
                                        ) : (
                                            <>
                                                Generate Image <ArrowRight className="ml-2 h-5 w-5" />
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-center text-sm text-muted-foreground">
                                        Generation will cost {GENERATION_COST} credits.
                                    </p>
                                </>
                               )}
                            </div>
                            
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AlertDialog open={showInsufficientCredits} onOpenChange={setShowInsufficientCredits}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Insufficient Credits</AlertDialogTitle>
                        <AlertDialogDescription>
                            You do not have enough credits to generate this image. Please recharge your credits to continue.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowInsufficientCredits(false)}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
