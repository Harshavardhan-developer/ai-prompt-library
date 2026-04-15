import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PromptService, Prompt } from '../../services/prompt.service';

@Component({
  selector: 'app-prompt-list',
  template: `
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">AI Prompt Library</h1>
        <button (click)="navigateToCreate()" 
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Add Prompt
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let prompt of prompts" 
             (click)="viewDetail(prompt.id)"
             class="bg-white border rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow">
          
          <div class="flex justify-between items-start mb-3">
            <h2 class="text-xl font-semibold text-gray-800 line-clamp-2">{{prompt.title}}</h2>
            <span [class]="getComplexityColor(prompt.complexity)" 
                  class="px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2">
              Level {{prompt.complexity}}
            </span>
          </div>

          <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{prompt.content}}</p>

          <div class="flex flex-wrap gap-2 mb-4" *ngIf="prompt.tags?.length">
            <span *ngFor="let tag of prompt.tags" 
                  class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              #{{tag}}
            </span>
          </div>

          <div class="flex justify-between items-center text-sm text-gray-500 pt-4 border-t">
            <span>{{prompt.created_at | date:'mediumDate'}}</span>
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              {{prompt.view_count || 0}}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PromptListComponent implements OnInit {
  prompts: Prompt[] = [];

  constructor(
    private promptService: PromptService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPrompts();
  }

  loadPrompts(): void {
    this.promptService.getPrompts().subscribe({
      next: (data) => this.prompts = data,
      error: (err) => console.error('Error:', err)
    });
  }

  viewDetail(id: string): void {
    this.router.navigate(['/prompts', id]);
  }

  navigateToCreate(): void {
    this.router.navigate(['/add-prompt']);
  }

  getComplexityColor(level: number): string {
    if (level <= 3) return 'bg-green-100 text-green-800';
    if (level <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }
}
