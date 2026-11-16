/**
 * Web Speech Recognition API Wrapper with Hindi (hi-IN) and Indian English (en-IN) support
 */

// Extend window interface for Webkit Speech Recognition
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export interface SpeechRecognitionHandlers {
  onStart?: () => void;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export class CivicSpeechRecognizer {
  private recognition: any = null;
  public isSupported: boolean = false;
  private isListening: boolean = false;

  constructor() {
    const win = typeof window !== 'undefined' ? (window as unknown as IWindow) : null;
    const SpeechClass = win ? (win.SpeechRecognition || win.webkitSpeechRecognition) : null;

    if (SpeechClass) {
      this.isSupported = true;
      this.recognition = new SpeechClass();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
      this.recognition.lang = 'en-IN'; // Default to Indian English
    }
  }

  public setLanguage(lang: 'en-IN' | 'hi-IN') {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public start(handlers: SpeechRecognitionHandlers) {
    if (!this.isSupported || !this.recognition) {
      handlers.onError?.('Speech recognition is not supported in this browser. Please type manually.');
      return;
    }

    if (this.isListening) {
      this.stop();
    }

    this.recognition.onstart = () => {
      this.isListening = true;
      handlers.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const activeText = finalTranscript || interimTranscript;
      handlers.onResult(activeText, Boolean(finalTranscript));
    };

    this.recognition.onerror = (event: any) => {
      console.warn('Speech recognition error event:', event);
      let errorMsg = 'Microphone error occurred.';
      if (event.error === 'not-allowed') {
        errorMsg = 'Microphone access was denied. Please allow microphone permissions in browser settings.';
      } else if (event.error === 'no-speech') {
        errorMsg = 'No speech detected. Please speak into your microphone.';
      }
      handlers.onError?.(errorMsg);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      handlers.onEnd?.();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition start exception:', e);
      handlers.onError?.('Could not initiate audio capture.');
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Recognition stop exception:', e);
      }
      this.isListening = false;
    }
  }

  public getStatus(): boolean {
    return this.isListening;
  }
}
