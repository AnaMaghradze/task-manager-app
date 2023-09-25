import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tm-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent {
  defaultColors: { [key: string]: { background: string; text: string; border?: string } } = {
    'bg-green': { background: '#1d9696', text: 'white' },
    'bg-yellow': { background: '#d36a1e', text: 'white' },
    'bg-red': { background: '#c03a38', text: 'white' },
    'bg-blue': { background: '#4a7af5', text: 'white' },
    'bg-purple': { background: '#7654C8', text: 'white' },

    'bg-green-outline': { background: '#b9f6f6', text: '#1d9696', border: '#1d9696' },
    'bg-yellow-outline': { background: '#edefdc', text: '#d36a1e', border: '#d36a1e' },
    'bg-red-outline': { background: '#f6e8ec', text: '#c03a38', border: '#c03a38' },
    'bg-blue-outline': { background: '#d4e7f7', text: '#4a7af5', border: '#4a7af5' },
    'bg-gray-outline': { background: '#dadde6', text: '#3E425D', border: '#3E425D' },
    'bg-purple-outline': { background: '#dfdef1', text: '#7345e1', border: '#7345e1' },
  };

  @Input() text: string = '';

  private _bgColor: string = 'gray';
  private _txtColor: string = 'white';
  private _borderColor: string = 'transparent';
  @Input() set tagColor(color: string) {
    this._bgColor = this.defaultColors[color]?.background ?? color;
    this._txtColor = this.defaultColors[color]?.text ?? color;
    this._borderColor = this.defaultColors[color]?.border ?? color;
  }
  get bgColor(): string {
    return this._bgColor;
  }
  get txtColor(): string {
    return this._txtColor;
  }
  get borderColor(): string {
    return this._borderColor;
  }
}
