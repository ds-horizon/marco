import { SVGProps } from 'react';

const Icon = (props: SVGProps<SVGSVGElement>) => (
  <a
    href={`https://marco.dreamsportslabs.com/guides/app-startup/`}
    target="_blank"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 112 92"
      height={24} // fixed height
      width={24 * (112 / 92)} // ≈ 29.2
      fill="none"
      {...props}
    >
      <path
        fill="#fff"
        d="M15.5 91 16 1h18l33.797 49.06h-8.032L93.425.22h18.488v91H86.668V42.353l3.697 1.027-18.487 26.718h-16.32L37.197 43.38l3.57-1.027V91H15.5Z"
      />
      <g clipPath="url(#a)">
        <path fill="#4ADE80" d="M0 1h20v9H0z" />
        <path fill="#22C55E" d="M0 10h20v9H0zM0 19h20v9H0z" />
        <path fill="#16A34A" d="M0 28h20v9H0zM0 37h20v9H0zM0 46h20v9H0z" />
        <path
          fill="#15803D"
          d="M0 55h20v9H0zM0 64h20v9H0zM0 73h20v9H0zM0 82h20v9H0z"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 3a2 2 0 0 1 2-2h18v90H2a2 2 0 0 1-2-2V3Z" />
        </clipPath>
      </defs>
    </svg>
  </a>
);

export default Icon;
