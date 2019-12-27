import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {RespuestaTopHeadlines} from '../interfaces/interfaces';
import {environment} from '../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class NoticiasService {

    private apikey = environment.newsApiKey;
    private apiUrl = environment.apiUrl;
    private readonly headers: HttpHeaders;
    private headLinesPage = 0;
    private categoriaActual: string;
    private categoriaPage: number;

    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders({
            'X-Api-key': this.apikey
        });
    }

    private ejecutarEndPoint<T>(endpoint: string) {

        endpoint = this.apiUrl + endpoint;

        const headers = this.headers;
        return this.http.get<T>(endpoint, {headers});
    }

    getTopHeadLines() {
        this.headLinesPage++;

        return this.ejecutarEndPoint<RespuestaTopHeadlines>(`/top-headlines?country=mx&page=${this.headLinesPage}`);
    }

    getTopHeadLinesCategory(categoria: string) {

        if (this.categoriaActual === categoria) {
            this.categoriaPage++;
        } else {
            this.categoriaPage = 1;
            this.categoriaActual = categoria;
        }

        return this.ejecutarEndPoint<RespuestaTopHeadlines>(`/top-headlines?country=mx&category=${categoria}&page=${this.categoriaPage}`);
    }
}
