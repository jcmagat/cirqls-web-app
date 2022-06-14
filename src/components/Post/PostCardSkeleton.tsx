import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Skeleton from "@mui/material/Skeleton";

function PostCardSkeleton() {
  return (
    <Card>
      <CardHeader
        avatar={
          <Skeleton
            variant="circular"
            animation="wave"
            width={40}
            height={40}
          />
        }
        title={
          <Skeleton
            animation="wave"
            height={10}
            width="20%"
            sx={{ marginBottom: 1 }}
          />
        }
        subheader={<Skeleton animation="wave" height={10} width="25%" />}
      />
      <Skeleton
        animation="wave"
        height={25}
        width="50%"
        sx={{ marginLeft: 2, marginBottom: 2 }}
      />
      <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
    </Card>
  );
}

export default PostCardSkeleton;
