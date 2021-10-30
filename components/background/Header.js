export default function Header() {
    return (
        <header class="text-gray-500 w-full h-12 lg:h-20 px-3 lg:px-14 relative flex justify-between items-center mb-12 ">
            <p class="flex items-center text-sm">
                <a href="/projects" title="Go to Projects" class="flex items-center flex-shrink-0">
                    <img src="/img/logo3.svg" alt="deno logo" class="w-7 h-7 flex-shrink-0" />
                    <span class="hidden sm:inline ml-3 text-xs bg-gray-200 py-0.5 px-2 rounded-md">BETA 3</span>
                </a>
                <span class="mx-2 lg:mx-4 opacity-50">/</span>
                <span class="font-medium opacity-50 last:opacity-100 whitespace-nowrap">mwufi</span>
            </p>

            <div class="hidden lg:flex items-center space-x-8">
                <button textclass="text-sm text-gray-500" type="button" class="focus-visible:ring-2 focus-visible:ring-black focus:outline-none hover:underline  text-sm text-gray-500">+&nbsp;&nbsp;New</button>

                <a href="https://github.com/denoland/deploy_feedback" textclass="text-sm text-gray-500" external="true" target="_blank" rel="noopener noreferrer" class="focus-visible:ring-2 focus-visible:ring-black focus:outline-none hover:underline  text-sm text-gray-500">Feedback</a>

                <a href="https://deno.com/deploy/docs" textclass="text-sm text-gray-500" class="focus-visible:ring-2 focus-visible:ring-black focus:outline-none hover:underline  text-sm text-gray-500">Docs</a>

                <a href="/account" title="Go to account page">
                    <img src="https://avatars.githubusercontent.com/u/30219253?v=4" alt="Zen Tang avatar image" class="rounded-full w-7 h-7 " />
                </a>
            </div>

            <button aria-label="Navigation Menu Toggle" class="h-6 focus-visible:ring-2 focus-visible:ring-black focus:outline-none transition  text-black hover:text-gray-500 flex flex-gap-x-2 items-center justify-center pl-4 inline-block lg:hidden text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
        </header>
    )
}