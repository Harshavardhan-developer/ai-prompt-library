import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PromptService, Prompt } from '../../services/prompt.service';

@Component({
  selector: 'app-prompt-detail',
  template: `
    <div class="container mx-auto p-6 max-w-3xl">
      <button (click)="goBack()" 
              class="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2">
        ← Back to Library
      </button>

      <div *ngIf="prompt" class="bg-white rounded-xl shadow-lg p-8">
        <div class="flex justify-between items-start mb-6">
          <h1 class="text-3xl font-bold text-gray-900">{{prompt.title}}</h1>
          <div class="flex items-center gap-3">
            <span [class]="getComplexityBadge(prompt.complexity)" 
                  class="px-3 py-1 rounded-full text-sm font-medium">
              Complexity: {{prompt.complexity}}/10
            </span>
            <span class="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
              </svg>
              {{prompt.view_count}} views
            </span>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mb-6" *ngIf="prompt.tags?.length">
          <span *ngFor="let tag of prompt.tags" 
                class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            #{{tag}}
          </span>
        </div>

        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Prompt Content</h3>
          <div class="bg-gray-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <p class="text-gray-800 whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {{prompt.content}}
            </p>
          </div>
        </div>

        <p class="text-sm text-gray-500 border-t pt-4">
          Created on {{prompt.created_at | date:'fullDate'}}
        </p>
      </div>

      <div *ngIf="!prompt" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading prompt...</p>
      </div>
    </div>
  `,
  styles: []
})
export class PromptDetailComponent implements OnInit {
  prompt: Prompt | null = null;

  constructor(
    private route: ActivatedRoute,
    private promptService: PromptService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPrompt(id);
    }
  }

  loadPrompt(id: string): void {
    this.promptService.getPrompt(id).subscribe({
      next: (data) => this.prompt = data,
      error: (err) => console.error('Error:', err)
    });
  }

  goBack(): void {
    window.history.back();
  }

  getComplexityBadge(level: number): string {
    if (level <= 3) return 'bg-green-100 text-green-800';
    if (level <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }
}
