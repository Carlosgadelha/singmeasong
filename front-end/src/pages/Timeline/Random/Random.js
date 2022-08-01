/* eslint-disable react/jsx-props-no-spreading */
import useRecommendation from "../../../hooks/api/useRecommendation";

import Recommendation from "../../../components/Recommendation";

export default function Random() {
  const { recommendation, updateRecommendation } = useRecommendation();

  const handleUpdate = () => {
    updateRecommendation(recommendation.id);
  }

  if (!recommendation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recommendations">
      <Recommendation
        {...recommendation}
        onUpvote={handleUpdate}
        onDownvote={handleUpdate}
      />
    </div>
    
  );
}
