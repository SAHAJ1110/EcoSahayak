import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { analyzeCivicPhoto, isGeminiConfigured } from '../services/geminiService';
import { CivicSpeechRecognizer } from '../services/speechService';
import { findPotentialDuplicates, DuplicateMatch } from '../services/duplicateService';
import { LeafletMap } from '../components/heatmap/LeafletMap';
import { SeverityBadge, CategoryBadge } from '../components/common/Badge';
import { ComplaintCategory, ComplaintSeverity } from '../types';
import {
  Camera,
  Upload,
  Mic,
  MicOff,
  MapPin,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ThumbsUp,
  RefreshCw,
  Info,
  HelpCircle,
  X,
  Compass
} from 'lucide-react';

// Sample benchmark photos for immediate 1-click college presentation testing
const SAMPLE_CIVIC_PHOTOS = [
  {
    label: 'Road Pothole',
    category: 'pothole',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    context: 'Deep pothole on carriageway',
  },
  {
    label: 'Garbage Dump',
    category: 'garbage',
    url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    context: 'Overflowing municipal garbage heap on footpath',
  },
  {
    label: 'Water Pipeline Leak',
    category: 'water_leakage',
    url: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80',
    context: 'Burst drinking water pipeline wasting clean water',
  },
  {
    label: 'Blocked Drain / Nala',
    category: 'blocked_drainage',
    url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    context: 'Drain choked with plastic debris and stagnant black water',
  },
];

