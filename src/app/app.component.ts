import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { InteractionRequiredAuthError, IPublicClientApplication } from '@azure/msal-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    private msalInstance!: IPublicClientApplication;
    constructor(private authService: MsalService) {}

    ngOnInit() {
        this.authService.handleRedirectObservable().subscribe({
            next: (result) => {
                console.log('Redirect result:', result);
            },
            error: (error) => {
                console.error('Redirect error:', error);
            } 
        }); 
    }

    login() {
        this.authService.loginRedirect();
    }

    acquireToken() {
        const request = {
            scopes: ['user.read']
        };

        this.authService.acquireTokenSilent(request).toPromise().then((response) => {
            console.log('Token acquired silently:', response?.accessToken);
            // Aquí puedes llamar a tu API con el token
        }).catch((error: any) => {
            console.error('Silent token acquisition failed:', error);
            if (error instanceof InteractionRequiredAuthError) {
                // Si falla, intenta adquirir el token interactivamente
                this.authService.acquireTokenRedirect(request);
            }
        });
    }

    logout() {
        this.authService.logout();
    }
}