import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';
import { Session } from './session.model';

import 'rxjs/add/operator/toPromise';

const servicesEndpoint: string = '/api/v1/services';
const sessionsEndpoint: string = '/api/v1/sessions';

@Injectable()
export class SessionService {
    private http: Http;
    private registryApiUrl: string;
    private headers: Headers;

    constructor(http: Http, @Inject('REGISTRY_API_URL') registryApiUrl: string) {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9'
        });
        this.http = http;
        this.registryApiUrl = registryApiUrl;
    }

    getSessions(serviceId: string): Promise<Session[]> {
        return this.http.get(this.registryApiUrl + servicesEndpoint + `/${serviceId}/sessions`, { headers: this.headers })
            .toPromise()
            .then(response => {
                return response.json() as Session[];
            })
            .catch(this.handleError);
    }
    
    getSession(sessionId: string): Promise<Session> {
        return this.http.get(this.registryApiUrl + sessionsEndpoint + `/${sessionId}`, { headers: this.headers })
            .toPromise()
            .then(response => {
                return response.json() as Session;
            })
            .catch(this.handleError);
    }
    
    private handleError(error: any): Promise<any> {
        if (error.status === 404) {
            console.warn('The entity could not be found.', error);
            return undefined;
        }
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}