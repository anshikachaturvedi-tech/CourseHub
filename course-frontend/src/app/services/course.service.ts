import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = sessionStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getCourses() {
    return this.http.get<any[]>(`${this.apiUrl}/courses/public`);
  }

  getCourseById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/courses/${id}`);
  }

  enroll(courseId: number) {
    const token = sessionStorage.getItem('token');
    if (!token) return throwError(() => new Error('Please login first'));
    return this.http.post(`${this.apiUrl}/enroll`, { course_id: courseId }, { headers: this.getHeaders() });
  }

  createOrder(data: { enrollment_id: number }) {
    return this.http.post(`${this.apiUrl}/payments/create-order`, data, { headers: this.getHeaders() });
  }

  verifyPayment(data: any) {
    return this.http.post(`${this.apiUrl}/payments/verify`, data, { headers: this.getHeaders() });
  }

  checkAccess(courseId: number) {
    return this.http.get(`${this.apiUrl}/enroll/status/${courseId}`, { headers: this.getHeaders() });
  }
}
