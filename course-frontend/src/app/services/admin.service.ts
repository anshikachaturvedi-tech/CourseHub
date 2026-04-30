import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = environment.apiUrl + '/admin';

  constructor(private http: HttpClient) {}

  private getOptions() {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (!token) return { headers: new HttpHeaders() };
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getDataByTable(table: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${table}`, this.getOptions());
  }

  saveTeacher(teacherData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teachers`, teacherData, this.getOptions());
  }

  updateTeacher(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/teachers/${data.id}`, data, this.getOptions());
  }

  saveStudent(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, data, this.getOptions());
  }

  updateStudent(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${data.id}`, data, this.getOptions());
  }

  uploadCourse(title: string, category: string, instructor: string, file: File | null,
    status: string, validityDays: number, teacherId: number, price: number,
    level: string, description: string, videoLink: string, pdfLink: string,
    thumbnailUrl: string): Observable<any> {

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('instructor', instructor);
    formData.append('status', status);
    formData.append('validity_days', String(validityDays ?? 90));
    formData.append('teacher_id', String(teacherId ?? ''));
    formData.append('price', String(price ?? 0));
    formData.append('level', level ?? 'beginner');
    formData.append('description', description ?? '');
    formData.append('video_link', videoLink ?? '');
    formData.append('pdf_link', pdfLink ?? '');
    formData.append('thumbnailUrl', thumbnailUrl ?? '');
    if (file) formData.append('file', file);

    return this.http.post(`${this.apiUrl}/courses/add`, formData, this.getOptions());
  }

  updateCourse(courseData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/courses/${courseData.id}`, courseData, this.getOptions());
  }

  deleteContent(table: string, id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${table}/${id}`, this.getOptions());
  }

  restoreUser(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/restore/${id}`, {}, this.getOptions());
  }

  savePayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payments/add`, paymentData, this.getOptions());
  }

  getTeachers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/teachers`, this.getOptions());
  }

  getStudentsWithCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users-with-courses`, this.getOptions());
  }

  getCourseContent(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/course-content/${courseId}`, this.getOptions());
  }

  deleteCourseContent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/course-content/${id}`, this.getOptions());
  }

  addCourseContents(courseId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/contents`, formData, this.getOptions());
  }

  updateCourseContent(contentId: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/contents/${contentId}`, formData, this.getOptions());
  }

  getPayments(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/payments`, this.getOptions());
  }
}
