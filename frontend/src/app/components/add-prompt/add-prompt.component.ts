import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-add-prompt',
  template: `
    <div class="container mx-auto p-6 max-w-2xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Create New Prompt</h1>
      <p class="text-gray-600 mb-8">Add a new AI image generation prompt to your library</p>

      <form [formGroup]="promptForm" (ngSubmit)="onSubmit()" class="bg-white rounded-xl shadow-lg p-8 space-y-6">
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input type="text" formControlName="title" 
                 class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="e.g., Cyberpunk Samurai at Night">
          <div *ngIf="promptForm.get('title')?.invalid && promptForm.get('title')?.touched" 
               class="mt-1 text-sm text-red-600">
            Title must be at least 3 characters
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Prompt Content *</label>
          <textarea formControlName="content" rows="6"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Detailed description of the image you want to generate..."></textarea>
          <div class="flex justify-between mt-1">
            <div *ngIf="promptForm.get('content')?.invalid && promptForm.get('content')?.touched" 
                 class="text-sm text-red-600">
              Content must be at least 20 characters
            </div>
            <span class="text-xs text-gray-500">{{promptForm.get('content')?.value?.length || 0}} chars</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Complexity Level * (1-10)</label>
          <div class="flex items-center gap-4">
            <input type="range" formControlName="complexity" min="1" max="10"
                   class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
            <span class="w-12 text-center font-bold text-lg"
                  [class.text-green-600]="promptForm.get('complexity')?.value <= 3"
                  [class.text-yellow-600]="promptForm.get('complexity')?.value > 3 && promptForm.get('complexity')?.value <= 7"
                  [class.text-red-600]="promptForm.get('complexity')?.value > 7">
              {{promptForm.get('complexity')?.value}}
            </span>
          </div>
          <p class="text-xs text-gray-500 mt-1">1 = Simple, 10 = Highly Complex</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
          <input type="text" formControlName="tags" 
                 class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="cyberpunk, samurai, neon, futuristic">
          <p class="text-xs text-gray-500 mt-1">Optional: Add tags to categorize your prompt</p>
        </div>

        <div class="flex gap-4 pt-4">
          <button type="button" (click)="goBack()" 
                  class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" [disabled]="promptForm.invalid || isSubmitting"
                  class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
            <span *ngIf="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            {{isSubmitting ? 'Creating...' : 'Create Prompt'}}
          </button>
        </div>

        <div *ngIf="errorMessage" 
             class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {{errorMessage}}
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class AddPromptComponent {
  promptForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private promptService: PromptService,
    private router: Router
  ) {
    this.promptForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      complexity: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      tags: ['']
    });
  }

onSubmit(): void {
  if (this.promptForm.invalid) return;

  this.isSubmitting = true;
  this.errorMessage = '';

  const formData = {...this.promptForm.value}; // Create a copy
  
  // Fix: Handle tags properly
  if (formData.tags && typeof formData.tags === 'string' && formData.tags.trim()) {
    formData.tags = formData.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t);
  } else {
    formData.tags = []; // Empty array if no tags
  }

  this.promptService.createPrompt(formData).subscribe({
    next: () => {
      this.router.navigate(['/prompts']);
    },
    error: (err) => {
      this.isSubmitting = false;
      this.errorMessage = err.error?.errors ? 
        Object.values(err.error.errors).join(', ') : 
        'Failed to create prompt. Please try again.';
      console.error('Error creating prompt:', err); // Add this for debugging
    }
  });
}


  goBack(): void {
    this.router.navigate(['/prompts']);
  }
}
