import { Component, ChangeDetectionStrategy, input, effect, ViewChild, ElementRef, AfterViewInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelfieRecord } from '../../models/user.model';
import { LanguageService } from '../../services/language.service';
import { Chart, registerables } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { enUS, es } from 'date-fns/locale';
import { subDays } from 'date-fns';

Chart.register(...registerables);

type TimeFrame = 'day' | 'week' | 'month' | 'year';

@Component({
  selector: 'app-progress-chart',
  templateUrl: './progress-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class ProgressChartComponent implements AfterViewInit, OnDestroy {
  languageService = inject(LanguageService);
  history = input.required<SelfieRecord[]>();
  
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;
  
  chart: Chart | null = null;
  timeFrame = signal<TimeFrame>('week');

  constructor() {
    effect(() => {
      // Re-render chart if history data, timeframe, or language changes
      this.languageService.language(); // depend on language signal
      if (this.chart) {
        this.updateChart();
      } else if (this.chartCanvas && this.history().length > 1) {
        this.createChart();
      }
    });
  }

  ngAfterViewInit() {
    if(this.history().length > 1) {
      this.createChart();
    }
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  filterData(frame: TimeFrame): { x: Date, y: number }[] {
    const now = new Date();
    let startDate: Date;

    switch (frame) {
      case 'day':
        startDate = subDays(now, 1);
        break;
      case 'week':
        startDate = subDays(now, 7);
        break;
      case 'month':
        startDate = subDays(now, 30);
        break;
      case 'year':
        startDate = subDays(now, 365);
        break;
    }

    return this.history()
      .map(record => ({ x: new Date(record.date), y: record.score }))
      .filter(record => record.x >= startDate)
      .sort((a, b) => a.x.getTime() - b.x.getTime());
  }
  
  createChart() {
    if (!this.chartCanvas) return;
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    
    if (this.chart) {
        this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: this.languageService.translate('dashboard.scoreLabel'),
          data: [],
          borderColor: 'rgb(129, 140, 248)', // indigo-400
          backgroundColor: 'rgba(129, 140, 248, 0.2)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'PP'
            },
            ticks: {
              color: '#9ca3af' // gray-400
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: '#9ca3af' // gray-400
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    });

    this.updateChart();
  }

  updateChart() {
    if (!this.chart) return;
    
    const data = this.filterData(this.timeFrame());
    
    this.chart.data.labels = data.map(d => d.x);
    this.chart.data.datasets[0].data = data as any;
    this.chart.data.datasets[0].label = this.languageService.translate('dashboard.scoreLabel');
    
    const locale = this.languageService.language() === 'es' ? es : enUS;
    if (this.chart.options.scales?.['x']?.adapters?.date) {
        this.chart.options.scales['x'].adapters.date.locale = locale;
    }
    
    this.chart.update();
  }
  
  setTimeFrame(frame: TimeFrame) {
    this.timeFrame.set(frame);
  }
}