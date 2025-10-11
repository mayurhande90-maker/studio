'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowRight, Download, Info, Loader2, Sparkles, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useCredits } from '@/hooks/use-credits';
import { enhanceUploadedImage, EnhanceUploadedImageOutput } from '@/ai/flows/enhance-uploaded-image';
import Image from 'next/image';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"


const smartTips = [
    "Upload a clear, high-resolution photo.",
    "Avoid reflections or glare on your product.",
    "Make sure your logo and label are visible.",
    "Centered products work best for AI enhancement.",
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
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStep, setGenerationStep] = useState(0);
    const [analysisResult, setAnalysisResult] = useState<{ productType: string; imageQuality: string } | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);
    
    const { toast } = useToast();
    const { credits, deductCredits, isLoading: isCreditsLoading } = useCredits();

    const [carouselApi, setCarouselApi] = useState<CarouselApi>()
    const [currentTip, setCurrentTip] = useState(0)
   
    useEffect(() => {
      if (!carouselApi) {
        return
      }
      setCurrentTip(carouselApi.selectedScrollSnap())
      carouselApi.on("select", () => {
        setCurrentTip(carouselApi.selectedScrollSnap())
      })
    }, [carouselApi])
    

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setGeneratedImage(null);
            setAnalysisResult(null);
            // Simulate upload progress
            setUploadProgress(0);
            const timer = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev === null || prev >= 100) {
                        clearInterval(timer);
                        // Simulate analysis after upload
                        setTimeout(() => {
                           handleImageAnalysis(URL.createObjectURL(selectedFile));
                        }, 500);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 100);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
        multiple: false,
    });

    const handleImageAnalysis = async (dataUri: string) => {
        try {
            // This is a mock analysis. In a real scenario, you might have a lightweight model for this.
            // For now, we'll use a part of the main flow to get this data.
            const response = await enhanceUploadedImage({ photoDataUri: dataUri });
            setAnalysisResult(response.analysis);
        } catch (error) {
            console.error("Analysis failed:", error);
            setAnalysisResult({ productType: 'Unknown', imageQuality: 'Analysis failed' });
        } finally {
            setUploadProgress(null);
        }
    };


    const handleGenerate = async () => {
        if (!file || !preview) return;
        if (credits === null || credits < GENERATION_COST) {
            setShowInsufficientCredits(true);
            return;
        }

        setIsGenerating(true);
        setGeneratedImage(null);
        setGenerationStep(0);

        const stepInterval = setInterval(() => {
            setGenerationStep(prev => (prev + 1) % generationMessages.length);
        }, 2000);

        try {
            const response: EnhanceUploadedImageOutput = await enhanceUploadedImage({ photoDataUri: preview });
            setGeneratedImage(response.enhancedPhotoDataUri);
            deductCredits(GENERATION_COST);
            toast({
                title: 'Success!',
                description: `${GENERATION_COST} credits deducted successfully.`,
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

    const renderUploadBox = () => (
        <Card className="rounded-2xl shadow-lg border-dashed border-2 hover:border-primary transition-all duration-300 hover:shadow-primary/20">
            <CardContent className="p-6">
                <div
                    {...getRootProps()}
                    className={cn(
                        'flex flex-col items-center justify-center text-center p-12 rounded-xl cursor-pointer',
                        isDragActive ? 'bg-primary/10' : 'bg-secondary/50'
                    )}
                >
                    <input {...getInputProps()} />
                    <UploadCloud className="w-16 h-16 text-primary mb-4" />
                    <p className="text-lg font-semibold">Drop your product photo here or click to upload.</p>
                    <p className="text-sm text-muted-foreground">Supports JPG, PNG formats.</p>
                </div>
            </CardContent>
        </Card>
    );
    
    const renderPreviewAndGenerate = () => (
        <div className="space-y-6">
            <Card className="rounded-2xl shadow-lg overflow-hidden">
                <CardContent className="p-0">
                    <Image
                        src={preview!}
                        alt="Uploaded product"
                        width={800}
                        height={600}
                        className="w-full h-auto object-contain"
                    />
                </CardContent>
            </Card>
            <div className="space-y-4">
                <Button onClick={handleGenerate} size="lg" className="w-full font-bold text-lg py-7" disabled={isGenerating}>
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Creating Magic... Please wait.
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
            </div>
        </div>
    );
    
    const renderGeneratedImage = () => (
        <div className="space-y-6">
            <Card className="rounded-2xl shadow-lg overflow-hidden">
                <CardContent className="p-0">
                    <Image
                        src={generatedImage!}
                        alt="Generated product image"
                        width={1024}
                        height={1024}
                        className="w-full h-auto"
                    />
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={handleGenerate} variant="outline" size="lg" disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Regenerate
                </Button>
                <Button onClick={handleReset} variant="secondary" size="lg">
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload New Image
                </Button>
                <Button onClick={handleDownload} size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Download (JPG)
                </Button>
            </div>
        </div>
    );
    
    const renderUploadingState = () => (
        <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
                <Image src={preview!} alt="Uploading" width={200} height={200} className="rounded-lg shadow-md" />
                <p className="font-semibold">Uploading your photo...</p>
                <Progress value={uploadProgress} className="w-full max-w-sm" />
                <p className="text-sm text-muted-foreground">Optimizing image for best results...</p>
            </CardContent>
        </Card>
    );

    const renderGeneratingState = () => (
        <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
                <div className="relative w-64 h-64">
                    <Image src={preview!} alt="Generating" width={256} height={256} className="rounded-lg opacity-30" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                        <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    </div>
                </div>
                <p className="font-semibold text-lg text-primary">{generationMessages[generationStep]}</p>
            </CardContent>
        </Card>
    );


    return (
        <div className="w-full">
            <div className="space-y-2 mb-8">
                <h1 className="text-3xl font-bold">AI Photo Studio</h1>
                <p className="text-muted-foreground">
                    Transform your raw product photo into a hyper-realistic image ready to post.
                </p>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Main Interaction Area */}
                <div>
                    {!preview && !isGenerating && renderUploadBox()}
                    {preview && uploadProgress !== null && renderUploadingState()}
                    {preview && uploadProgress === null && !generatedImage && !isGenerating && renderPreviewAndGenerate()}
                    {isGenerating && renderGeneratingState()}
                    {generatedImage && !isGenerating && renderGeneratedImage()}
                </div>

                {/* AI Feedback Section */}
                {analysisResult && !isGenerating && (
                        <Card className="bg-background/80 backdrop-blur-sm shadow-md transition-all animate-fade-in">
                        <CardContent className="p-4 text-center space-y-1">
                            <p className='text-sm'><span className='font-bold'>Detected Product:</span> {analysisResult.productType}</p>
                            <p className='text-sm'><span className='font-bold'>Quality:</span> {analysisResult.imageQuality}</p>
                            <p className='text-sm font-bold text-green-500'>Ready for AI enhancement.</p>
                        </CardContent>
                    </Card>
                )}
                

                {/* Smart Tip Box */}
                {!generatedImage && (
                    <Card className="rounded-xl shadow-sm bg-secondary/50">
                            <CardContent className="p-4">
                            <Carousel setApi={setCarouselApi} plugins={[Autoplay({ delay: 5000 })]} opts={{ loop: true }}>
                                <CarouselContent>
                                {smartTips.map((tip, index) => (
                                    <CarouselItem key={index}>
                                        <div className="flex items-center text-center">
                                            <Info className="w-5 h-5 mr-3 text-primary flex-shrink-0" />
                                            <p className="text-sm text-muted-foreground">{tip}</p>
                                        </div>
                                    </CarouselItem>
                                ))}
                                </CarouselContent>
                            </Carousel>
                        </CardContent>
                    </Card>
                )}
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
