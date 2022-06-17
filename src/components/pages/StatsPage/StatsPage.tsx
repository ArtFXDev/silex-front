import PageWrapper from "../PageWrapper/PageWrapper";
import ProjectsProgressChart from "./ProjectsProgressChart";

const ProfilePage = (): JSX.Element => {
  return (
    <PageWrapper goBack title="Statistics" centerContent paddingTop={35}>
      <ProjectsProgressChart />
    </PageWrapper>
  );
};

export default ProfilePage;
