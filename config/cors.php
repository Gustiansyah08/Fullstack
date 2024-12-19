<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Allowable Origins
    |--------------------------------------------------------------------------
    |
    | This setting defines the domains that are allowed to make requests
    | to the application. It can be a comma-separated list of domains,
    | or you can use '*' to allow all domains.
    |
    */

    'allowed_origins' => [ 
        'http://127.0.0.1:8000',          
        'http://localhost:3000',                  
    ],


    /*
    |--------------------------------------------------------------------------
    | Allowed HTTP Methods
    |--------------------------------------------------------------------------
    |
    | This option controls which HTTP methods are allowed when accessing
    | the application. You can list the methods you want to allow.
    |
    */

    'allowed_methods' => [
        'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS',
    ],

    /*
    |--------------------------------------------------------------------------
    | Allowed HTTP Headers
    |--------------------------------------------------------------------------
    |
    | This setting defines which headers can be included in requests.
    | You can specify the list of headers or allow all with '*'.
    |
    */

    'allowed_headers' => [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'X-Custom-Header',
    ],

    /*
    |--------------------------------------------------------------------------
    | Exposed Headers
    |--------------------------------------------------------------------------
    |
    | This option defines which headers are allowed to be exposed in the
    | response to the frontend. This is useful for sharing additional
    | information with the browser.
    |
    */

    'exposed_headers' => [
        'Authorization',
        'X-RateLimit',
        'X-Custom-Header',
    ],

    /*
    |--------------------------------------------------------------------------
    | Max Age
    |--------------------------------------------------------------------------
    |
    | This defines how long the preflight request (OPTIONS) can be cached
    | by the browser. You can adjust this to a suitable time (in seconds).
    |
    */

    'max_age' => 3600,

    /*
    |--------------------------------------------------------------------------
    | Supports Credentials
    |--------------------------------------------------------------------------
    |
    | This option determines whether the CORS request can include credentials
    | like cookies or HTTP authentication.
    |
    */

    'supports_credentials' => true,

];
