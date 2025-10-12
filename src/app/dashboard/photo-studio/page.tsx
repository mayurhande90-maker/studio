
'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowRight, Download, Info, Loader2, UploadCloud, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useCredits } from '@/hooks/use-credits';
import { enhanceUploadedImage, EnhanceUploadedImageOutput } from '@/ai/flows/enhance-uploaded-image';
import Image from 'next/image';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';


const generationMessages = [
    { text: "Analyzing product...", percentage: 10 },
    { text: "Enhancing lighting...", percentage: 30 },
    { text: "Creating cinematic scene...", percentage: 60 },
    { text: "Polishing details...", percentage: 80 },
    { text: "Finalizing your image...", percentage: 95 },
];

const GENERATION_COST = 3;

export default function AIPhotoStudioPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [mimeType, setMimeType] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStep, setGenerationStep] = useState(0);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [analysisResult, setAnalysisResult] = useState<EnhanceUploadedImageOutput['analysis'] | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);
    
    const outputRef = useRef<HTMLDivElement>(null);

    const { toast } = useToast();
    const { credits, deductCredits } = useCredits();

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

            const objectUrl = URL.createObjectURL(selectedFile);
            setPreview(objectUrl);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
        multiple: false,
    });


    const handleGenerate = async () => {
        if (!file || !mimeType) return;
        if (credits === null || credits < GENERATION_COST) {
            setShowInsufficientCredits(true);
            return;
        }

        setIsGenerating(true);
        setGeneratedImage(null);
        setGenerationStep(0);
        setGenerationProgress(0);
        
        outputRef.current?.scrollIntoView({ behavior: 'smooth' });

        const stepInterval = setInterval(() => {
            setGenerationStep(prev => {
                const nextStep = (prev + 1) % generationMessages.length;
                setGenerationProgress(generationMessages[nextStep].percentage);
                return nextStep;
            });
        }, 2000);

        try {
            const dataUri = await readDataUrl(file);
            const response: EnhanceUploadedImageOutput = await enhanceUploadedImage({ photoDataUri: dataUri, mimeType: mimeType });
            setGeneratedImage(response.enhancedPhotoDataUri);
            setAnalysisResult(response.analysis);
            deductCredits(GENERATION_COST);
            setGenerationProgress(100);
            toast({
                title: 'Success! Image Generated',
                description: `${GENERATION_COST} credits were deducted.`,
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
        setIsGenerating(false);
        setGenerationProgress(0);
    };
    
    const handleRegenerate = () => {
        // Reset generated image but keep the uploaded file to re-run
        setGeneratedImage(null);
        handleGenerate();
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

            <div ref={outputRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                 {/* Workspace Column */}
                 <div className="space-y-6 flex flex-col">
                     <h2 className="text-2xl font-bold">
                        {generatedImage ? 'Your Masterpiece ✨' : 'Your Workspace'}
                     </h2>
                    <Card className="rounded-3xl shadow-lg overflow-hidden aspect-w-4 aspect-h-3 bg-secondary/30 flex-1">
                        <CardContent className="p-0 relative h-full">
                            {/* Base Preview Image */}
                            {preview && (
                                <Image 
                                    src={generatedImage || preview} 
                                    alt={generatedImage ? "Generated" : "Preview"}
                                    layout="fill" 
                                    objectFit="cover"
                                    className={cn('transition-all duration-500', {
                                        'blur-lg scale-105': isGenerating,
                                    })}
                                />
                            )}
                            
                            {/* Generation Overlay */}
                            {isGenerating && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-8 text-center">
                                    <ImageIcon className="w-16 h-16 text-primary animate-pulse" />
                                    <p className="font-bold text-2xl text-primary-foreground mt-4">{generationMessages[generationStep].text}</p>
                                    <p className="text-muted-foreground mt-2">Our AI is creating magic. Please wait a moment.</p>
                                    <Progress value={generationProgress} className="w-3/4 mt-6 h-3" />
                                    <p className="text-primary-foreground font-mono text-sm mt-2">{generationProgress}%</p>
                                </div>
                            )}

                             {generatedImage && !isGenerating && (
                                <div className="absolute top-4 right-4">
                                     <Button onClick={handleRegenerate} variant="outline" size="icon" className="rounded-full h-10 w-10 bg-black/50 hover:bg-black/70 text-white">
                                        <RefreshCw className="h-5 w-5" />
                                        <span className="sr-only">Regenerate</span>
                                    </Button>
                                </div>
                            )}
                            
                            {/* Upload Dropzone */}
                             {!preview && (
                                <div
                                    {...getRootProps()}
                                    className={cn(
                                        'flex flex-col items-center justify-center text-center p-12 rounded-3xl cursor-pointer transition-all duration-300 h-full min-h-[400px]',
                                        isDragActive ? 'bg-primary/10 border-primary' : 'border-transparent',
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
                <div className="flex flex-col space-y-6">
                    <Card className="rounded-3xl shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                           <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/50 animate-fade-in">
                                <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <div className="space-y-1">
                                    <p className="font-semibold text-foreground">
                                        {analysisResult ? analysisResult.friendlyCaption : 'Upload a clear, front-facing photo for best results.'}
                                    </p>
                                    {analysisResult && (
                                       <div className="text-xs text-muted-foreground">
                                           <span>Detected: <strong>{analysisResult.productType}</strong></span> | <span>Quality: <strong>{analysisResult.imageQuality}</strong></span>
                                       </div>
                                   )}
                                </div>
                           </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-3xl shadow-lg flex-1">
                        <CardHeader>
                             <CardTitle className="text-2xl font-bold">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {generatedImage && !isGenerating ? (
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button onClick={handleDownload} size="lg" className="rounded-2xl">
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </Button>
                                        <Button onClick={handleReset} variant="secondary" size="lg" className="rounded-2xl">
                                            <UploadCloud className="mr-2 h-4 w-4" />
                                            Start New
                                        </Button>
                                    </div>
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
                                    This will cost {GENERATION_COST} credits.
                                </p>
                            </>
                           )}
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
