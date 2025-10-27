import { Component, ChangeDetectionStrategy, ElementRef, ViewChild, AfterViewInit, OnDestroy, output, signal, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selfie-analyzer',
  templateUrl: './selfie-analyzer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class SelfieAnalyzerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement?: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement?: ElementRef<HTMLCanvasElement>;

  photoTaken = output<string>();
  close = output<void>();

  languageService = inject(LanguageService);
  error = signal<string | null>(null);
  stream: MediaStream | null = null;

  ngAfterViewInit() {
    this.startCamera();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  async startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (this.videoElement) {
          this.videoElement.nativeElement.srcObject = this.stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        if (err instanceof Error) {
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                this.error.set(this.languageService.translate('selfie.errorPermission'));
            } else {
                this.error.set(this.languageService.translate('selfie.errorAccess'));
            }
        } else {
            this.error.set(this.languageService.translate('selfie.errorUnknown'));
        }
      }
    } else {
      this.error.set(this.languageService.translate('selfie.errorNoSupport'));
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }

  capture() {
    if (!this.videoElement || !this.canvasElement) return;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      const base64 = dataUrl.split(',')[1];
      this.photoTaken.emit(base64);
      this.stopCamera();
    }
  }

  onClose() {
    this.close.emit();
  }
}