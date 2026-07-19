<script lang="ts">
    import { resolve } from '$app/paths';
    import * as m from '$lib/paraglide/messages';
</script>
  
<div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
    <div class="text-center max-w-md w-full">
        <div class="text-9xl font-extrabold text-gray-200 mb-4">
        404
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-4">
        {m.error_title()}
        </h1>
        <p class="text-gray-600 mb-6">
        {m.error_body()}
        </p>
        <div class="flex justify-center space-x-4">
        <a 
            href={resolve('/')} 
            class="px-4 py-2 border border-gray-300 bg-white text-gray-700 
                    rounded-md hover:bg-gray-100 transition-colors 
                    flex items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {m.error_home()}
        </a>
        <button 
            on:click={() => window.location.reload()}
            class="px-4 py-2 border border-gray-300 bg-white text-gray-700 
                    rounded-md hover:bg-gray-100 transition-colors 
                    flex items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {m.error_refresh()}
        </button>
        </div>
    </div>
</div>
