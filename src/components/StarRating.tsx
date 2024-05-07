import SVGStar from './SVGStar';

interface Props {
  rating: number;
}

const StarRating = ({ rating }: Props) => {
  const totalStars = 5;
  let remaningRating = rating;

  const stars = Array.from({ length: totalStars }).map((_, index) => {
    let fill = 'white';

    if (remaningRating >= 1) {
      fill = 'gold';
      remaningRating -= 1;
    } else if (remaningRating > 0) {
      fill = 'half';
      remaningRating = 0;
    }
    // eslint-disable-next-line react/no-array-index-key
    return <SVGStar key={index} fill={fill} />;
  });

  return <div className="flex space-x-1">{stars}</div>;
};
export default StarRating;
