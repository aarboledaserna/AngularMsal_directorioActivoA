import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MsalModule, MsalInterceptor, MsalGuard, MsalGuardConfiguration, MSAL_INSTANCE, MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType, IPublicClientApplication } from '@azure/msal-browser';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';

export function msalInstanceFactory() : IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.azureConfig.clientId,
      redirectUri: environment.azureConfig.redirectUri,
      authority: 'https://login.microsoftonline.com/'+environment.azureConfig.tenantId,
      postLogoutRedirectUri: environment.azureConfig.redirectUri
    }
  });

}

export function MSALInterceptorConfigFactory(): any {
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap: new Map([
      ['https://graph.microsoft.com/v1.0/me', ['user.read']]
    ])
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration{
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read']
    }
  };
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        MsalModule.forRoot(msalInstanceFactory(),MSALGuardConfigFactory(), MSALInterceptorConfigFactory())  
    ],
    providers: [
        {
            provide: MSAL_INSTANCE,
            useFactory: msalInstanceFactory
        },
        {
            provide: MSAL_GUARD_CONFIG,
            useFactory: MSALGuardConfigFactory
        },

        {
          provide: MSAL_INTERCEPTOR_CONFIG,
          useFactory: MSALInterceptorConfigFactory
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