export const ReportIssuePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { complaints, addComplaint, supportComplaint } = useComplaints();

  // Form states
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('garbage');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [severity, setSeverity] = useState<ComplaintSeverity>('medium');
  const [affectedPopulation, setAffectedPopulation] = useState<number>(50);

  // Location states
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 28.6315,
    lng: 77.2167, // Central Delhi
  });
  const [address, setAddress] = useState('Connaught Place, Central Delhi, 110001');
  const [landmark, setLandmark] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Voice recording states
  const [isListening, setIsListening] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const speechRecognizerRef = useRef<CivicSpeechRecognizer | null>(null);

  // Duplicate detection states
  const [duplicateMatches, setDuplicateMatches] = useState<DuplicateMatch[]>([]);
  const [supportedDuplicateId, setSupportedDuplicateId] = useState<string | null>(null);

  // Submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Initialize Speech Recognizer
  useEffect(() => {
    speechRecognizerRef.current = new CivicSpeechRecognizer();
    return () => {
      speechRecognizerRef.current?.stop();
    };
  }, []);

  // Update duplicate detection when location, category or title changes
  useEffect(() => {
    if (coordinates.lat && coordinates.lng && category) {
      const matches = findPotentialDuplicates(
        {
          category,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          title,
          description,
        },
        complaints
      );
      setDuplicateMatches(matches);
    }
  }, [coordinates, category, title, description, complaints]);

  // Handle Photo File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      triggerAiAnalysis(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  // Handle 1-click sample photo selection
  const handleSelectSamplePhoto = async (sample: typeof SAMPLE_CIVIC_PHOTOS[0]) => {
    setImagePreview(sample.url);
    setIsAnalyzingImage(true);
    setSubmissionError(null);

    try {
      const result = await analyzeCivicPhoto(sample.url, 'image/jpeg', sample.context);
      applyAiAnalysis(result);
    } catch (err) {
      console.error('Sample analysis error:', err);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // Trigger Gemini Vision Analysis
  const triggerAiAnalysis = async (imageBase64: string, mimeType: string = 'image/jpeg') => {
    setIsAnalyzingImage(true);
    setSubmissionError(null);

    try {
      const result = await analyzeCivicPhoto(imageBase64, mimeType, voiceTranscript || title);
      applyAiAnalysis(result);
    } catch (err: any) {
      console.warn('Gemini image analysis failed:', err);
      setSubmissionError('AI Image detection encountered an issue. You can still fill details manually.');
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const applyAiAnalysis = (result: any) => {
    setAiAnalysisResult(result);
    if (result.title) setTitle(result.title);
    if (result.description) setDescription(result.description);
    if (result.category) setCategory(result.category);
    if (result.severity) setSeverity(result.severity);
    if (result.affectedPopulationEstimate) setAffectedPopulation(result.affectedPopulationEstimate);
    if (Array.isArray(result.tags) && result.tags.length > 0) {
      setTags(result.tags);
    }
  };

  // Toggle Voice Recording
  const toggleVoiceRecording = () => {
    const recognizer = speechRecognizerRef.current;
    if (!recognizer) return;

    if (isListening) {
      recognizer.stop();
      setIsListening(false);
    } else {
      recognizer.setLanguage(speechLanguage);
      recognizer.start({
        onStart: () => setIsListening(true),
        onResult: (text) => {
          setVoiceTranscript(text);
          if (!description) {
            setDescription(text);
          } else {
            setDescription(prev => `${prev} ${text}`);
          }
        },
        onError: (err) => {
          setIsListening(false);
          console.warn('Speech recognition notice:', err);
        },
        onEnd: () => setIsListening(false),
      });
    }
  };

  // Handle Geolocation
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoordinates({ lat, lng });
        setAddress(`GPS Location (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`);
      },
      (err) => {
        setIsLocating(false);
        console.warn('GPS permission denied or unavailable:', err);
        alert('Could not access current location. Please pick location directly on the map.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Add Tag
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Upvote Existing Duplicate Instead of Filing Duplicate
  const handleSupportExisting = (complaintId: string) => {
    supportComplaint(complaintId);
    setSupportedDuplicateId(complaintId);
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setSubmissionError('Please provide a title or describe the problem.');
      return;
    }

    if (!address.trim()) {
      setSubmissionError('Please specify an address or drop a pin on the map.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const newReport = await addComplaint({
        userId: currentUser?.id || 'citizen-guest',
        userName: currentUser?.fullName || 'Concerned Citizen',
        userPhone: currentUser?.phone || '+91 98765 00000',
        title: title.trim(),
        description: description.trim() || 'Civic defect reported via EcoSahayak web app.',
        category,
        tags: tags.length > 0 ? tags : [category, 'civic'],
        severity,
        aiSeverity: aiAnalysisResult?.severity,
        aiConfidence: aiAnalysisResult?.confidence,
        aiSuggestedAction: aiAnalysisResult?.suggestedAction,
        aiDetectedIssue: aiAnalysisResult?.detectedIssue,
        affectedPopulationEstimate: affectedPopulation,
        status: 'pending',
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        address: address.trim(),
        landmark: landmark.trim(),
        imageUrl: imagePreview || 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
        voiceTranscript: voiceTranscript || undefined,
      });

      setSubmissionSuccess(newReport.trackingId);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setSubmissionError('Could not record complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If successfully submitted, show celebration modal/card
  if (submissionSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#3E7C4A]/30 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#EAF2E8] text-[#3E7C4A] mx-auto flex items-center justify-center border-4 border-[#3E7C4A]/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-[#F2A900] bg-[#FFF8E7] px-3 py-1 rounded-full border border-[#F2A900]/40">
              {submissionSuccess}
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#244D30]">
              Grievance Successfully Registered!
            </h2>
            <p className="text-sm text-[#29332B]/80 max-w-lg mx-auto font-sans">
              Your report has been logged in the municipal database and dispatched to the ward engineer.
              Once resolved and verified by municipal officers, you will earn Eco-Points!
            </p>
          </div>

          <div className="bg-[#FFF8E7] p-4 rounded-2xl border border-[#F2A900]/30 max-w-md mx-auto text-xs text-[#244D30] font-sans space-y-1">
            <div className="font-semibold flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-[#F2A900]" />
              <span>Make.com & Google Sheets Automated Sync</span>
            </div>
            <p className="text-[11px] text-[#29332B]/80">
              Payload transmitted to municipal central spreadsheet for Looker Studio analytics.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setSubmissionSuccess(null);
                setImagePreview(null);
                setAiAnalysisResult(null);
                setTitle('');
                setDescription('');
                setVoiceTranscript('');
              }}
              className="px-6 py-3 rounded-xl bg-[#3E7C4A] text-white font-heading font-bold text-sm hover:bg-[#32643B] transition-colors shadow-md"
            >
              Report Another Issue
            </button>
            <button
              onClick={() => navigate('/my-reports')}
              className="px-6 py-3 rounded-xl bg-white text-[#244D30] border border-[#3E7C4A]/40 font-heading font-bold text-sm hover:bg-[#EAF2E8] transition-colors"
            >
              View in My Reports
            </button>
            <button
              onClick={() => navigate('/heatmap')}
              className="px-6 py-3 rounded-xl bg-[#F2A900] text-[#244D30] font-heading font-bold text-sm hover:bg-[#D69400] transition-colors"
            >
              Locate on Heatmap
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2E8] text-[#3E7C4A] text-xs font-semibold border border-[#3E7C4A]/30">
          <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
          <span>Multimodal AI Citizen Reporter</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#244D30]">
          Report a Community Problem
        </h1>
        <p className="text-sm text-[#29332B]/80 font-sans max-w-2xl">
          Upload a photo or speak in Hindi/English. Google Gemini automatically identifies the defect, suggests category & severity, and checks for existing duplicates in your area.
        </p>
      </div>

      {submissionError && (
        <div className="bg-red-50 border border-red-300 rounded-2xl p-4 text-xs text-red-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{submissionError}</span>
          </div>
          <button onClick={() => setSubmissionError(null)} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Step 1: Multimodal Photo Upload / Camera */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#3E7C4A]/20 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#3E7C4A] text-white flex items-center justify-center font-heading font-bold text-sm">
                1
              </div>
              <h2 className="text-lg font-heading font-bold text-[#244D30]">
                Photo Evidence & Gemini Vision Analysis
              </h2>
            </div>
            <span className="text-xs text-[#3E7C4A] font-semibold bg-[#EAF2E8] px-2.5 py-1 rounded-full">
              {isGeminiConfigured ? 'Gemini 1.5 Flash Connected' : 'Smart Civic Heuristic Active'}
            </span>
          </div>

          {/* Upload Area & Quick Samples */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7">
              <label
                htmlFor="photo-upload"
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all ${
                  imagePreview
                    ? 'border-[#3E7C4A] bg-[#EAF2E8]/20'
                    : 'border-[#3E7C4A]/40 bg-[#FFF8E7]/40 hover:bg-[#EAF2E8]/30'
                }`}
              >
                {imagePreview ? (
                  <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-inner">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="bg-white/90 text-[#244D30] text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Change Photo</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-3 py-8">
                    <div className="w-14 h-14 rounded-2xl bg-[#EAF2E8] text-[#3E7C4A] flex items-center justify-center mx-auto shadow-xs">
                      <Camera className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-heading font-bold text-[#244D30]">
                        Click to take a photo or drag & drop
                      </p>
                      <p className="text-xs text-[#29332B]/70 font-sans">
                        Supports JPG, PNG, WEBP up to 10MB
                      </p>
                    </div>
                  </div>
                )}
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* 1-Click Sample Benchmarks for instant live demo */}
              <div className="mt-4 space-y-2">
                <span className="text-[11px] font-semibold text-[#29332B]/70 uppercase tracking-wide">
                  Or test with 1-click sample civic photos:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_CIVIC_PHOTOS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSamplePhoto(sample)}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#FFF8E7] text-[#244D30] border border-[#F2A900]/40 hover:bg-[#F2A900] hover:text-[#244D30] transition-colors"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Analysis Preview Box */}
            <div className="md:col-span-5 flex flex-col justify-between bg-[#EAF2E8]/40 border border-[#3E7C4A]/20 rounded-2xl p-5">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#3E7C4A]/20">
                  <span className="font-heading font-bold text-xs text-[#244D30] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#F2A900]" />
                    <span>AI Detection Readout</span>
                  </span>
                  {isAnalyzingImage && (
                    <span className="flex items-center gap-1 text-[11px] text-[#3E7C4A] animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Analyzing...</span>
                    </span>
                  )}
                </div>

                {isAnalyzingImage ? (
                  <div className="py-12 text-center space-y-2">
                    <RefreshCw className="w-8 h-8 text-[#3E7C4A] animate-spin mx-auto" />
                    <p className="text-xs font-semibold text-[#244D30]">Gemini Vision inspecting image features...</p>
                    <p className="text-[11px] text-[#29332B]/70">Classifying defect, hazard level & tags</p>
                  </div>
                ) : aiAnalysisResult ? (
                  <div className="space-y-3 pt-3 text-xs font-sans">
                    <div>
                      <span className="text-[10px] text-[#29332B]/70 uppercase font-semibold">Detected Issue:</span>
                      <p className="font-bold text-[#244D30] text-sm">{aiAnalysisResult.detectedIssue || aiAnalysisResult.title}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#29332B]/70 uppercase font-semibold">Confidence:</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#3E7C4A] text-white font-mono font-bold text-[11px]">
                        {aiAnalysisResult.confidence}%
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#3E7C4A]/20 space-y-1">
                      <span className="text-[10px] font-bold text-[#3E7C4A] uppercase">AI Municipal Action:</span>
                      <p className="text-[11px] text-[#29332B] italic">"{aiAnalysisResult.suggestedAction}"</p>
                    </div>

                    <p className="text-[10px] text-[#29332B]/70 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      ℹ️ AI assessments are recommendations. You can edit any field below.
                    </p>
                  </div>
                ) : (
                  <div className="py-10 text-center text-xs text-[#29332B]/70 space-y-2 font-sans">
                    <Info className="w-6 h-6 text-[#3E7C4A] mx-auto" />
                    <p>Upload a photo above to trigger automatic defect categorization and severity calculation.</p>
                  </div>
                )}
              </div>

              {imagePreview && !isAnalyzingImage && (
                <button
                  type="button"
                  onClick={() => triggerAiAnalysis(imagePreview)}
                  className="mt-4 w-full py-2 rounded-xl text-xs font-heading font-semibold bg-[#3E7C4A] text-white hover:bg-[#32643B] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-analyze Image</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Voice Reporting & Issue Description */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#3E7C4A]/20 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#3E7C4A] text-white flex items-center justify-center font-heading font-bold text-sm">
                2
              </div>
              <h2 className="text-lg font-heading font-bold text-[#244D30]">
                Issue Details & Voice Reporting
              </h2>
            </div>

            {/* Language toggle for speech */}
            <div className="flex items-center gap-1 bg-[#EAF2E8] p-1 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setSpeechLanguage('en-IN')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  speechLanguage === 'en-IN' ? 'bg-[#3E7C4A] text-white font-bold' : 'text-[#244D30]'
                }`}
              >
                English (IN)
              </button>
              <button
                type="button"
                onClick={() => setSpeechLanguage('hi-IN')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  speechLanguage === 'hi-IN' ? 'bg-[#3E7C4A] text-white font-bold' : 'text-[#244D30]'
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>

          {/* Voice Input Action Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFF8E7] border border-[#F2A900]/40">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-300'
                    : 'bg-[#F2A900] text-[#244D30] hover:bg-[#D69400]'
                }`}
                title={isListening ? 'Stop Recording' : 'Start Speech to Text'}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              <div>
                <div className="font-heading font-bold text-sm text-[#244D30]">
                  {isListening ? 'Listening to speech... Speak clearly' : 'Report via Voice (Speech Recognition)'}
                </div>
                <div className="text-xs text-[#29332B]/70 font-sans">
                  {isListening
                    ? `Live audio stream active in ${speechLanguage === 'hi-IN' ? 'Hindi' : 'Indian English'}`
                    : 'Press microphone to speak; your words will be transcribed automatically.'}
                </div>
              </div>
            </div>
            {isListening && (
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold animate-pulse">
                Recording Active
              </span>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-heading font-bold text-[#244D30] uppercase mb-1">
                Complaint Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Hazardous Road Crater on Main Market Road"
                className="w-full px-4 py-2.5 rounded-xl border border-[#3E7C4A]/30 focus:outline-none focus:ring-2 focus:ring-[#3E7C4A] bg-[#FFF8E7]/30 text-sm font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading font-bold text-[#244D30] uppercase mb-1">
                  Civic Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#3E7C4A]/30 focus:outline-none focus:ring-2 focus:ring-[#3E7C4A] bg-white text-sm font-sans"
                >
                  <option value="garbage">Solid Waste / Garbage Dumping</option>
                  <option value="pothole">Road Crater / Dangerous Pothole</option>
                  <option value="water_leakage">Municipal Water Pipeline Leakage</option>
                  <option value="blocked_drainage">Blocked Storm Drain / Sewage Choke</option>
                  <option value="broken_streetlight">Broken Streetlight / Dark Corridor</option>
                  <option value="waterlogging">Severe Waterlogging / Flood</option>
                  <option value="other">Other Civic Defect</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#244D30] uppercase mb-1 flex items-center justify-between">
                  <span>Smart Priority Severity</span>
                  <span className="text-[10px] text-[#3E7C4A] font-mono">AI Recommended</span>
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as ComplaintSeverity)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#3E7C4A]/30 focus:outline-none focus:ring-2 focus:ring-[#3E7C4A] bg-white text-sm font-sans"
                >
                  <option value="low">Low Priority (Minor inconvenience, &lt;20 citizens)</option>
                  <option value="medium">Medium Priority (Noticeable defect, 20-100 citizens)</option>
                  <option value="high">High Priority (Hazardous obstacle, 100-300 citizens)</option>
                  <option value="critical">Critical Alert (Accident risk / Severe disease vector, &gt;300 citizens)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-[#244D30] uppercase mb-1">
                Detailed Description / Voice Transcript
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem, visible hazards, how long it has persisted, and affected public..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#3E7C4A]/30 focus:outline-none focus:ring-2 focus:ring-[#3E7C4A] bg-[#FFF8E7]/30 text-sm font-sans"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-heading font-bold text-[#244D30] uppercase mb-1">
                Keywords & Tags
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EAF2E8] text-[#244D30] text-xs font-medium border border-[#3E7C4A]/30"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add custom tag (e.g. ward-14, school-zone)"
                  className="px-3 py-1.5 rounded-xl border border-[#3E7C4A]/30 text-xs font-sans w-64"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 rounded-xl bg-[#3E7C4A] text-white text-xs font-semibold hover:bg-[#32643B]"
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Location & Duplicate Safeguard */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#3E7C4A]/20 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#3E7C4A] text-white flex items-center justify-center font-heading font-bold text-sm">
                3
              </div>
              <h2 className="text-lg font-heading font-bold text-[#244D30]">
                Incident Location & Smart Duplicate Check
              </h2>
            </div>
            <button
              type="button"
              onClick={detectCurrentLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF2E8] text-[#3E7C4A] hover:bg-[#3E7C4A] hover:text-white transition-colors text-xs font-semibold border border-[#3E7C4A]/30"
            >
              <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Acquiring GPS...' : 'Use My Current Location'}</span>
            </button>
          </div>

          <p className="text-xs text-[#29332B]/70 font-sans">
            Click on the map below or drag the marker to pinpoint the exact location.
          </p>

          {/* Interactive Leaflet Picker */}
          <LeafletMap
            complaints={complaints}
            isPickerMode={true}
            pickerCoordinates={coordinates}
            onLocationSelect={(lat, lng) => {
              setCoordinates({ lat, lng });
              setAddress(`Location (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`);
            }}
            height="360px"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading font-bold text-[#244D30] uppercase mb-1">
                Civic Address / Road Name *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Near Metro Gate 3, Connaught Place"
                className="w-full px-4 py-2.5 rounded-xl border border-[#3E7C4A]/30 focus:outline-none focus:ring-2 focus:ring-[#3E7C4A] bg-[#FFF8E7]/30 text-sm font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-bold text-[#244D30] uppercase mb-1">
                Landmark (Optional)
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Behind SBI ATM, Opposite City Hospital"
                className="w-full px-4 py-2.5 rounded-xl border border-[#3E7C4A]/30 focus:outline-none focus:ring-2 focus:ring-[#3E7C4A] bg-[#FFF8E7]/30 text-sm font-sans"
              />
            </div>
          </div>

          {/* Duplicate Detection Alert Banner */}
          {duplicateMatches.length > 0 && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-heading font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-[#F2A900] shrink-0" />
                <span>
                  Possible Duplicate Reports Found Nearby ({duplicateMatches.length})
                </span>
              </div>
              <p className="text-xs text-amber-800 font-sans leading-relaxed">
                A similar civic issue was already reported within 350 meters. Instead of submitting a redundant report,
                you can upvote and support the existing report. More citizen upvotes accelerate municipal response!
              </p>

              <div className="space-y-3 pt-2">
                {duplicateMatches.slice(0, 2).map(({ complaint, distanceMeters, score, reasons }) => {
                  const isSupported = complaint.supportedByCurrentUser || supportedDuplicateId === complaint.id;
                  return (
                    <div
                      key={complaint.id}
                      className="bg-white rounded-xl p-4 border border-amber-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#3E7C4A]">{complaint.trackingId}</span>
                          <SeverityBadge severity={complaint.severity} size="sm" />
                          <span className="text-[11px] text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded-md">
                            {score}% Similarity
                          </span>
                        </div>
                        <h4 className="font-heading font-bold text-xs text-[#244D30]">{complaint.title}</h4>
                        <p className="text-[11px] text-[#29332B]/70">{complaint.address} • {distanceMeters}m away</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSupportExisting(complaint.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                          isSupported
                            ? 'bg-[#3E7C4A] text-white'
                            : 'bg-[#F2A900] text-[#244D30] hover:bg-[#D69400] shadow-xs'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{isSupported ? 'Supported!' : `Support this (${complaint.supporterCount})`}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="text-xs text-[#29332B]/70 font-sans">
            Submitting as: <b className="text-[#244D30]">{currentUser?.fullName || 'Citizen User'}</b> • Earn Eco-Points upon resolution
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#F2A900] text-[#244D30] font-heading font-extrabold text-base hover:bg-[#D69400] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Recording & Dispatching to Ward...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Submit Grievance to Municipal Board</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
