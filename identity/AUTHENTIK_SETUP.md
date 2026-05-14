# Authentik Setup Guide for Identity Gateway

Follow these steps in your Authentik Admin interface to enable the Identity Gateway.

## Step 1: Create the OAuth2/OpenID Provider

1.  Log in to your **Authentik Admin Interface**.
2.  Go to **Protocols** -> **Providers** in the sidebar.
3.  Click **Create** and select **OAuth2/OpenID Provider**.
4.  **Name**: `Modular Identity Provider`
5.  **Authentication Flow**: Select your default authentication flow (usually `default-authentication-flow`).
6.  **Authorization Flow**: Select your default authorization flow (usually `default-provider-authorization-implicit-flow`).
7.  **Client Type**: `Confidential` (Required for our microservice).
8.  **Redirect URIs**: 
    - Add: `http://localhost:4004/api/v1/auth/callback`
    - *(Note: If you deploy this to a server later, change localhost to your domain)*.
9.  **Signing Key**: Select the default RSA key.
10. Click **Finish**.

## Step 2: Create the Application

1.  Go to **Resources** -> **Applications** in the sidebar.
2.  Click **Create**.
3.  **Name**: `Modular Identity Gateway`
4.  **Slug**: `modular-identity-gateway`
5.  **Provider**: Select the `Modular Identity Provider` you just created.
6.  Click **Finish**.

## Step 3: Get your Credentials

1.  Go back to **Protocols** -> **Providers** and click on your `Modular Identity Provider`.
2.  Copy the **Client ID**.
3.  Copy the **Client Secret**.
4.  Find the **OpenID Configuration URL** (it usually looks like `https://auth.yourdomain.com/application/o/modular-identity-gateway/.well-known/openid-configuration`).

## Step 4: Update the Identity Module .env

Open `Modular-Modules/identity/.env` and paste your credentials:

```env
AUTHENTIK_DISCOVERY_URL=Paste_OpenID_Configuration_URL_Here
AUTHENTIK_CLIENT_ID=Paste_Client_ID_Here
AUTHENTIK_CLIENT_SECRET=Paste_Client_Secret_Here
```

## Step 5: Test it!

1.  Restart your Identity microservice.
2.  Open your browser to: `http://localhost:4004/api/v1/auth/login`
3.  You should be redirected to your Authentik login page!
