import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'

export interface Prompt {
  id: string
  title: string
  content: string
  complexity: number
  created_at: string
  view_count: number
  tags?: string[]
}

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  private apiUrl = '/api/prompts/'

  constructor(private http: HttpClient) {}

  getPrompts(tag?: string): Observable<Prompt[]> {
    let params = new HttpParams()
    if (tag) params = params.set('tag', tag)
    return this.http.get<Prompt[]>(this.apiUrl, { params })
  }

  getPrompt(id: string): Observable<Prompt> {
    return this.http.get<Prompt>(`${this.apiUrl}${id}/`)
  }

  createPrompt(data: Partial<Prompt>): Observable<any> {
    return this.http.post(`${this.apiUrl}create/`, data)
  }
}
