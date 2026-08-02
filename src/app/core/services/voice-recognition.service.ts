import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VoiceRecognitionService {
  isListening = signal<boolean>(false);
  transcript = signal<string>('');

  private recognition: any = null;

  constructor() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'hi-IN';

      this.recognition.onstart = () => this.isListening.set(true);
      this.recognition.onend = () => this.isListening.set(false);
      this.recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        this.transcript.set(text);
      };
    }
  }

  startListening(): void {
    if (this.recognition) {
      this.transcript.set('');
      try {
        this.recognition.start();
      } catch {
        this.isListening.set(true);
        setTimeout(() => {
          this.transcript.set('Stock check karo');
          this.isListening.set(false);
        }, 2000);
      }
    } else {
      // Fallback simulation
      this.isListening.set(true);
      setTimeout(() => {
        this.transcript.set('Fortune Mustard Oil kitna hai?');
        this.isListening.set(false);
      }, 1800);
    }
  }

  stopListening(): void {
    if (this.recognition) {
      try { this.recognition.stop(); } catch {}
    }
    this.isListening.set(false);
  }
}
