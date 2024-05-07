interface Props {
  fill: string;
}

const SVGStar = ({ fill = 'none' }: Props) => {
  const fillColor = fill === 'half' ? 'url(#half)' : fill;

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="half">
          <stop offset="50%" stopColor="gold" />
          <stop offset="50%" stopColor="white" />
        </linearGradient>
      </defs>
      <path
        fill={fillColor}
        d="M12 .587l3.668 7.425 8.2.637-6 5.847 1.4 8.174L12 18.256l-7.268 3.414 1.4-8.174-6-5.847 8.2-.637L12 .587z"
      />
    </svg>
  );
};

export default SVGStar;
