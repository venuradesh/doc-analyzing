import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiCallsService {
  constructor(private http: HttpClient) {}

  postFiles(files: Array<{ data: File; name: string }>) {
    const formdata = new FormData();
    files.map((file) => {
      formdata.append('file', file.data, file.name);
    });
    return this.http.post('http://localhost:5000/load-files', formdata);
  }

  postQuery(query: String) {
    this.http
      .post('http://localhost:5000/user-query', query)
      .subscribe((response) => {
        console.log(response);
      });
  }
}
