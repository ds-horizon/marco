import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { IData } from '../App.interface';
import { getAutoSuggestionMarkers } from '../App.utility';
import Logo from '../assets/logo.png';
import './TimelineSelector.css';

interface TimelineSelectorProps {
  data: IData[];
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const Header = () => {
  return (
    <div className="container ml-6 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={Logo}
            alt="React Native Performance Tracker Icon"
            className="w-10 h-10 mr-2"
          />
          <h1 className="text-xl font-bold text-red-800">
            React Native{' '}
            <span className="text-red-800">Performance Tracker</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

const TimeLineSelector: React.FC<TimelineSelectorProps> = ({
  data,
  selectedTags,
  setSelectedTags,
}) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const uniqueSortedData = useMemo(
    () => getAutoSuggestionMarkers(data),
    [data]
  );

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else if (prev.length < 2) {
        return [...prev, tag].sort((a, b) => {
          const indexA = uniqueSortedData.findIndex((t) => t === a);
          const indexB = uniqueSortedData.findIndex((t) => t === b);
          return indexA - indexB;
        });
      } else {
        alert(
          '⚠️ Limit Reached! You can only select up to 2 markers. Please deselect one to select another. 😊'
        );
      }
      return prev;
    });
  };

  const getColor = (index: number) => {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F06292',
      '#AED581',
      '#7986CB',
      '#4DB6AC',
      '#FFD54F',
    ];
    return colors[index % colors.length];
  };

  const isDisabled = (index: number) => {
    if (selectedTags.length === 0) return false;
    const firstSelectedIndex = uniqueSortedData.findIndex(
      (tag) => tag === selectedTags[0]
    );
    return index < firstSelectedIndex;
  };

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      checkScroll();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScroll);
      }
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth / 2;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Calculate the width based on the number of items, with a minimum width and extra padding
  const svgWidth = Math.max(1000, uniqueSortedData.length * 150 + 300);

  return (
    <div className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
      <Header />

      <div className="max-w-full mx-auto px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={() => handleScroll('left')}
            className={`p-2 rounded-full text-white ${canScrollLeft ? 'hover:bg-white hover:bg-opacity-20' : 'opacity-50 cursor-not-allowed'}`}
            disabled={!canScrollLeft}
          >
            <ChevronLeft size={36} />
          </button>
          <div className="relative flex-grow overflow-hidden">
            <div
              className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-blue-500 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
                canScrollLeft ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto scrollbar-hide scroll-container"
            >
              <svg className="h-32" style={{ width: `${svgWidth}px` }}>
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <line
                  x1="0"
                  y1="60"
                  x2={svgWidth}
                  y2="60"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                {uniqueSortedData.map((tag, index) => {
                  const xPosition =
                    (index / (uniqueSortedData.length - 1)) * (svgWidth - 300) +
                    150;
                  const color = getColor(index);
                  const isSelected = selectedTags.includes(tag);
                  const disabled = isDisabled(index);
                  const isEven = index % 2 === 0;
                  return (
                    <g key={`${tag}`}>
                      <circle
                        cx={xPosition}
                        cy="60"
                        r="14"
                        fill={
                          isSelected
                            ? color
                            : disabled
                              ? 'rgba(255,255,255,0.3)'
                              : 'rgba(255,255,255,0.8)'
                        }
                        stroke={disabled ? 'rgba(255,255,255,0.3)' : color}
                        strokeWidth="2"
                        filter="url(#glow)"
                        className={`transition-all duration-300 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:r-16'}`}
                        onClick={() => !disabled && handleTagClick(tag)}
                      />
                      {isSelected && (
                        <Check
                          size={16}
                          x={xPosition - 8}
                          y={52}
                          color="white"
                          className="pointer-events-none"
                        />
                      )}
                      <text
                        x={xPosition}
                        y={isEven ? 40 : 90}
                        textAnchor="middle"
                        fill="white"
                        fontSize="16"
                        className="font-sans font-semibold"
                      >
                        {tag}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div
              className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-purple-600 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
                canScrollRight ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
          <button
            onClick={() => handleScroll('right')}
            className={`p-2 rounded-full text-white ${canScrollRight ? 'hover:bg-white hover:bg-opacity-20' : 'opacity-50 cursor-not-allowed'}`}
            disabled={!canScrollRight}
          >
            <ChevronRight size={36} />
          </button>
          <button
            onClick={() => setSelectedTags([])}
            disabled={selectedTags.length < 1}
            className={`ml-4 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              selectedTags.length === 2
                ? 'bg-white text-purple-600 hover:bg-opacity-90'
                : 'bg-white bg-opacity-30 text-white cursor-not-allowed'
            }`}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeLineSelector;
