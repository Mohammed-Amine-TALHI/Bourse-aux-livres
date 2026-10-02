<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| The interface lives in the React app (../Reactjs); this backend only
| exposes the JSON API defined in routes/api.php.
|
*/

Route::get('/', function () {
    return response()->json([
        'name' => config('app.name'),
        'api' => url('/api'),
    ]);
});
