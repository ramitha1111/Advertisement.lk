import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
    {
        image: 'https://indianmediastudies.com/wp-content/uploads/2023/11/what-is-advertising-copy.jpeg',
        heading: 'Post Your Ads Effortlessly',
        subtext: 'Reach thousands of potential customers within minutes.',
    },
    {
        image: 'https://gingermediagroup.com/wp-content/uploads/2024/01/commercial-advertisement-images-1024x576.jpg',
        heading: 'Buy & Sell in One Place',
        subtext: 'From electronics to real estate, we’ve got you covered.',
    },
    {
        image: 'https://i.ytimg.com/vi/9xwUI2uJtKA/maxresdefault.jpg',
        heading: 'Find Anything You Need',
        subtext: 'Search, filter, and connect – all in one platform.',
    },
    {
        image: 'https://gingermediagroup.com/wp-content/uploads/2023/12/nature-scope-of-advertising.jpg',
        heading: 'Advertise Smarter',
        subtext: 'Powerful tools to get your ads seen by the right people.',
    },
    {
        image: 'https://www.vistarmedia.com/hs-fs/hubfs/McDonald%E2%80%99s_%20Tempting%20your%20taste%20buds.png?width=919&height=460&name=McDonald%E2%80%99s_%20Tempting%20your%20taste%20buds.png',
        heading: 'Grow Your Reach',
        subtext: 'Join the top platform for local advertisements in Sri Lanka.',
    },
]

const HeroSlider = () => {
    const [current, setCurrent] = useState(0)
    const intervalRef = useRef(null)
    const [fade, setFade] = useState(true)

    const startAutoSlide = () => {
        stopAutoSlide()
        intervalRef.current = setInterval(() => {
            nextSlide()
        }, 7000)
    }

    const stopAutoSlide = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }
    }

    const nextSlide = () => {
        setFade(false)
        setTimeout(() => {
            setCurrent((prev) => (prev + 1) % slides.length)
            setFade(true)
        }, 300)
    }

    const prevSlide = () => {
        setFade(false)
        setTimeout(() => {
            setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
            setFade(true)
        }, 300)
    }

    const goToSlide = (index) => {
        setFade(false)
        setTimeout(() => {
            setCurrent(index)
            setFade(true)
        }, 300)
    }

    useEffect(() => {
        startAutoSlide()
        return () => stopAutoSlide()
    }, [])

    return (
        <div className="relative w-full h-[80vh] overflow-hidden">
            {/* Slide Images */}
            <div
                className="flex w-full h-full transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div key={index} className="min-w-full h-full relative">
                        <img
                            src={slide.image}
                            alt={`slide-${index}`}
                            className="w-full h-full object-cover"
                        />
                        {/* Black overlay */}
                        <div className="absolute inset-0 bg-black opacity-50" />
                    </div>
                ))}
            </div>

            {/* Static Text & Button Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
                <div
                    className={`transition-opacity duration-500 ${
                        fade ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
                        {slides[current].heading}
                    </h1>
                    <p className="mt-4 text-lg md:text-2xl text-gray-200 drop-shadow-md">
                        {slides[current].subtext}
                    </p>
                </div>
                <button className="mt-6 px-6 py-3 bg-orange-500 text-gray-100 font-semibold rounded-lg shadow hover:bg-orange-600 transition z-20">
                    Get Started
                </button>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full text-white z-20"
            >
                <ChevronLeft size={28} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full text-white z-20"
            >
                <ChevronRight size={28} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 w-full flex justify-center gap-3 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                            current === index
                                ? 'bg-orange-500 scale-125'
                                : 'bg-orange-200 bg-opacity-60 hover:bg-opacity-90 hover:bg-orange-300'
                        }`}
                    />
                ))}
            </div>
        </div>
    )
}

export default HeroSlider
