
export function BottomGradient() {
    return (
        <svg className="absolute bottom-0 left-10 pointer-events-none -z-10 hidden lg:block" width="1440" height="882" viewBox="0 0 1440 882" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.15" filter="url(#filter1_f)"><path d="M1359.52 1070.01C1317.6 1230.37 1004.79 1287.46 660.836 1197.54C316.887 1107.62 72.0469 904.725 113.971 744.37C155.895 584.014 468.707 526.918 812.657 616.842C850.906 626.842 1014.25 548.282 1049.79 560.862C1333.83 661.408 1396.78 927.49 1359.52 1070.01Z" fill="url(#paint1_linear)"></path></g><defs><filter id="filter1_f" x="-305.313" y="0.157196" width="2113.01" height="1703.58" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="171.687" result="effect1_foregroundBlur"></feGaussianBlur></filter><linearGradient id="paint1_linear" x1="815.677" y1="606.788" x2="756.458" y2="833.298" gradientUnits="userSpaceOnUse"><stop stop-color="#9FC4D3" stop-opacity="0"></stop><stop offset="0.0001" stop-color="#9EE3FF" stop-opacity="0"></stop><stop offset="1" stop-color="#D49DFF"></stop></linearGradient></defs></svg>
    )
}

export function CornerGradient() {
    return (
        <svg className="fixed bottom-0 left-0 pointer-events-none -z-20 hidden lg:block" width="863" height="900" viewBox="0 0 863 900" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.26" filter="url(#filter0_f)"><path d="M414.461 908.481C372.537 1068.84 59.725 1125.93 -284.224 1036.01C-628.174 946.085 -873.014 743.194 -831.09 582.839C-789.166 422.483 -476.354 365.387 -132.404 455.311C-94.1543 465.311 69.186 386.75 104.726 399.331C388.771 499.877 451.723 765.959 414.461 908.481Z" fill="url(#paint0_linear)"></path></g><defs><filter id="filter0_f" x="-1250.37" y="-161.374" width="2113.01" height="1703.58" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="171.687" result="effect1_foregroundBlur"></feGaussianBlur></filter><linearGradient id="paint0_linear" x1="-129.383" y1="445.257" x2="8.1282" y2="619.845" gradientUnits="userSpaceOnUse"><stop stop-color="#9FC4D3" stop-opacity="0"></stop><stop offset="0.0001" stop-color="#9EE3FF" stop-opacity="0"></stop><stop offset="1" stop-color="#B8E5FF"></stop></linearGradient></defs></svg>
    )
}

export default function BackgroundGradient() {
    return (
        <>
            <CornerGradient />
            <BottomGradient />
        </>
    )
}