import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Beat, Channel} from "@beats/api-interfaces";
import {Icons} from "@beats/beats-ui";

@Component({
  selector: 'beats-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements AfterViewInit {
  @Input() channel: Channel;
  @Output() deleteChannel = new EventEmitter<Channel>();
  @ViewChild('audio', {static: true}) previewElement: ElementRef<HTMLAudioElement>;
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef<HTMLInputElement>;
  private isMuted: boolean;
  private _volume: number;
  public readonly icons = Icons;

  ngAfterViewInit(): void {
    this.setPreviewElementVolume(this.channel.volume);
  }

  public onBeatClicked(beat: Beat): void {
    beat.on = !beat.on;
    if (beat.on && this.previewElement.nativeElement.src) {
      this.previewElement.nativeElement.play().then();
    }
  }

  public onUploadFile(event): void {
    const files: FileList = event.target.files;
    const file = files.item(0);
    const fileURL = URL.createObjectURL(file);
    this.channel.name = file.name;
    this.previewElement.nativeElement.src = fileURL;
    this.channel.fileURL = fileURL;
    this.previewElement.nativeElement.play().then();
  }

  public onLoadSample() {
    this.fileInput.nativeElement.click();
  }

  public onVolumeChange(event: number): void {
    this.channel.volume = event / 100;
    this.setPreviewElementVolume(this.channel.volume);
  }

  private setPreviewElementVolume(volume: number): void {
    if (volume > 0) {
      this._volume = volume;
    }
    this.previewElement.nativeElement.volume = volume;
  }

  public onMute(): void {
    this.isMuted = !this.isMuted;
    this.channel.volume = this.isMuted ? 0 : this._volume;
    this.setPreviewElementVolume(this.isMuted ? 0 : this._volume);
  }

  public onSolo(): void {
    this.channel.solo = !this.channel.solo;
  }

  onDeleteChannel(): void {
    this.deleteChannel.emit(this.channel);
  }
}
