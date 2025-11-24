<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\RelationJoinRequest;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],

            // Flash messages untuk notifikasi
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],

            // Pending requests count untuk badge notifikasi di sidebar
            'pendingRequestsCount' => function () use ($request) {
                // Jika user belum login, return 0
                if (!$request->user()) {
                    return 0;
                }

                // Hitung jumlah pending requests untuk relation yang user kelola sebagai owner
                return RelationJoinRequest::whereHas('relation', function ($query) use ($request) {
                    $query->whereHas('users', function ($q) use ($request) {
                        $q->where('users.id', $request->user()->id)
                          ->where('user_relation.is_owner', true);
                    });
                })
                ->where('status', RelationJoinRequest::STATUS_PENDING)
                ->count();
            },
        ];
    }
}
